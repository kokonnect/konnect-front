import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

const { width } = Dimensions.get("window");

export default function StatusBarBanner() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation("common");

  // Calculate top position accounting for status bar
  const getTopPosition = () => {
    if (Platform.OS === "web") {
      return 0;
    }
    // Use safe area insets for proper status bar spacing
    return insets.top;
  };

  return (
    <View style={[styles.container, { top: getTopPosition() }]}>
      <Text style={styles.warningText}>
        ⚠️ {t("demoBanner")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    width: width,
    height: 28,
    backgroundColor: "#DC2626", // Bright red
    justifyContent: "center",
    alignItems: "center",
    zIndex: 9999,
    paddingHorizontal: 16,
  },
  warningText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontWeight: "700",
    textAlign: "center",
    includeFontPadding: false,
    textAlignVertical: "center",
  },
});