import React from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { UploadedFile } from "./types";

const primaryColor = "#00B493";

interface FileStatusProps {
  uploadedFile: UploadedFile | null;
  isTranslating: boolean;
  onRemoveFile?: () => void;
}

export default function FileStatus({
  uploadedFile,
  isTranslating,
  onRemoveFile,
}: FileStatusProps) {
  const { t } = useTranslation();
  if (!uploadedFile && !isTranslating) return null;

  return (
    <View style={styles.fileStatusContainer}>
      {uploadedFile && (
        <View style={styles.fileInfo}>
          <MaterialCommunityIcons
            name={uploadedFile.type === "pdf" ? "file-pdf-box" : "image"}
            size={16}
            color={primaryColor}
          />
          <Text style={styles.fileName}>{uploadedFile.name}</Text>
        </View>
      )}

      {isTranslating && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={styles.loadingText}>
            {t("translate:translation.translating")}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fileStatusContainer: {},
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    // marginBottom: 8,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  fileName: {
    marginLeft: 8,
    fontSize: 14,
    color: "#333",
    fontWeight: "500",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 40,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#666",
  },
});
