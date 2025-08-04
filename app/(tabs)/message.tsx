import { StyleSheet, TextInput, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function MessageScreen() {
  const [searchText, setSearchText] = useState('');
  const borderColor = useThemeColor({}, 'text');
  
  const conversations = [
    {
      id: '1',
      name: 'John Doe',
      lastMessage: 'Hey! How are you doing?',
      time: '2:30 PM',
      unread: 2,
      avatar: '👤',
    },
    {
      id: '2',
      name: 'Jane Smith',
      lastMessage: 'Thanks for the help yesterday!',
      time: '1:45 PM',
      unread: 0,
      avatar: '👩',
    },
    {
      id: '3',
      name: 'Team Chat',
      lastMessage: 'Meeting at 3 PM tomorrow',
      time: '12:00 PM',
      unread: 5,
      avatar: '👥',
    },
    {
      id: '4',
      name: 'Alex Johnson',
      lastMessage: 'Can you review the document?',
      time: 'Yesterday',
      unread: 1,
      avatar: '👨',
    },
    {
      id: '5',
      name: 'Support Team',
      lastMessage: 'Your issue has been resolved',
      time: 'Yesterday',
      unread: 0,
      avatar: '🛠️',
    },
  ];

  const renderConversation = ({ item }: { item: typeof conversations[0] }) => (
    <TouchableOpacity style={styles.conversationItem}>
      <ThemedView style={styles.avatarContainer}>
        <ThemedText style={styles.avatar}>{item.avatar}</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.conversationContent}>
        <ThemedView style={styles.conversationHeader}>
          <ThemedText style={styles.conversationName}>{item.name}</ThemedText>
          <ThemedText style={styles.conversationTime}>{item.time}</ThemedText>
        </ThemedView>
        
        <ThemedView style={styles.messageRow}>
          <ThemedText style={styles.lastMessage} numberOfLines={1}>
            {item.lastMessage}
          </ThemedText>
          {item.unread > 0 && (
            <ThemedView style={styles.unreadBadge}>
              <ThemedText style={styles.unreadCount}>{item.unread}</ThemedText>
            </ThemedView>
          )}
        </ThemedView>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <ThemedView style={styles.titleContainer}>
          <ThemedText type="title">Messages</ThemedText>
        </ThemedView>

        <ThemedView style={styles.searchWrapper}>
          <ThemedView style={[styles.searchContainer, { borderColor: borderColor }]}>
            <IconSymbol size={20} name="magnifyingglass" color="#808080" />
            <TextInput
              style={[styles.searchInput, { color: borderColor }]}
              placeholder="Search conversations..."
              placeholderTextColor="#808080"
              value={searchText}
              onChangeText={setSearchText}
            />
          </ThemedView>
        </ThemedView>

        <ThemedView style={styles.conversationsList}>
          <FlatList
            data={conversations}
            renderItem={renderConversation}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        </ThemedView>
      </ScrollView>

      <TouchableOpacity style={styles.newMessageButton}>
        <IconSymbol size={24} name="square.and.pencil" color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  searchWrapper: {
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderRadius: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
  },
  conversationsList: {
    gap: 8,
    paddingHorizontal: 20,
  },
  conversationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    marginBottom: 8,
  },
  avatarContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 180, 147, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatar: {
    fontSize: 24,
  },
  conversationContent: {
    flex: 1,
    gap: 4,
  },
  conversationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  conversationName: {
    fontSize: 16,
    fontWeight: '600',
  },
  conversationTime: {
    fontSize: 12,
    opacity: 0.6,
  },
  messageRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  lastMessage: {
    fontSize: 14,
    opacity: 0.7,
    flex: 1,
  },
  unreadBadge: {
    backgroundColor: '#00B493',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  unreadCount: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  newMessageButton: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00B493',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
});