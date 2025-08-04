import { StyleSheet, TouchableOpacity, View, Switch, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function ProfileScreen() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const borderColor = useThemeColor({}, 'text');

  const menuItems = [
    { id: '1', title: 'Edit Profile', icon: 'pencil', action: () => {} },
    { id: '2', title: 'Account Settings', icon: 'gearshape.fill', action: () => {} },
    { id: '3', title: 'Privacy & Security', icon: 'lock.fill', action: () => {} },
    { id: '4', title: 'Help & Support', icon: 'questionmark.circle.fill', action: () => {} },
    { id: '5', title: 'About', icon: 'info.circle.fill', action: () => {} },
  ];

  const renderMenuItem = (item: typeof menuItems[0]) => (
    <TouchableOpacity key={item.id} style={styles.menuItem} onPress={item.action}>
      <ThemedView style={styles.menuItemLeft}>
        <IconSymbol size={24} name={item.icon} color={borderColor} />
        <ThemedText style={styles.menuItemText}>{item.title}</ThemedText>
      </ThemedView>
      <IconSymbol size={20} name="chevron.right" color="#808080" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ThemedView style={styles.profileHeader}>
          <ThemedView style={styles.profileImageContainer}>
            <ThemedText style={styles.profileInitials}>JD</ThemedText>
          </ThemedView>
          <ThemedView style={styles.profileInfo}>
            <ThemedText type="title" style={styles.profileName}>John Doe</ThemedText>
            <ThemedText style={styles.profileEmail}>john.doe@example.com</ThemedText>
          </ThemedView>
        </ThemedView>

      <ThemedView style={styles.statsContainer}>
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statValue}>28</ThemedText>
          <ThemedText style={styles.statLabel}>Projects</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statDivider} />
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statValue}>142</ThemedText>
          <ThemedText style={styles.statLabel}>Tasks</ThemedText>
        </ThemedView>
        <ThemedView style={styles.statDivider} />
        <ThemedView style={styles.statItem}>
          <ThemedText style={styles.statValue}>89%</ThemedText>
          <ThemedText style={styles.statLabel}>Complete</ThemedText>
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>Settings</ThemedText>
        
        <ThemedView style={styles.settingItem}>
          <ThemedView style={styles.settingLeft}>
            <IconSymbol size={24} name="bell.fill" color={borderColor} />
            <ThemedText style={styles.settingText}>Notifications</ThemedText>
          </ThemedView>
          <Switch
            value={notificationsEnabled}
            onValueChange={setNotificationsEnabled}
          />
        </ThemedView>

        <ThemedView style={styles.settingItem}>
          <ThemedView style={styles.settingLeft}>
            <IconSymbol size={24} name="moon.fill" color={borderColor} />
            <ThemedText style={styles.settingText}>Dark Mode</ThemedText>
          </ThemedView>
          <Switch
            value={darkModeEnabled}
            onValueChange={setDarkModeEnabled}
          />
        </ThemedView>
      </ThemedView>

      <ThemedView style={styles.section}>
        <ThemedText type="subtitle" style={styles.sectionTitle}>General</ThemedText>
        {menuItems.map(renderMenuItem)}
      </ThemedView>

        <ThemedView style={styles.logoutWrapper}>
          <TouchableOpacity style={styles.logoutButton}>
            <ThemedText style={styles.logoutText}>Log Out</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 20,
    paddingTop: 20,
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#00B493',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  profileInitials: {
    fontSize: 36,
    fontWeight: '600',
    color: 'white',
  },
  profileInfo: {
    alignItems: 'center',
  },
  profileName: {
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 16,
    opacity: 0.6,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    marginHorizontal: 20,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    opacity: 0.6,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuItemText: {
    fontSize: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
    marginBottom: 8,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingText: {
    fontSize: 16,
  },
  logoutWrapper: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});