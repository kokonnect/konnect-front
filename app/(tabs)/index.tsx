import { FlatList, ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";

export default function HomeScreen() {
  const todoList = [
    { id: "1", title: "Complete project proposal" },
    { id: "2", title: "Review code changes" },
    { id: "3", title: "Prepare presentation" },
    { id: "4", title: "Send status update" },
    { id: "5", title: "Schedule team meeting" },
  ];

  const shoppingList = [
    { id: "1", item: "Milk", quantity: "1 gallon" },
    { id: "2", item: "Bread", quantity: "1 loaf" },
    { id: "3", item: "Eggs", quantity: "1 dozen" },
    { id: "4", item: "Cheese", quantity: "200g" },
    { id: "5", item: "Apples", quantity: "6 pieces" },
  ];

  const renderTodoItem = ({ item }: { item: (typeof todoList)[0] }) => (
    <ThemedView style={styles.listItem}>
      <ThemedText style={styles.listItemText}>{item.title}</ThemedText>
    </ThemedView>
  );

  const renderShoppingItem = ({ item }: { item: (typeof shoppingList)[0] }) => (
    <ThemedView style={styles.listItem}>
      <ThemedText style={styles.listItemText}>{item.item}</ThemedText>
      <ThemedText style={styles.quantityText}>{item.quantity}</ThemedText>
    </ThemedView>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">My Lists</ThemedText>
        </ThemedView>
        <ThemedView style={styles.listContainer}>
          <ThemedText type="subtitle" style={styles.listTitle}>
            Todo List
          </ThemedText>
          <FlatList
            data={todoList}
            renderItem={renderTodoItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </ThemedView>

        <ThemedView style={styles.listContainer}>
          <ThemedText type="subtitle" style={styles.listTitle}>
            Shopping List
          </ThemedText>
          <FlatList
            data={shoppingList}
            renderItem={renderShoppingItem}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  listContainer: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  listTitle: {
    marginBottom: 12,
  },
  listItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginVertical: 4,
    borderRadius: 8,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
  },
  listItemText: {
    fontSize: 16,
  },
  quantityText: {
    fontSize: 14,
    opacity: 0.7,
  },
});
