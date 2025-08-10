import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

const primaryColor = "#00B493";

interface UploadButtonsProps {
  onImageUpload: () => void;
  onPdfUpload: () => void;
}

export default function UploadButtons({
  onImageUpload,
  onPdfUpload,
}: UploadButtonsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.uploadContainer}>
      <TouchableOpacity
        style={styles.uploadButton}
        onPress={onImageUpload}
        activeOpacity={0.7}
      >
        <MaterialCommunityIcons name="camera" size={32} color={primaryColor} />
        <Text style={styles.uploadButtonText}>
          {t("translate:upload.uploadImage")}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.uploadButton}
        onPress={onPdfUpload}
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
});
