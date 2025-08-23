# 번역 API 플로우 문서

## 개요

Konnect 번역 시스템은 한국어 학교 문서에 대한 파일 번역 기능을 제공합니다. 사용자는 이미지(카메라/갤러리) 또는 PDF 파일을 업로드할 수 있으며, 백엔드 API를 사용하여 선호하는 언어로 번역됩니다.

### 아키텍처 개요

```text
UI 컴포넌트 (index.tsx)
    ↓ 사용자가 파일 선택
파일 피커 유틸 (filePicker.ts)  
    ↓ FileTranslationRequest 생성
React 훅 (fileTranslateHooks.ts)
    ↓ Redux 액션 디스패치
Redux 스토어 (translateSlice.ts)
    ↓ API 서비스 호출
API 서비스 (translateApi.ts)
    ↓ HTTP 요청
백엔드 API
    ↓ 번역 응답
Redux 스토어 → UI 업데이트
```

## 파일 구조 및 역할

### 1. 타입 정의 (`/types/translate.ts`)
**목적**: 타입 안정성을 위한 TypeScript 인터페이스 및 열거형

**주요 타입**:
```typescript
// 지원되는 파일 타입
enum FileType {
  IMAGE = "IMAGE",
  PDF = "PDF"
}

// 지원되는 번역 언어  
enum TargetLanguage {
  ENGLISH = "ENGLISH",
  KOREAN = "KOREAN", 
  VIETNAMESE = "VIETNAMESE",
  CHINESE = "CHINESE",
  THAI = "THAI",
  JAPANESE = "JAPANESE",
  FILIPINO = "FILIPINO", 
  KHMER = "KHMER"
}

// API로 전송되는 요청 형식
interface FileTranslationRequest {
  file: File | FormData;
  fileType: FileType;
  targetLanguage: TargetLanguage;
  useSimpleLanguage?: boolean;
  sourceLanguageHint?: string;
}

// API로부터 받는 응답 형식
interface FileTranslationResponse {
  extractedText: string;           // 추출된 원문
  translatedText: string;         // 번역된 텍스트
  summary: string;                // 요약
  originalFileName: string;       // 원본 파일명
  fileType: FileType;            // 파일 타입
  targetLanguage: TargetLanguage; // 번역 대상 언어
  targetLanguageName: string;     // 언어 이름
  usedSimpleLanguage: boolean;    // 쉬운 언어 사용 여부
  fileSize: number;              // 파일 크기
  originalTextLength: number;     // 원문 길이
  translatedTextLength: number;   // 번역문 길이
  totalProcessingTimeMs: number;  // 처리 시간(ms)
  pageCount: number;             // 페이지 수
  sourceLanguageHint?: string;   // 원본 언어 힌트
}
```

### 2. 파일 피커 유틸 (`/utils/filePicker.ts`)
**목적**: 디바이스 파일 선택 처리 및 번역 요청 생성

**주요 함수**:
- `pickImageFromGallery()` - 권한 확인과 함께 갤러리 이미지 선택
- `pickImageFromCamera()` - 권한 확인과 함께 카메라 촬영  
- `pickPDF()` - PDF 문서 선택
- `getTargetLanguageFromI18n()` - 사용자의 i18n 언어를 API 형식으로 매핑

**파일 처리 플로우**:
1. 디바이스 권한 요청 (카메라/미디어 라이브러리)
2. 네이티브 피커 열기 (ImagePicker/DocumentPicker)
3. 선택된 파일 URI를 fetch/blob을 사용하여 File 객체로 변환
4. 사용자의 현재 언어로 FileTranslationRequest 생성
5. 요청 객체 반환 또는 취소/실패 시 null 반환

**언어 매핑**:
```typescript
const languageMapping = {
  en: TargetLanguage.ENGLISH,
  ko: TargetLanguage.KOREAN,
  vi: TargetLanguage.VIETNAMESE,
  zh: TargetLanguage.CHINESE,
  th: TargetLanguage.THAI, 
  ja: TargetLanguage.JAPANESE,
  tl: TargetLanguage.FILIPINO,
  km: TargetLanguage.KHMER,
};
```

### 3. API 서비스 (`/services/translateApi.ts`)  
**목적**: 백엔드 API와의 HTTP 통신 처리

**주요 메서드**:
- `translateFile(request)` - 메인 번역 엔드포인트
- `retranslateFile(params)` - 다른 설정으로 재번역
- `createMockTranslation(request)` - 개발/테스트용 모의 데이터

**API 요청 형식**:
```typescript
// POST /api/[문서번역]-번역 으로 전송되는 FormData
formData.append("file", fileObject);
formData.append("fileType", "IMAGE" | "PDF");  
formData.append("targetLanguage", "ENGLISH" | "KOREAN" | ...);
formData.append("useSimpleLanguage", "true" | "false");
formData.append("sourceLanguageHint", "선택적 힌트");
```

**환경 설정**:
- 개발환경: 2초 지연과 함께 `createMockTranslation()` 사용
- 프로덕션: 실제 백엔드 API 호출
- Base URL: `process.env.EXPO_PUBLIC_API_URL` 또는 `http://localhost:8080`

### 4. Redux 스토어 (`/store/features/translate/translateSlice.ts`)
**목적**: 번역 데이터의 중앙집중식 상태 관리

**상태 구조**:
```typescript
interface TranslationState {
  // 현재 번역 요청
  currentRequest: FileTranslationRequest | null;
  
  // 로딩 상태
  isTranslating: boolean;
  
  // UI 상태  
  activeTab: "summary" | "fullText" | "events" | "vocabulary";
  showWarning: boolean;
  
  // 에러 상태
  error: string | null;
  uploadError: string | null; 
  translationError: string | null;
  
  // 번역 결과
  currentResult: FileTranslationResponse | null;
}
```

**비동기 Thunk**:
- `translateFileThunk` - 메인 번역 액션
- `retranslateFileThunk` - 재번역 액션

**액션**:
- `clearTranslation()` - 상태 초기화
- `setActiveTab()` - UI 탭 변경
- `setShowWarning()` - 경고 표시 토글
- `setCurrentRequest()` - 파일 요청 저장
- 에러 정리 액션들

### 5. React 훅 (`/hooks/fileTranslateHooks.ts`)
**목적**: React 컴포넌트와 Redux 스토어 간의 브리지

**메인 훅** - `useFileTranslation()`:
```typescript
const {
  // 상태
  currentRequest,
  isTranslating, 
  translationResult,
  translationError,
  
  // 액션  
  translateFile,
  clearTranslation,
  clearError,
  
  // 계산된 값
  hasActiveRequest,
  hasResult
} = useFileTranslation();
```

**추가 훅**:
- `useFileTranslationResult()` - 결과 데이터 빠른 접근
- `useFileTranslationLifecycle()` - 상태 관리 유틸리티

### 6. UI 컴포넌트 (`/app/(tabs)/translate/index.tsx`)
**목적**: 사용자 인터페이스 및 상호작용 처리

**주요 기능**:
- 파일 업로드 버튼 (이미지/PDF)
- 이미지 소스 선택을 위한 커스텀 모달 (카메라 vs 갤러리)
- 탭이 있는 번역 결과 표시 (요약/전체 텍스트/이벤트/어휘)  
- 로딩 상태 및 에러 처리
- 모든 다른 컴포넌트와의 통합

## 완전한 데이터 플로우

### 단계별 번역 프로세스

#### 1. 사용자 상호작용
- 사용자가 "이미지 업로드" 버튼 탭
- 카메라/갤러리 옵션이 있는 커스텀 모달 표시
- 사용자가 카메라 또는 갤러리 선택

#### 2. 파일 선택
- `handleCameraCapture()` 또는 `handleGallerySelect()` 호출
- 더 나은 UX를 위해 모달 즉시 닫힘
- 적절한 파일 피커 함수 호출:
  - `pickImageFromCamera()` 또는 `pickImageFromGallery()`

#### 3. 파일 처리  
```typescript
// 파일 피커 함수 내부
const result = await ImagePicker.launchImageLibraryAsync({...});
if (!result.canceled) {
  const asset = result.assets[0];
  
  // URI를 File 객체로 변환
  const response = await fetch(asset.uri);
  const blob = await response.blob(); 
  const file = new File([blob], fileName, { type: mimeType });
  
  // 번역 요청 생성
  return {
    file,
    fileType: FileType.IMAGE,
    targetLanguage: getTargetLanguageFromI18n(), // 사용자의 현재 언어
    useSimpleLanguage: true,
  };
}
```

#### 4. Redux 통합
```typescript  
// UI 컴포넌트에서
const request = await pickImageFromGallery();
if (request) {
  await translateFile(request); // 훅 호출
}

// useFileTranslation 훅 내부
const translateFile = useCallback(async (request) => {
  // 스토어에 현재 요청 설정
  dispatch(setCurrentRequest(request));
  
  // 번역 시작 (Redux thunk 호출)
  await dispatch(translateFileThunk(request)).unwrap();
}, [dispatch]);
```

#### 5. API 통신
```typescript
// translateFileThunk 내부
const response = await translateApi.translateFile(request);

// translateApi.translateFile() 내부
const formData = new FormData();
formData.append("file", request.file);
formData.append("fileType", request.fileType);
formData.append("targetLanguage", request.targetLanguage);

const response = await fetch(`${baseUrl}/api/[문서번역]-번역`, {
  method: "POST",
  body: formData,
  headers: { Accept: "application/json" }
});

return await response.json();
```

#### 6. 상태 업데이트
```typescript
// Redux slice가 thunk 생명주기 처리
.addCase(translateFileThunk.pending, (state) => {
  state.isTranslating = true;
  state.translationError = null; 
})
.addCase(translateFileThunk.fulfilled, (state, action) => {
  state.isTranslating = false;
  state.currentResult = action.payload; // FileTranslationResponse
})
.addCase(translateFileThunk.rejected, (state, action) => {
  state.isTranslating = false; 
  state.translationError = action.payload as string;
})
```

#### 7. UI 재렌더링
- 훅 선택자가 자동으로 컴포넌트 업데이트
- 로딩 스피너 사라짐 (`isTranslating: false`)
- 번역 결과 표시 (`translationResult` 채워짐)
- 사용자가 요약, 전체 텍스트 등을 볼 수 있음

## 에러 처리

### 에러 타입
1. **파일 선택 에러**: 권한 거부, 피커 취소
2. **업로드 에러**: 파일 크기 초과, 지원되지 않는 형식  
3. **API 에러**: 네트워크 문제, 서버 에러, 잘못된 응답
4. **번역 에러**: 백엔드 처리 실패

### 에러 플로우
```typescript
// 파일 피커 레벨
try {
  const request = await pickImageFromGallery();
  if (request) await translateFile(request);
} catch (error) {
  console.error("갤러리 번역 실패:", error);
  showAlert("번역 에러", "선택한 이미지 번역에 실패했습니다");
}

// Redux thunk 레벨  
try {
  return await translateApi.translateFile(request);
} catch (error) {
  return rejectWithValue(
    error instanceof Error ? error.message : "번역 실패"
  );
}

// UI 표시
{translationError && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>
      번역 에러: {translationError}
    </Text>
  </View>
)}
```

## 개발 vs 프로덕션

### 환경 감지
```typescript
const isDevelopment = process.env.NODE_ENV === "development";
if (isDevelopment) {
  return await translateApi.createMockTranslation(request);
} else {
  return await translateApi.translateFile(request);
}
```

### 모의 번역
- 네트워크 요청을 시뮬레이션하는 2초 지연
- API 응답 형식과 일치하는 현실적인 가짜 데이터 반환
- 백엔드 의존성 없이 프론트엔드 개발 가능

## 개발자 가이드라인

### 새로운 파일 타입 추가
1. **`FileType` 열거형 업데이트** `/types/translate.ts`에서
2. **피커 함수 추가** `/utils/filePicker.ts`에서  
3. **API 서비스 업데이트** FormData에서 새 타입 처리
4. **UI 버튼 추가** 번역 화면에서

### 새로운 언어 추가
1. **`TargetLanguage` 열거형 업데이트** `/types/translate.ts`에서
2. **매핑 추가** `getTargetLanguageFromI18n()` 함수에서
3. **i18n 지원 추가** `/locales/` 디렉토리에서
4. **언어 전환 플로우 테스트**

### API 엔드포인트 수정
1. **base URL 업데이트** `translateApi.ts` 생성자에서
2. **엔드포인트 경로 수정** `translateFile()` 및 `retranslateFile()`에서
3. **요청/응답 형식 업데이트** 백엔드 변경 시
4. **개발 및 프로덕션 모드 모두 테스트**

### 테스트 전략
```typescript
// 유틸리티 단위 테스트
describe('filePicker', () => {
  test('getTargetLanguageFromI18n이 올바르게 매핑', () => {
    // 언어 매핑 로직 테스트
  });
});

// 훅 통합 테스트
describe('useFileTranslation', () => {
  test('translateFile이 상태를 올바르게 업데이트', async () => {
    // Redux 통합 테스트
  });
});

// 전체 플로우 E2E 테스트
describe('번역 플로우', () => {  
  test('사용자가 이미지를 업로드하고 번역할 수 있음', async () => {
    // 완전한 사용자 여정 테스트
  });
});
```

### 일반적인 문제 디버깅

#### 파일 업로드 실패
- 디바이스 권한 확인 (카메라/미디어 라이브러리)
- 파일 크기 제한 확인
- 네트워크 연결 확인
- 웹 빌드에서 CORS 문제 확인

#### 번역이 시작되지 않음  
- Redux DevTools에서 액션 디스패치 확인
- `isTranslating` 상태 업데이트 확인
- API 서비스 콘솔 로그 확인
- 파일이 File 객체로 올바르게 변환되었는지 확인

#### 결과가 표시되지 않음
- Redux 스토어의 `translationResult` 확인
- 상태 업데이트 후 컴포넌트 재렌더링 확인
- 결과 매핑에서 TypeScript 에러 확인
- 탭 전환 로직 확인

## 코드 예제

### 컴포넌트에서 훅 사용
```typescript
import { useFileTranslation } from '@/hooks';

function MyComponent() {
  const { 
    isTranslating,
    translationResult, 
    translateFile,
    clearTranslation 
  } = useFileTranslation();
  
  const handleTranslate = async () => {
    const request = await pickPDF();
    if (request) await translateFile(request);
  };
  
  return (
    <View>
      {isTranslating && <Spinner />}
      {translationResult && (
        <Text>{translationResult.summary}</Text>
      )}
      <Button onPress={handleTranslate} title="번역하기" />
    </View>
  );
}
```

### 번역 슬라이스 확장
```typescript  
// 새 액션 추가
const translateSlice = createSlice({
  name: 'translate',
  initialState,
  reducers: {
    // 기존 리듀서들...
    setCustomSetting: (state, action) => {
      state.customSetting = action.payload;
    }
  }
});

// 새 thunk 추가
export const customTranslationThunk = createAsyncThunk(
  'translate/customTranslation',
  async (params: CustomParams) => {
    return await translateApi.customMethod(params);
  }
);
```

### 커스텀 파일 피커 통합
```typescript
const pickCustomFile = async (): Promise<FileTranslationRequest | null> => {
  try {
    // 커스텀 파일 선택 로직
    const selectedFile = await customFilePicker();
    
    if (selectedFile) {
      return {
        file: selectedFile,
        fileType: FileType.IMAGE, // 또는 동적으로 결정
        targetLanguage: getTargetLanguageFromI18n(),
        useSimpleLanguage: true,
      };
    }
  } catch (error) {
    console.error('커스텀 피커 에러:', error);
    showAlert('에러', '파일 선택에 실패했습니다');
  }
  
  return null;
};
```

## 향후 개선사항

### 계획된 기능
- **번역 기록**: 과거 번역 저장 및 검색
- **배치 번역**: 여러 파일 동시 업로드
- **고급 언어 옵션**: 커스텀 언어 쌍
- **오프라인 모드**: 오프라인 보기를 위한 번역 캐싱
- **실시간 번역**: 라이브 카메라 번역

### 아키텍처 고려사항
- 큰 파일을 위한 Web Workers로의 파일 처리 이동 고려
- 번역 결과를 위한 적절한 캐싱 전략 구현
- 실패한 API 요청을 위한 재시도 로직 추가
- 성능 향상을 위한 큰 번역 응답 분할 고려

---

## 빠른 참조

### 파일 위치
- **타입**: `/types/translate.ts`
- **유틸**: `/utils/filePicker.ts`  
- **API**: `/services/translateApi.ts`
- **스토어**: `/store/features/translate/translateSlice.ts`
- **훅**: `/hooks/fileTranslateHooks.ts`
- **UI**: `/app/(tabs)/translate/index.tsx`

### 주요 명령어
```bash
# 개발 모드 실행 (모의 데이터 사용)
npm run dev

# 프로덕션 빌드  
npm run build

# 린팅 실행
npm run lint

# 테스트 실행
npm test
```

### 환경 변수
```env
EXPO_PUBLIC_API_URL=http://your-backend-api.com
NODE_ENV=development # 또는 production
```

이 문서는 API와 구현이 발전함에 따라 업데이트되어야 합니다. 가장 최신의 구현 세부사항은 항상 실제 코드를 참조하세요.