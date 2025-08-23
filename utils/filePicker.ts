import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import { showAlert } from "@/utils/alert";
import { getCurrentLanguage } from "@/locales/i18n";
import {
  FileTranslationRequest,
  FileType,
  TargetLanguage,
} from "@/types/translate";

// [문서 번역] 백엔드 형식에 맞도록 수정 필요
// 함수 위치도 아예 바꿀 수 있다면 좋음
const getTargetLanguageFromI18n = (): TargetLanguage => {
  const currentLang = getCurrentLanguage();

  const languageMapping: Record<string, TargetLanguage> = {
    en: TargetLanguage.ENGLISH,
    ko: TargetLanguage.KOREAN,
    vi: TargetLanguage.VIETNAMESE,
    zh: TargetLanguage.CHINESE,
    th: TargetLanguage.THAI,
    ja: TargetLanguage.JAPANESE,
    tl: TargetLanguage.FILIPINO,
    km: TargetLanguage.KHMER,
  };

  return languageMapping[currentLang] || TargetLanguage.ENGLISH;
};

/**
 * Pick an image from the device gallery
 * Handles permissions and creates FileTranslationRequest
 */
export const pickImageFromGallery =
  async (): Promise<FileTranslationRequest | null> => {
    try {
      const mediaLibraryPermission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (mediaLibraryPermission.status !== "granted") {
        showAlert(
          "Permission Required",
          "Media library permission is required to select images.",
        );
        return null;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        // Create File object from the selected image
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const file = new File([blob], asset.fileName || "selected_image.jpg", {
          type: asset.type || "image/jpeg",
        });

        return {
          file,
          fileType: FileType.IMAGE,
          targetLanguage: getTargetLanguageFromI18n(),
          useSimpleLanguage: true,
        };
      }
    } catch (error) {
      console.error("Error picking image from gallery:", error);
      showAlert("Error", "Failed to select image from gallery");
    }
    return null;
  };

/**
 * Take a photo using the device camera
 * Handles permissions and creates FileTranslationRequest
 */
export const pickImageFromCamera =
  async (): Promise<FileTranslationRequest | null> => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.status !== "granted") {
        showAlert(
          "Permission Required",
          "Camera permission is required to take photos.",
        );
        return null;
      }

      const result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        mediaTypes: ["images"],
        quality: 1,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];

        // Create File object from the camera image
        const response = await fetch(asset.uri);
        const blob = await response.blob();
        const file = new File([blob], asset.fileName || "camera_capture.jpg", {
          type: asset.type || "image/jpeg",
        });

        return {
          file,
          fileType: FileType.IMAGE,
          targetLanguage: getTargetLanguageFromI18n(),
          useSimpleLanguage: true,
        };
      }
    } catch (error) {
      console.error("Error taking photo:", error);
      showAlert("Error", "Failed to take photo");
    }
    return null;
  };

/**
 * Pick a PDF document from the device
 * Creates FileTranslationRequest with PDF file
 */
export const pickPDF = async (): Promise<FileTranslationRequest | null> => {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
      copyToCacheDirectory: true,
    });

    if (!result.canceled && result.assets && result.assets[0]) {
      const asset = result.assets[0];

      // Create File object from the selected PDF
      const response = await fetch(asset.uri);
      const blob = await response.blob();
      const file = new File([blob], asset.name, {
        type: "application/pdf",
      });

      return {
        file,
        fileType: FileType.PDF,
        targetLanguage: getTargetLanguageFromI18n(),
        useSimpleLanguage: true,
      };
    }
  } catch (error) {
    console.error("Error picking PDF:", error);
    showAlert("Error", "Failed to select PDF");
  }
  return null;
};
