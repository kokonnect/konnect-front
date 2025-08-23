# Translation API Flow Documentation

## Overview

The Konnect translation system provides file translation functionality for Korean school documents. Users can upload images (camera/gallery) or PDF files, which are then translated to their preferred language using a backend API.

### Architecture Overview

```
UI Component (index.tsx)
    ↓ User selects file
File Picker Utils (filePicker.ts)  
    ↓ Creates FileTranslationRequest
React Hook (fileTranslateHooks.ts)
    ↓ Dispatches Redux action
Redux Store (translateSlice.ts)
    ↓ Calls API service
API Service (translateApi.ts)
    ↓ HTTP request
Backend API
    ↓ Translation response
Redux Store → UI Update
```

## File Structure & Responsibilities

### 1. Types (`/types/translate.ts`)
**Purpose**: TypeScript interfaces and enums for type safety

**Key Types**:
```typescript
// File types supported
enum FileType {
  IMAGE = "IMAGE",
  PDF = "PDF"
}

// Supported translation languages  
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

// Request format sent to API
interface FileTranslationRequest {
  file: File | FormData;
  fileType: FileType;
  targetLanguage: TargetLanguage;
  useSimpleLanguage?: boolean;
  sourceLanguageHint?: string;
}

// Response format from API  
interface FileTranslationResponse {
  extractedText: string;
  translatedText: string;
  summary: string;
  originalFileName: string;
  fileType: FileType;
  targetLanguage: TargetLanguage;
  targetLanguageName: string;
  usedSimpleLanguage: boolean;
  fileSize: number;
  originalTextLength: number;
  translatedTextLength: number;
  totalProcessingTimeMs: number;
  pageCount: number;
  sourceLanguageHint?: string;
}
```

### 2. File Picker Utils (`/utils/filePicker.ts`)
**Purpose**: Handle device file selection and create translation requests

**Key Functions**:
- `pickImageFromGallery()` - Gallery image selection with permissions
- `pickImageFromCamera()` - Camera capture with permissions  
- `pickPDF()` - PDF document selection
- `getTargetLanguageFromI18n()` - Maps user's i18n language to API format

**File Processing Flow**:
1. Request device permissions (camera/media library)
2. Open native picker (ImagePicker/DocumentPicker)
3. Convert selected file URI to File object using fetch/blob
4. Create FileTranslationRequest with user's current language
5. Return request object or null if cancelled/failed

**Language Mapping**:
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

### 3. API Service (`/services/translateApi.ts`)  
**Purpose**: Handle HTTP communication with backend API

**Key Methods**:
- `translateFile(request)` - Main translation endpoint
- `retranslateFile(params)` - Re-translate with different settings
- `createMockTranslation(request)` - Development/testing mock data

**API Request Format**:
```typescript
// FormData sent to POST /api/[문서번역]-번역
formData.append("file", fileObject);
formData.append("fileType", "IMAGE" | "PDF");  
formData.append("targetLanguage", "ENGLISH" | "KOREAN" | ...);
formData.append("useSimpleLanguage", "true" | "false");
formData.append("sourceLanguageHint", "optional hint");
```

**Environment Configuration**:
- Development: Uses `createMockTranslation()` with 2-second delay
- Production: Calls actual backend API
- Base URL: `process.env.EXPO_PUBLIC_API_URL` or `http://localhost:8080`

### 4. Redux Store (`/store/features/translate/translateSlice.ts`)
**Purpose**: Centralized state management for translation data

**State Structure**:
```typescript
interface TranslationState {
  // Current translation request
  currentRequest: FileTranslationRequest | null;
  
  // Loading state
  isTranslating: boolean;
  
  // UI state  
  activeTab: "summary" | "fullText" | "events" | "vocabulary";
  showWarning: boolean;
  
  // Error states
  error: string | null;
  uploadError: string | null; 
  translationError: string | null;
  
  // Translation result
  currentResult: FileTranslationResponse | null;
}
```

**Async Thunks**:
- `translateFileThunk` - Main translation action
- `retranslateFileThunk` - Re-translation action

**Actions**:
- `clearTranslation()` - Reset state
- `setActiveTab()` - Change UI tab
- `setShowWarning()` - Toggle warning display
- `setCurrentRequest()` - Store file request
- Error clearing actions

### 5. React Hook (`/hooks/fileTranslateHooks.ts`)
**Purpose**: Bridge between React components and Redux store

**Main Hook** - `useFileTranslation()`:
```typescript
const {
  // State
  currentRequest,
  isTranslating, 
  translationResult,
  translationError,
  
  // Actions  
  translateFile,
  clearTranslation,
  clearError,
  
  // Computed
  hasActiveRequest,
  hasResult
} = useFileTranslation();
```

**Additional Hooks**:
- `useFileTranslationResult()` - Quick access to result data
- `useFileTranslationLifecycle()` - State management utilities

### 6. UI Component (`/app/(tabs)/translate/index.tsx`)
**Purpose**: User interface and interaction handling

**Key Features**:
- File upload buttons (image/PDF)
- Custom modal for image source selection (camera vs gallery)
- Translation result display with tabs (summary/fullText/events/vocabulary)  
- Loading states and error handling
- Integration with all other components

## Complete Data Flow

### Step-by-Step Translation Process

#### 1. User Interaction
- User taps "Upload Image" button
- Custom modal appears with Camera/Gallery options
- User selects Camera or Gallery

#### 2. File Selection
- `handleCameraCapture()` or `handleGallerySelect()` called
- Modal closes immediately for better UX
- Appropriate file picker function called:
  - `pickImageFromCamera()` or `pickImageFromGallery()`

#### 3. File Processing  
```typescript
// Inside file picker function
const result = await ImagePicker.launchImageLibraryAsync({...});
if (!result.canceled) {
  const asset = result.assets[0];
  
  // Convert URI to File object
  const response = await fetch(asset.uri);
  const blob = await response.blob(); 
  const file = new File([blob], fileName, { type: mimeType });
  
  // Create translation request
  return {
    file,
    fileType: FileType.IMAGE,
    targetLanguage: getTargetLanguageFromI18n(), // User's current language
    useSimpleLanguage: true,
  };
}
```

#### 4. Redux Integration
```typescript  
// In UI component
const request = await pickImageFromGallery();
if (request) {
  await translateFile(request); // Calls hook
}

// Inside useFileTranslation hook  
const translateFile = useCallback(async (request) => {
  // Set current request in store
  dispatch(setCurrentRequest(request));
  
  // Start translation (calls Redux thunk)
  await dispatch(translateFileThunk(request)).unwrap();
}, [dispatch]);
```

#### 5. API Communication
```typescript
// Inside translateFileThunk
const response = await translateApi.translateFile(request);

// Inside translateApi.translateFile()  
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

#### 6. State Updates
```typescript
// Redux slice handles thunk lifecycle
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

#### 7. UI Re-render
- Hook selectors automatically update component
- Loading spinner disappears (`isTranslating: false`)
- Translation results display (`translationResult` populated)
- User can view summary, full text, etc.

## Error Handling

### Error Types
1. **File Selection Errors**: Permission denied, picker cancelled
2. **Upload Errors**: File too large, unsupported format  
3. **API Errors**: Network issues, server errors, invalid response
4. **Translation Errors**: Backend processing failures

### Error Flow
```typescript
// File picker level
try {
  const request = await pickImageFromGallery();
  if (request) await translateFile(request);
} catch (error) {
  console.error("Gallery translation failed:", error);
  showAlert("Translation Error", "Failed to translate the selected image");
}

// Redux thunk level  
try {
  return await translateApi.translateFile(request);
} catch (error) {
  return rejectWithValue(
    error instanceof Error ? error.message : "Translation failed"
  );
}

// UI display
{translationError && (
  <View style={styles.errorContainer}>
    <Text style={styles.errorText}>
      Translation Error: {translationError}
    </Text>
  </View>
)}
```

## Development vs Production

### Environment Detection
```typescript
const isDevelopment = process.env.NODE_ENV === "development";
if (isDevelopment) {
  return await translateApi.createMockTranslation(request);
} else {
  return await translateApi.translateFile(request);
}
```

### Mock Translation
- 2-second delay to simulate network request
- Returns realistic fake data matching API response format
- Allows frontend development without backend dependency

## Developer Guidelines

### Adding New File Types
1. **Update `FileType` enum** in `/types/translate.ts`
2. **Add picker function** in `/utils/filePicker.ts`  
3. **Update API service** to handle new type in FormData
4. **Add UI button** in translate screen

### Adding New Languages
1. **Update `TargetLanguage` enum** in `/types/translate.ts`
2. **Add mapping** in `getTargetLanguageFromI18n()` function
3. **Add i18n support** in `/locales/` directory
4. **Test language switching** flow

### Modifying API Endpoints
1. **Update base URL** in `translateApi.ts` constructor
2. **Modify endpoint paths** in `translateFile()` and `retranslateFile()`
3. **Update request/response formats** if backend changes
4. **Test both development and production modes**

### Testing Strategy
```typescript
// Unit tests for utilities
describe('filePicker', () => {
  test('getTargetLanguageFromI18n maps correctly', () => {
    // Test language mapping logic
  });
});

// Integration tests for hooks
describe('useFileTranslation', () => {
  test('translateFile updates state correctly', async () => {
    // Test Redux integration
  });
});

// E2E tests for full flow
describe('Translation Flow', () => {  
  test('user can upload and translate image', async () => {
    // Test complete user journey
  });
});
```

### Debugging Common Issues

#### File Upload Fails
- Check device permissions (camera/media library)
- Verify file size limits
- Check network connectivity 
- Look for CORS issues in web builds

#### Translation Doesn't Start  
- Check Redux DevTools for action dispatching
- Verify `isTranslating` state updates
- Check API service console logs
- Confirm file was properly converted to File object

#### Results Don't Display
- Check `translationResult` in Redux store
- Verify component re-rendering after state update
- Check for TypeScript errors in result mapping
- Confirm tab switching logic

## Code Examples

### Using the Hook in Components
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
      <Button onPress={handleTranslate} title="Translate" />
    </View>
  );
}
```

### Extending Translation Slice
```typescript  
// Add new action
const translateSlice = createSlice({
  name: 'translate',
  initialState,
  reducers: {
    // Existing reducers...
    setCustomSetting: (state, action) => {
      state.customSetting = action.payload;
    }
  }
});

// Add new thunk
export const customTranslationThunk = createAsyncThunk(
  'translate/customTranslation',
  async (params: CustomParams) => {
    return await translateApi.customMethod(params);
  }
);
```

### Custom File Picker Integration
```typescript
const pickCustomFile = async (): Promise<FileTranslationRequest | null> => {
  try {
    // Your custom file selection logic
    const selectedFile = await customFilePicker();
    
    if (selectedFile) {
      return {
        file: selectedFile,
        fileType: FileType.IMAGE, // or determine dynamically
        targetLanguage: getTargetLanguageFromI18n(),
        useSimpleLanguage: true,
      };
    }
  } catch (error) {
    console.error('Custom picker error:', error);
    showAlert('Error', 'Failed to select file');
  }
  
  return null;
};
```

## Future Enhancements

### Planned Features
- **Translation History**: Store and retrieve past translations
- **Batch Translation**: Multiple file uploads
- **Advanced Language Options**: Custom language pairs
- **Offline Mode**: Cache translations for offline viewing
- **Real-time Translation**: Live camera translation

### Architecture Considerations
- Consider moving file processing to Web Workers for large files
- Implement proper caching strategy for translation results  
- Add retry logic for failed API requests
- Consider splitting large translation responses for better performance

---

## Quick Reference

### File Locations
- **Types**: `/types/translate.ts`
- **Utils**: `/utils/filePicker.ts`  
- **API**: `/services/translateApi.ts`
- **Store**: `/store/features/translate/translateSlice.ts`
- **Hooks**: `/hooks/fileTranslateHooks.ts`
- **UI**: `/app/(tabs)/translate/index.tsx`

### Key Commands
```bash
# Run in development (uses mocks)
npm run dev

# Build for production  
npm run build

# Run linting
npm run lint

# Run tests
npm test
```

### Environment Variables
```env
EXPO_PUBLIC_API_URL=http://your-backend-api.com
NODE_ENV=development # or production
```

This documentation should be updated as the API and implementation evolve. Always refer to the actual code for the most current implementation details.