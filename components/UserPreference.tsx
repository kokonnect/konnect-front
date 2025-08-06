import { useState } from "react";
import { View, Text, StyleSheet, Switch } from "react-native";

import { MaterialCommunityIcons } from "@expo/vector-icons";

const primaryColor = "#00B493";

export default function PreferencesSection() {
  const [pushNotifications, setPushNotifications] = useState(true);
  const [historySave, setHistorySave] = useState(true);
  const [translationSave, setTranslationSave] = useState(true);

  const handleSetPushNotifications = (value: boolean) => {
    setPushNotifications(value);
  };
  const handleSetHistorySave = (value: boolean) => {
    setHistorySave(value);
  };
  const handleSetTranslationSave = (value: boolean) => {
    setTranslationSave(value);
  };
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitle}>Preferences</Text>
      <View style={styles.preferencesContainer}>
        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <MaterialCommunityIcons name="bell" size={20} color="#666" />
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>Push Notifications</Text>
              <Text style={styles.preferenceSubtitle}>
                Receive updates about your children
              </Text>
            </View>
          </View>
          <Switch
            value={pushNotifications}
            onValueChange={handleSetPushNotifications}
            trackColor={{ false: "#e0e0e0", true: `${primaryColor}40` }}
            thumbColor={pushNotifications ? primaryColor : "#f4f3f4"}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <MaterialCommunityIcons name="history" size={20} color="#666" />
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>Save Message History</Text>
              <Text style={styles.preferenceSubtitle}>
                Keep history of composed messages
              </Text>
            </View>
          </View>
          <Switch
            value={historySave}
            onValueChange={handleSetHistorySave}
            trackColor={{ false: "#e0e0e0", true: `${primaryColor}40` }}
            thumbColor={historySave ? primaryColor : "#f4f3f4"}
          />
        </View>

        <View style={styles.preferenceItem}>
          <View style={styles.preferenceInfo}>
            <MaterialCommunityIcons name="translate" size={20} color="#666" />
            <View style={styles.preferenceText}>
              <Text style={styles.preferenceTitle}>Save Translations</Text>
              <Text style={styles.preferenceSubtitle}>
                Keep history of translated messages
              </Text>
            </View>
          </View>
          <Switch
            trackColor={{ false: "#e0e0e0", true: `${primaryColor}40` }}
            thumbColor={translationSave ? primaryColor : "#f4f3f4"}
            onValueChange={handleSetTranslationSave}
            value={translationSave}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Preferences Section Styles
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
    marginBottom: 16,
    paddingHorizontal: 20,
  },
  preferencesContainer: {
    backgroundColor: "#fff",
    marginHorizontal: 20,
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  preferenceItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  preferenceInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  preferenceText: {
    marginLeft: 12,
    flex: 1,
  },
  preferenceTitle: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    marginBottom: 2,
  },
  preferenceSubtitle: {
    fontSize: 14,
    color: "#666",
  },
});
