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
  const { xp: userXp } = useUser();
  const currentUser = { id: 1, name: "Dhruva", xp: userXp, avatar: "DP", color: Colors.primary };
  const allUsers = [...otherUsers, currentUser].sort((a, b) => b.xp - a.xp);
  
  const topThree = allUsers.slice(0, 3);
  const restUsers = allUsers.slice(3);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Leaderboard</Text>
        <View style={styles.leagueTag}>
          <Text style={styles.leagueText}>WEEKLY</Text>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        
        {/* Podium */}
        <View style={styles.podiumContainer}>
          {/* 2nd */}
          <View style={[styles.podiumCard, { marginTop: 40 }]}>
            <View style={[styles.avatar, { borderColor: '#94A3B8' }]}>
              <Text style={styles.avatarText}>{topThree[1].avatar}</Text>
              <View style={[styles.rankBadge, { backgroundColor: '#94A3B8' }]}>
                <Text style={styles.rankText}>2</Text>
              </View>
            </View>
            <Text style={styles.podiumName}>{topThree[1].name}</Text>
            <Text style={styles.podiumXp}>{topThree[1].xp}</Text>
          </View>

          {/* 1st */}
          <View style={[styles.podiumCard, styles.podiumFirst]}>
            <Crown size={24} color="#F59E0B" fill="#F59E0B" style={{marginBottom: 8}} />
            <View style={[styles.avatar, { borderColor: '#F59E0B', width: 80, height: 80 }]}>
              <Text style={[styles.avatarText, { fontSize: 28 }]}>{topThree[0].avatar}</Text>
              <View style={[styles.rankBadge, { backgroundColor: '#F59E0B' }]}>
                <Text style={styles.rankText}>1</Text>
              </View>
            </View>
            <Text style={[styles.podiumName, { fontSize: 16, color: Colors.primaryDark }]}>{topThree[0].name}</Text>
            <Text style={[styles.podiumXp, { color: Colors.primaryDark }]}>{topThree[0].xp}</Text>
          </View>

          {/* 3rd */}
          <View style={[styles.podiumCard, { marginTop: 40 }]}>
            <View style={[styles.avatar, { borderColor: '#B45309' }]}>
              <Text style={styles.avatarText}>{topThree[2].avatar}</Text>
              <View style={[styles.rankBadge, { backgroundColor: '#B45309' }]}>
                <Text style={styles.rankText}>3</Text>
              </View>
            </View>
            <Text style={styles.podiumName}>{topThree[2].name}</Text>
            <Text style={styles.podiumXp}>{topThree[2].xp}</Text>
          </View>
        </View>

        {/* Rank List */}
        <View style={styles.listContainer}>
          {restUsers.map((user, index) => {
            const rank = index + 4;
            const isMe = user.name === "Dhruva";

            return (
              <View key={user.id} style={[styles.rankRow, isMe && styles.rankRowMe]}>
                <Text style={styles.rankNum}>{rank}</Text>
                <View style={[styles.listAvatar, { backgroundColor: isMe ? Colors.primary : 'white', borderColor: user.color }]}>
                  <Text style={[styles.listAvatarText, isMe && { color: 'white' }]}>{user.avatar}</Text>
                </View>
                <Text style={[styles.rowName, isMe && { color: Colors.primary }]}>{user.name}</Text>
                <Text style={styles.rowXp}>{user.xp} XP</Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 24, paddingBottom: 20
  },
  headerTitle: { fontSize: 24, fontWeight: '800', color: Colors.primaryDark },
  leagueTag: { backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  leagueText: { fontSize: 12, fontWeight: '700', color: Colors.primary },

  scrollContent: { paddingBottom: 100 },
  
  podiumContainer: { 
    flexDirection: 'row', justifyContent: 'center', gap: 16, marginBottom: 30, paddingHorizontal: 20 
  },
  podiumCard: { alignItems: 'center', width: 90 },
  podiumFirst: { marginTop: 0 },
  
  avatar: { 
    width: 64, height: 64, borderRadius: 32, backgroundColor: 'white', 
    justifyContent: 'center', alignItems: 'center', borderWidth: 3, marginBottom: 8,
    shadowColor: Colors.shadow, shadowOpacity: 0.1, shadowRadius: 10, elevation: 5
  },
  avatarText: { fontSize: 20, fontWeight: '800', color: Colors.primaryDark },
  rankBadge: { 
    position: 'absolute', bottom: -10, width: 24, height: 24, borderRadius: 12, 
    justifyContent: 'center', alignItems: 'center', borderWidth: 2, borderColor: 'white' 
  },
  rankText: { color: 'white', fontSize: 10, fontWeight: '800' },
  podiumName: { fontSize: 14, fontWeight: '700', color: Colors.textDim, marginBottom: 2 },
  podiumXp: { fontSize: 13, fontWeight: '800', color: Colors.textDim },

  listContainer: { paddingHorizontal: 24 },
  rankRow: { 
    flexDirection: 'row', alignItems: 'center', padding: 16, 
    backgroundColor: 'white', borderRadius: 16, marginBottom: 12,
    shadowColor: Colors.shadow, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  rankRowMe: { borderWidth: 1, borderColor: Colors.primary },
  rankNum: { width: 30, fontSize: 16, fontWeight: '700', color: Colors.textDim },
  listAvatar: { 
    width: 40, height: 40, borderRadius: 12, justifyContent: 'center', alignItems: 'center', 
    borderWidth: 2, marginRight: 14 
  },
  listAvatarText: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark },
  rowName: { flex: 1, fontSize: 16, fontWeight: '700', color: Colors.primaryDark },
  rowXp: { fontSize: 14, fontWeight: '700', color: Colors.primary },
});