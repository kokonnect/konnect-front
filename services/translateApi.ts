import {
  FileTranslationRequest,
  FileTranslationResponse,
  FileType,
  TargetLanguage,
} from "@/types/translate";

class TranslateApi {
  private baseUrl = process.env.EXPO_PUBLIC_API_URL || "http://localhost:8080";

  /**
   * Upload and translate a file
   */
  async translateFile(
    request: FileTranslationRequest,
  ): Promise<FileTranslationResponse> {
    const formData = new FormData();

    // Add file to FormData
    if (request.file instanceof FormData) {
      // If already FormData, extract the file
      const file = request.file.get("file") as File;
      formData.append("file", file);
    } else {
      formData.append("file", request.file);
    }

    // Add other fields
    formData.append("fileType", request.fileType);
    formData.append("targetLanguage", request.targetLanguage);

    if (request.useSimpleLanguage !== undefined) {
      formData.append(
        "useSimpleLanguage",
        request.useSimpleLanguage.toString(),
      );
    }

    if (request.sourceLanguageHint) {
      formData.append("sourceLanguageHint", request.sourceLanguageHint);
    }

    const response = await fetch(`${this.baseUrl}/api/[문서번역]-번역`, {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Translation failed: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Re-translate an existing file with different parameters
   */
  async retranslateFile(
    originalFileName: string,
    targetLanguage: TargetLanguage,
    useSimpleLanguage?: boolean,
    sourceLanguageHint?: string,
  ): Promise<FileTranslationResponse> {
    const requestBody = {
      originalFileName,
      targetLanguage,
      useSimpleLanguage,
      sourceLanguageHint,
    };

    const response = await fetch(`${this.baseUrl}/api/[문서번역]-재번역`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(
        `Retranslation failed: ${response.status} - ${errorText}`,
      );
    }

    return await response.json();
  }

  /**
   * Create mock translation response for development
   */
  async createMockTranslation(
    request: FileTranslationRequest,
  ): Promise<FileTranslationResponse> {
    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 2000));

    const fileName =
      request.file instanceof FormData
        ? (request.file.get("file") as File)?.name || "unknown.pdf"
        : request.file.name;

    return {
      extractedText:
        "이것은 추출된 원본 텍스트입니다. 학교 공지사항에 대한 내용이 포함되어 있습니다.",
      translatedText:
        "This is the extracted original text. It contains content about school announcements.",
      summary:
        "School announcement regarding upcoming parent-teacher conferences and academic events.",
      originalFileName: fileName,
      fileType: request.fileType,
      targetLanguage: request.targetLanguage,
      targetLanguageName: this.getLanguageName(request.targetLanguage),
      usedSimpleLanguage: request.useSimpleLanguage ?? true,
      fileSize: 1024000, // 1MB
      originalTextLength: 150,
      translatedTextLength: 120,
      totalProcessingTimeMs: 3500,
      pageCount: request.fileType === FileType.PDF ? 3 : 1,
      sourceLanguageHint: request.sourceLanguageHint,
    };
  }

  private getLanguageName(language: TargetLanguage): string {
    const languageNames = {
      [TargetLanguage.ENGLISH]: "English",
      [TargetLanguage.KOREAN]: "한국어",
      [TargetLanguage.SPANISH]: "Español",
      [TargetLanguage.FRENCH]: "Français",
      [TargetLanguage.GERMAN]: "Deutsch",
      [TargetLanguage.JAPANESE]: "日本語",
      [TargetLanguage.CHINESE]: "中文",
    };
    return languageNames[language] || language;
  }
}

export const translateApi = new TranslateApi();
