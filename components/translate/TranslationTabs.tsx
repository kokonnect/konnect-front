import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";

import { TabType } from "./types";

const primaryColor = "#00B493";

interface TranslationTabsProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

const tabs = [
  { id: "summary" as TabType, label: "Summary", icon: "text-short" },
  { id: "fullText" as TabType, label: "Full Text", icon: "text" },
  { id: "events" as TabType, label: "Events", icon: "calendar-plus" },
];

export default function TranslationTabs({
  activeTab,
  onTabChange,
}: TranslationTabsProps) {
  const { t } = useTranslation();

  return (
    <View style={styles.tabContainer}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.id}
          style={[styles.tab, activeTab === tab.id && styles.activeTab]}
          onPress={() => onTabChange(tab.id)}
        >
          <MaterialCommunityIcons
            name={tab.icon as any}
            size={20}
            color={activeTab === tab.id ? primaryColor : "#666"}
          />
          <Text
            style={[
              styles.tabLabel,
              activeTab === tab.id && styles.activeTabLabel,
            ]}
          >
            {t(`translate:translation.${tab.id}`)}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  tabContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  activeTab: {
    backgroundColor: `${primaryColor}10`,
  },
  tabLabel: {
    fontSize: 14,
    fontWeight: "500",
    color: "#666",
    marginLeft: 6,
  },
  activeTabLabel: {
    color: primaryColor,
    fontWeight: "600",
  },
});
