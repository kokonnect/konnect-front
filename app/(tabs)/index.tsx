import { StyleSheet, ScrollView, SafeAreaView } from "react-native";
import RecentTranslation from "@/components/home/RecentTranslation";
import UpcomingEvents from "@/components/shared/UpcomingEvents";
import WelcomeBanner from "@/components/shared/WelcomeBanner";
import { mockCalendarEvents } from "@/mocks";

export default function MainScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <WelcomeBanner />
        <RecentTranslation />
        <UpcomingEvents events={mockCalendarEvents.slice(0, 5)} />
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
