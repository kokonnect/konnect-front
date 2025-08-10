import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { t } from "i18next";

const primaryColor = "#00B493";

const months = [
  { id: 1, name: "January" },
  { id: 2, name: "February" },
  { id: 3, name: "March" },
  { id: 4, name: "April" },
  { id: 5, name: "May" },
  { id: 6, name: "June" },
  { id: 7, name: "July" },
  { id: 8, name: "August" },
  { id: 9, name: "September" },
  { id: 10, name: "October" },
  { id: 11, name: "November" },
  { id: 12, name: "December" },
];

const years = Array.from(
  { length: 10 },
  (_, i) => new Date().getFullYear() - 5 + i,
);

// Optimized render functions
const createYearRenderItem =
  (tempYear: number, setTempYear: (year: number) => void) =>
  ({ item }: { item: number }) => (
    <TouchableOpacity
      style={[
        styles.pickerItem,
        tempYear === item && styles.selectedPickerItem,
      ]}
      onPress={() => setTempYear(item)}
    >
      <Text
        style={[
          styles.pickerItemText,
          tempYear === item && styles.selectedPickerItemText,
        ]}
      >
        {item}
      </Text>
    </TouchableOpacity>
  );

const createMonthRenderItem =
  (tempMonth: number, setTempMonth: (month: number) => void) =>
  ({ item }: { item: { id: number; name: string } }) => (
    <TouchableOpacity
      style={[
        styles.pickerItem,
        tempMonth === item.id && styles.selectedPickerItem,
      ]}
      onPress={() => setTempMonth(item.id)}
    >
      <Text
        style={[
          styles.pickerItemText,
          tempMonth === item.id && styles.selectedPickerItemText,
        ]}
      >
        {item.name}
      </Text>
    </TouchableOpacity>
  );

interface MonthYearPickerProps {
  visible: boolean;
  currentMonth: string; // Format: "YYYY-MM"
  onClose: () => void;
  onConfirm: (year: number, month: number) => void;
}

export default function MonthYearPicker({
  visible,
  currentMonth,
  onClose,
  onConfirm,
}: MonthYearPickerProps) {
  const [year, month] = currentMonth.split("-");
  const [tempYear, setTempYear] = useState(parseInt(year));
  const [tempMonth, setTempMonth] = useState(parseInt(month));

  // Create render functions with current state
  const renderYearItem = createYearRenderItem(tempYear, setTempYear);
  const renderMonthItem = createMonthRenderItem(tempMonth, setTempMonth);

  const handleConfirm = () => {
    onConfirm(tempYear, tempMonth);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={() => onClose()}
    >
      <TouchableOpacity
        style={styles.modalOverlay}
        activeOpacity={1}
        onPress={() => onClose()}
      >
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {t("calendar:monthYearPicker.title")}
            </Text>
            <TouchableOpacity
              onPress={() => onClose()}
              style={styles.closeButton}
            >
              <MaterialCommunityIcons name="close" size={24} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.pickerContainer}>
            <View style={styles.yearPicker}>
              <Text style={styles.pickerLabel}>
                {t("calendar:monthYearPicker.selectYear")}
              </Text>
              <FlatList
                data={years}
                keyExtractor={(item) => item.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderYearItem}
              />
            </View>

            <View style={styles.monthPicker}>
              <Text style={styles.pickerLabel}>
                {t("calendar:monthYearPicker.selectMonth")}
              </Text>
              <FlatList
                data={months}
                keyExtractor={(item) => item.id.toString()}
                showsVerticalScrollIndicator={false}
                renderItem={renderMonthItem}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={handleConfirm}
          >
            <Text style={styles.confirmButtonText}>Confirm</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    width: "90%",
    maxWidth: 400,
    maxHeight: "80%",
    padding: 20,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  closeButton: {
    padding: 4,
  },
  pickerContainer: {
    flexDirection: "row",
    marginBottom: 20,
    height: 300,
  },
  yearPicker: {
    flex: 1,
    marginRight: 10,
  },
  monthPicker: {
    flex: 1,
    marginLeft: 10,
  },
  pickerLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginBottom: 10,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 4,
  },
  selectedPickerItem: {
    backgroundColor: primaryColor,
  },
  pickerItemText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
  },
  selectedPickerItemText: {
    color: "#fff",
    fontWeight: "500",
  },
  confirmButton: {
    backgroundColor: primaryColor,
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: "center",
  },
  confirmButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});
