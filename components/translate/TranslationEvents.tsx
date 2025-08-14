import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TranslationEvent } from "./types";
import SkeletonLoader from "./SkeletonLoader";

const createEventRenderer =
  (onAddEvent?: (event: TranslationEvent) => void) =>
  ({ item: event }: { item: TranslationEvent }) => (
    <View style={styles.eventItem}>
      <View style={styles.eventHeader}>
        <Text style={styles.eventTitle}>{event.title}</Text>
        <TouchableOpacity
          style={styles.addEventButton}
          onPress={() => onAddEvent?.(event)}
        >
          <MaterialCommunityIcons name="plus" size={16} color="#fff" />
        </TouchableOpacity>
      </View>
      <Text style={styles.eventDate}>
        {new Date(event.date).toLocaleDateString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
        {event.time && ` • ${event.time}`}
      </Text>
      <Text style={styles.eventDescription}>{event.description}</Text>
    </View>
  );

const primaryColor = "#00B493";

interface TranslationEventsProps {
  events: TranslationEvent[];
  onAddEvent?: (event: TranslationEvent) => void;
  isLoading?: boolean;
}

export default function TranslationEvents({
  events,
  onAddEvent,
  isLoading = false,
}: TranslationEventsProps) {
  const renderEvent = createEventRenderer(onAddEvent);

  const renderSkeletonEvent = ({ index }: { index: number }) => (
    <View key={index} style={styles.eventItem}>
      <View style={styles.eventHeader}>
        <SkeletonLoader height={16} width="70%" marginBottom={0} />
        <View style={styles.skeletonButton} />
      </View>
      <SkeletonLoader height={14} width="60%" marginBottom={4} />
      <SkeletonLoader height={14} width="90%" marginBottom={4} />
      <SkeletonLoader height={14} width="75%" marginBottom={0} />
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        {renderSkeletonEvent({ index: 0 })}
        {renderSkeletonEvent({ index: 1 })}
      </View>
    );
  }

  return (
    <FlatList
      scrollEnabled={false}
      data={events}
      keyExtractor={(item) => item.id}
      renderItem={renderEvent}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  eventItem: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  eventHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    flex: 1,
  },
  addEventButton: {
    backgroundColor: primaryColor,
    width: 28,
    height: 28,
    borderRadius: 14,
    justifyContent: "center",
    alignItems: "center",
  },
  eventDate: {
    fontSize: 14,
    color: primaryColor,
    marginBottom: 4,
    fontWeight: "500",
  },
  eventDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  skeletonButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#e0e0e0",
  },
});
