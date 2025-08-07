import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { UploadedFile } from "./types";

const primaryColor = "#00B493";

interface FileStatusProps {
  uploadedFile: UploadedFile | null;
  isTranslating: boolean;
  onRemoveFile: () => void;
}

export default function FileStatus({
  uploadedFile,
  isTranslating,
  onRemoveFile,
}: FileStatusProps) {
  if (!uploadedFile && !isTranslating) return null;

  return (
    <View style={styles.fileStatusContainer}>
      {uploadedFile && (
        <View style={styles.fileInfo}>
          <MaterialCommunityIcons
            name={uploadedFile.type === "pdf" ? "file-pdf-box" : "image"}
            size={20}
            color={primaryColor}
          />
          <Text style={styles.fileName}>{uploadedFile.name}</Text>
          <TouchableOpacity onPress={onRemoveFile} style={styles.removeButton}>
            <MaterialCommunityIcons name="close" size={16} color="#666" />
          </TouchableOpacity>
        </View>
      )}

      {isTranslating && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={styles.loadingText}>Translating document...</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  fileStatusContainer: {
    marginTop: 16,
  },
  fileInfo: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  fileName: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: "#333",
    fontWeight: "500",
  },
  removeButton: {
    padding: 4,
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