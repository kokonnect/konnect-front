import React, { useState } from "react";
import {
  Modal,
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTranslation } from "react-i18next";

import { Child } from "@/types";

const primaryColor = "#00B493";

interface AddChildrenModalProps {
  showChildModal: boolean;
  editingChild: Child | null;
  childName: string;
  childBirthdate: Date;
  childSchool: string;
  childGrade: string;
  childClass: string;
  childTeacherName: string;
  setChildName: (value: string) => void;
  setChildBirthdate: (value: Date) => void;
  setChildSchool: (value: string) => void;
  setChildGrade: (value: string) => void;
  setChildClass: (value: string) => void;
  setChildTeacherName: (value: string) => void;
  handleModalClose: () => void;
  handleSaveChild: () => void;
  handleDeleteChild: () => void;
}

export default function AddChildrenModal({
  showChildModal,
  editingChild,
  childName,
  childBirthdate,
  childSchool,
  childGrade,
  childClass,
  childTeacherName,
  setChildName,
  setChildBirthdate,
  setChildSchool,
  setChildGrade,
  setChildClass,
  setChildTeacherName,
  handleModalClose,
  handleSaveChild,
  handleDeleteChild,
}: AddChildrenModalProps) {
  const { t } = useTranslation();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setChildBirthdate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    if (!date) return "";
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <Modal
      visible={showChildModal}
      transparent={true}
      animationType="slide"
      onRequestClose={handleModalClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.childModal}>
          <View style={styles.childModalHeader}>
            <Text style={styles.childModalTitle}>
              {editingChild
                ? t("profile:children.editChild")
                : t("profile:children.addChild")}
            </Text>
            <TouchableOpacity onPress={handleModalClose}>
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.childForm}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {t("profile:children.form.name")}
              </Text>
              <TextInput
                style={styles.textInput}
                value={childName}
                onChangeText={setChildName}
                placeholder={t("profile:children.form.namePlaceholder")}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {t("profile:children.form.birthdate")}
              </Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {formatDate(childBirthdate)}
                </Text>
                <MaterialCommunityIcons
                  name="calendar"
                  size={20}
                  color="#666"
                />
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={childBirthdate}
                  mode="date"
                  display="spinner"
                  maximumDate={new Date()}
                  onChange={handleDateChange}
                />
              )}
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {t("profile:children.form.school")}
              </Text>
              <TextInput
                style={styles.textInput}
                value={childSchool}
                onChangeText={setChildSchool}
                placeholder={t("profile:children.form.schoolPlaceholder")}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {t("profile:children.form.grade")}
              </Text>
              <TextInput
                style={styles.textInput}
                value={childGrade}
                onChangeText={setChildGrade}
                placeholder={t("profile:children.form.gradePlaceholder")}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {t("profile:children.form.class")}
              </Text>
              <TextInput
                style={styles.textInput}
                value={childClass}
                onChangeText={setChildClass}
                placeholder={t("profile:children.form.classPlaceholder")}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>
                {t("profile:children.form.teacher")}
              </Text>
              <TextInput
                style={styles.textInput}
                value={childTeacherName}
                onChangeText={setChildTeacherName}
                placeholder={t("profile:children.form.teacherPlaceholder")}
              />
            </View>

            <View style={styles.modalButtons}>
              <View style={styles.actionButtons}>
                {editingChild && (
                  <TouchableOpacity
                    style={styles.deleteButton}
                    onPress={handleDeleteChild}
                  >
                    <Text style={styles.deleteButtonText}>
                      {t("common:delete")}
                    </Text>
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  style={styles.saveChildButton}
                  onPress={handleSaveChild}
                >
                  <Text style={styles.saveChildButtonText}>
                    {t("common:save")}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },
  childModal: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "90%",
    paddingBottom: 20,
  },
  childModalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  childModalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  childForm: {
    padding: 20,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateInput: {
    backgroundColor: "#f8f8f8",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  dateText: {
    fontSize: 16,
    color: "#333",
  },
  modalButtons: {
    marginTop: 20,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  deleteButton: {
    flex: 1,
    backgroundColor: "#ff4444",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  cancelButtonText: {
    color: "#666",
    fontSize: 16,
    fontWeight: "600",
  },
  saveChildButton: {
    flex: 1,
    backgroundColor: primaryColor,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: "center",
  },
  saveChildButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
