import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ChevronLeft, Crown } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

const otherUsers = [
  { id: 2, name: "Sarah", xp: 2100, avatar: "S" },
  { id: 3, name: "Mike", xp: 1950, avatar: "M" },
  { id: 4, name: "Alex", xp: 1600, avatar: "A" },
  { id: 5, name: "Emma", xp: 1200, avatar: "E" },
  { id: 6, name: "David", xp: 950, avatar: "D" },
  { id: 7, name: "Chloe", xp: 800, avatar: "C" },
];

export default function LeaderboardScreen() {
  const router = useRouter();
  const { xp: userXp } = useUser();

  const currentUser = { id: 1, name: "You", xp: userXp, avatar: "JD" };
  const allUsers = [...otherUsers, currentUser];
  const sortedUsers = allUsers.sort((a, b) => b.xp - a.xp);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color="white" />
        </Pressable>
        <Text style={styles.title}>Diamond League</Text>
        <Crown size={28} color="#FFD700" fill="#FFD700" />
      </View>

      {/* List Container */}
      <View style={styles.rankListBg}>
        <ScrollView contentContainerStyle={styles.listContent}>
          {sortedUsers.map((user, index) => {
            const rank = index + 1;
            const isTop3 = rank <= 3;
            const isMe = user.name === "You";

            return (
              <View key={user.id} style={[styles.rankItem, isMe && styles.rankItemMe]}>
                <Text style={[styles.rankNum, isTop3 && styles.rankNumTop]}>{rank}</Text>
                
                <View style={[styles.avatar, { backgroundColor: getColorForChar(user.avatar) }]}>
                  <Text style={styles.avatarText}>{user.avatar}</Text>
                </View>
                
                <Text style={[styles.name, isMe && styles.nameMe]}>{user.name}</Text>
                <Text style={styles.xp}>{user.xp} XP</Text>
              </View>
            );
          })}
        </ScrollView>
      </View>
    </View>
  );
}

const getColorForChar = (char: string) => {
  const colors = ['#FF9F43', '#54A0FF', '#5F27CD', '#FF6B6B', '#1DD1A1', '#00C48C', '#7D5FFF'];
  return colors[char.charCodeAt(0) % colors.length];
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.primary },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 24, paddingBottom: 30,
  },
  title: { fontSize: 22, fontWeight: '800', color: 'white' },
  backBtn: { width: 40 },
  
  rankListBg: { 
    flex: 1, backgroundColor: 'white', borderTopLeftRadius: 30, borderTopRightRadius: 30,
    overflow: 'hidden', paddingBottom: 80
  },
  listContent: { padding: 24 },
  
  rankItem: { 
    flexDirection: 'row', alignItems: 'center', paddingVertical: 16,
    borderBottomWidth: 1, borderBottomColor: '#F0F0F0'
  },
  rankItemMe: { backgroundColor: '#F6F5FF', marginHorizontal: -24, paddingHorizontal: 24, borderRadius: 10 },
  
  rankNum: { fontSize: 18, fontWeight: '600', color: Colors.textDim, width: 30, textAlign: 'center' },
  rankNumTop: { color: Colors.primary, fontWeight: '800' },
  
  avatar: { 
    width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center',
    marginHorizontal: 16
  },
  avatarText: { color: 'white', fontWeight: '700', fontSize: 16 },
  
  name: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.text },
  nameMe: { color: Colors.primary },
  
  xp: { fontSize: 16, fontWeight: '600', color: Colors.textDim },
});