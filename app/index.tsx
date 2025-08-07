import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import RecentTranslation from "../components/home/RecentTranslation";
import UpcomingEvents from "../components/shared/UpcomingEvents";

export default function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <RecentTranslation />
        <UpcomingEvents />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
});
