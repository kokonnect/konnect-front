import { View, StyleSheet, ScrollView, SafeAreaView } from "react-native";
import RecentTranslation from "@/components/home/RecentTranslation";
import UpcomingEvents from "@/components/shared/UpcomingEvents";
import WelcomeBanner from "@/components/shared/WelcomeBanner";

export default function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeBanner />
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
