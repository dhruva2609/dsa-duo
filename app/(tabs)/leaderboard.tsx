import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { Crown } from 'lucide-react-native';
import React from 'react';
import { Platform, ScrollView, StyleSheet, Text, View } from 'react-native';

const otherUsers = [
  { id: 2, name: "Sarah_Dev", xp: 2100, avatar: "S", color: "#3B82F6" },
  { id: 3, name: "Mike.js", xp: 1950, avatar: "M", color: "#10B981" },
  { id: 4, name: "Alex_Code", xp: 1600, avatar: "A", color: "#8B5CF6" },
  { id: 5, name: "Emma_Py", xp: 1200, avatar: "E", color: "#F59E0B" },
  { id: 6, name: "David_Cpp", xp: 950, avatar: "D", color: "#EC4899" },
  { id: 7, name: "Chloe_UI", xp: 800, avatar: "C", color: "#6366F1" },
];

export default function LeaderboardScreen() {
  const { xp: userXp, isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;
  
  const currentUser = { id: 1, name: "Dhruva", xp: userXp, avatar: "DP", color: theme.primary };
  const allUsers = [...otherUsers, currentUser].sort((a, b) => b.xp - a.xp);
  const topThree = allUsers.slice(0, 3);
  const restUsers = allUsers.slice(3);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Leaderboard</Text>
        <View style={[styles.leagueTag, { backgroundColor: theme.card }]}>
          <Text style={[styles.leagueText, { color: theme.primary }]}>WEEKLY</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={styles.podiumContainer}>
          {[1, 0, 2].map((idx) => { // Order: 2nd, 1st, 3rd
            const user = topThree[idx];
            const isFirst = idx === 0;
            const borderColor = isFirst ? '#F59E0B' : idx === 1 ? '#94A3B8' : '#B45309';
            return (
              <View key={user.id} style={[styles.podiumCard, { marginTop: isFirst ? 0 : 40 }]}>
                {isFirst && <Crown size={24} color="#F59E0B" fill="#F59E0B" style={{marginBottom: 8}} />}
                <View style={[styles.avatar, { borderColor, width: isFirst ? 80 : 64, height: isFirst ? 80 : 64, backgroundColor: theme.card }]}>
                  <Text style={[styles.avatarText, { fontSize: isFirst ? 28 : 20, color: theme.text }]}>{user.avatar}</Text>
                  <View style={[styles.rankBadge, { backgroundColor: borderColor }]}>
                    <Text style={styles.rankText}>{idx + 1}</Text>
                  </View>
                </View>
                <Text style={[styles.podiumName, { color: theme.text }]}>{user.name}</Text>
                <Text style={[styles.podiumXp, { color: theme.textDim }]}>{user.xp}</Text>
              </View>
            );
          })}
        </View>

        <View style={styles.listContainer}>
          {restUsers.map((user, index) => {
            const isMe = user.name === "Dhruva";
            return (
              <View key={user.id} style={[styles.rankRow, { backgroundColor: theme.card, shadowColor: theme.shadow }, isMe && { borderColor: theme.primary, borderWidth: 1 }]}>
                <Text style={[styles.rankNum, { color: theme.textDim }]}>{index + 4}</Text>
                <View style={[styles.listAvatar, { borderColor: user.color }]}>
                  <Text style={[styles.listAvatarText, { color: theme.text }]}>{user.avatar}</Text>
                </View>
                <Text style={[styles.rowName, { color: isMe ? theme.primary : theme.text }]}>{user.name}</Text>
                <Text style={[styles.rowXp, { color: theme.textDim }]}>{user.xp} XP</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  leagueTag: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  leagueText: { fontSize: 12, fontWeight: '700' },
  scrollContent: { paddingBottom: 100 },
  podiumContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 30, paddingHorizontal: 20 },
  podiumCard: { alignItems: 'center', width: 90 },
  avatar: { borderRadius: 40, justifyContent: 'center', alignItems: 'center', borderWidth: 3, marginBottom: 8, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5 },
  avatarText: { fontWeight: '800' },
  rankBadge: { position: 'absolute', bottom: -10, width: 24, height: 24, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' },
  rankText: { color: 'white', fontSize: 10, fontWeight: '800' },
  podiumName: { fontSize: 14, fontWeight: '700', marginBottom: 2 },
  podiumXp: { fontSize: 13, fontWeight: '800' },
  listContainer: { paddingHorizontal: 24 },
  rankRow: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  rankNum: { width: 30, fontSize: 16, fontWeight: '700' },
  listAvatar: { width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', borderWidth: 2, marginRight: 14 },
  listAvatarText: { fontSize: 14, fontWeight: '700' },
  rowName: { flex: 1, fontSize: 16, fontWeight: '700' },
  rowXp: { fontSize: 14, fontWeight: '700' },
});