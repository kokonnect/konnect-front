import React, { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  FlatList,
  SafeAreaView,
  Dimensions,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { VocabularyItem as VocabularyItemType } from "./types";
import VocabularyItem from "./VocabularyItem";
import SkeletonLoader from "./SkeletonLoader";

const { height: SCREEN_HEIGHT } = Dimensions.get("window");
const MODAL_HEIGHT = SCREEN_HEIGHT * 0.85;
const primaryColor = "#00B493";

interface VocabularyModalProps {
  visible: boolean;
  onClose: () => void;
  vocabulary?: VocabularyItemType[];
  isLoading?: boolean;
}

export default function VocabularyModal({
  visible,
  onClose,
  vocabulary = [],
  isLoading = false,
}: VocabularyModalProps) {
  const { t } = useTranslation();
  const slideAnim = useRef(new Animated.Value(MODAL_HEIGHT)).current;
  const backdropOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: MODAL_HEIGHT,
          useNativeDriver: true,
          tension: 65,
          friction: 11,
        }),
        Animated.timing(backdropOpacity, {
          toValue: 0,
          duration: 250,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible, slideAnim, backdropOpacity]);

  const handleClose = () => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: MODAL_HEIGHT,
        useNativeDriver: true,
        tension: 65,
        friction: 11,
      }),
      Animated.timing(backdropOpacity, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const renderLoadingSkeleton = () => (
    <View style={styles.loadingContainer}>
      {[1, 2, 3, 4, 5, 6].map((i) => (
        <View key={i} style={styles.skeletonItem}>
          <SkeletonLoader height={18} width="40%" marginBottom={8} />
          <SkeletonLoader height={16} width="30%" marginBottom={8} />
          <SkeletonLoader height={14} width="90%" marginBottom={4} />
          <SkeletonLoader height={14} width="85%" marginBottom={0} />
        </View>
      ))}
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
    >
      <View style={styles.container}>
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: backdropOpacity,
            },
          ]}
        >
          <TouchableOpacity
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={handleClose}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <SafeAreaView style={styles.safeArea}>
            {/* Drag Handle
            <View style={styles.dragHandleContainer}>
              <View style={styles.dragHandle} />
            </View> */}

            {/* Header */}
            <View style={styles.header}>
              <View style={styles.headerLeft}>
                <MaterialCommunityIcons
                  name="book-education"
                  size={24}
                  color={primaryColor}
                />
                <Text style={styles.title}>
                  {t("translate:vocabulary.title")}
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{vocabulary.length}</Text>
                </View>
              </View>
              <TouchableOpacity
                onPress={handleClose}
                style={styles.closeButton}
                hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
              >
                <MaterialCommunityIcons name="close" size={24} color="#666" />
              </TouchableOpacity>
            </View>

            {/* Content */}
            {isLoading ? (
              renderLoadingSkeleton()
            ) : (
              <FlatList
                data={vocabulary}
                style={styles.content}
                renderItem={({ item }) => <VocabularyItem item={item} />}
                keyExtractor={(item) => item.id}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.vocabularyList}
                ListHeaderComponent={
                  <Text style={styles.description}>
                    {t("translate:vocabulary.description")}
                  </Text>
                }
                ItemSeparatorComponent={() => <View style={styles.separator} />}
                bounces={true}
              />
            )}
          </SafeAreaView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    flex: 1,
  },
  modalContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: MODAL_HEIGHT,
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 10,
  },
  safeArea: {
    flex: 1,
  },
  dragHandleContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#D1D5DB",
    borderRadius: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#111",
    marginLeft: 10,
  },
  badge: {
    backgroundColor: `${primaryColor}20`,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginLeft: 12,
  },
  badgeText: {
    fontSize: 12,
    color: primaryColor,
    fontWeight: "600",
  },
  closeButton: {
    padding: 4,
  },
  description: {
    fontSize: 14,
    color: "#6B7280",
    paddingVertical: 16,
    lineHeight: 20,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  vocabularyList: {
    paddingBottom: 20,
  },
  separator: {
    height: 12,
  },
  loadingContainer: {
    flex: 1,
  },
  skeletonItem: {
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
    borderLeftWidth: 3,
    borderLeftColor: "#e0e0e0",
  },
});
