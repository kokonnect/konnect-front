import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Modal } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";

const primaryColor = "#00B493";

interface UploadButtonsProps {
  onImageUpload: () => void;
  onPdfUpload: () => void;
  onCameraCapture: () => void;
  onGallerySelect: () => void;
}

export default function UploadButtons({
  onImageUpload,
  onPdfUpload,
  onCameraCapture,
  onGallerySelect,
}: UploadButtonsProps) {
  const { t } = useTranslation();
  const [showImageModal, setShowImageModal] = useState(false);

  // redux store에 저장해야 함.
  const [image, setImage] = useState<string | null>(null);
  const [pdf, setPdf] = useState<string | null>(null);

  const pickImageGallery = async () => {
    const mediaLibraryPermission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (mediaLibraryPermission.status !== "granted") {
      alert("Media library permission is required to select images.");
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const pickCamera = async () => {
    try {
      const cameraPermission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (cameraPermission.status !== "granted") {
        alert("Camera permission is required to take photos.");
        return;
      }

      let result = await ImagePicker.launchCameraAsync({
        cameraType: ImagePicker.CameraType.back,
        mediaTypes: ["images"],
      });

      console.log(result);

      if (!result.canceled) {
        setImage(result.assets[0].uri);
      }
    } catch (e) {
      console.log(e);
      alert("Error picking image");
    }
  };

  const handleImageUpload = () => {
    setShowImageModal(true);
  };

  const pickPDF = async () => {
    const result = await DocumentPicker.getDocumentAsync({
      type: "application/pdf",
    });

    console.log(result);

    if (!result.canceled) {
      setPdf(result.assets[0].uri);
    }
  };

  const handleCameraCapture = () => {
    console.log("handleCameraCapture");
    pickCamera();
  };

  const handleGallerySelect = () => {
    console.log("handleGallerySelect");
    pickImageGallery();
  };

  const handlePDFUpload = () => {
    pickPDF();
  };

  return (
    <>
      <View style={styles.uploadContainer}>
        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handleImageUpload}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="camera"
            size={32}
            color={primaryColor}
          />
          <Text style={styles.uploadButtonText}>
            {t("translate:upload.uploadImage")}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handlePDFUpload}
          activeOpacity={0.7}
        >
          <MaterialCommunityIcons
            name="file-pdf-box"
            size={32}
            color={primaryColor}
          />
          <Text style={styles.uploadButtonText}>
            {t("translate:upload.uploadPdf")}
          </Text>
        </TouchableOpacity>
      </View>

      {/* Image Upload Modal */}
      <Modal
        visible={showImageModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowImageModal(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowImageModal(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {t("translate:upload.chooseImageSource")}
            </Text>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleCameraCapture}
            >
              <MaterialCommunityIcons
                name="camera"
                size={24}
                color={primaryColor}
              />
              <Text style={styles.modalOptionText}>
                {t("translate:upload.takePhoto")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalOption}
              onPress={handleGallerySelect}
            >
              <MaterialCommunityIcons
                name="image"
                size={24}
                color={primaryColor}
              />
              <Text style={styles.modalOptionText}>
                {t("translate:upload.fromGallery")}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.modalCancel}
              onPress={() => setShowImageModal(false)}
            >
              <Text style={styles.modalCancelText}>{t("common:cancel")}</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  uploadContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 8,
    gap: 16,
  },
  uploadButton: {
    flex: 1,
    aspectRatio: 1,
    backgroundColor: "#fff",
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    borderWidth: 2,
    borderColor: "#f0f0f0",
  },
  uploadButtonText: {
    marginTop: 12,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 24,
    width: "100%",
    maxWidth: 300,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    textAlign: "center",
    marginBottom: 24,
  },
  modalOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 12,
    marginBottom: 8,
    borderRadius: 8,
    backgroundColor: "#f8f8f8",
  },
  modalOptionText: {
    marginLeft: 16,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  modalCancel: {
    marginTop: 16,
    paddingVertical: 12,
    alignItems: "center",
  },
  modalCancelText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "500",
  },
});
