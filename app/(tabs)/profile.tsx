import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Award, Flame, Layers, Settings, Trash2, Zap } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { xp, hearts, achievements, resetProgress } = useUser();

  const badges = [
    { id: 'first_win', title: 'Hello World', desc: 'Completed first quiz', icon: <Zap size={20} color={Colors.warning} fill={Colors.warning} /> },
    { id: 'novice_coder', title: 'Git Commit', desc: 'Earned 100 XP', icon: <Layers size={20} color={Colors.primary} /> },
    { id: 'streak_3', title: 'Hotfix Hero', desc: '3-day streak', icon: <Flame size={20} color={Colors.error} fill={Colors.error} /> }
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
        <Pressable onPress={() => router.push('/settings')} style={styles.iconBtn}>
          <Settings size={22} color={Colors.primaryDark} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>DP</Text>
          </View>
          <Text style={styles.name}>Dhruva Pandya</Text>
          <Text style={styles.handle}>@dhruvadev</Text>
          
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{xp}</Text>
              <Text style={styles.statLabel}>XP</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>{hearts}</Text>
              <Text style={styles.statLabel}>Hearts</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>5</Text>
              <Text style={styles.statLabel}>Streak</Text>
            </View>
          </View>
        </View>

        {/* Badges */}
        <Text style={styles.sectionTitle}>Achievements</Text>
        <View style={styles.badgesContainer}>
          {badges.map(badge => {
            const isUnlocked = achievements.includes(badge.id);
            return (
              <View key={badge.id} style={[styles.badgeCard, !isUnlocked && styles.lockedCard]}>
                <View style={[styles.iconBox, { backgroundColor: isUnlocked ? 'white' : '#F4F7FE' }]}>
                  {isUnlocked ? badge.icon : <Award size={20} color={Colors.textDim} />}
                </View>
                <View>
                  <Text style={styles.badgeTitle}>{badge.title}</Text>
                  <Text style={styles.badgeDesc}>{badge.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable style={styles.resetBtn} onPress={resetProgress}>
            <Trash2 size={18} color={Colors.error} />
            <Text style={styles.resetText}>Reset All Progress</Text>
        </Pressable>

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
  iconBtn: { padding: 8, backgroundColor: 'white', borderRadius: 12 },
  
  scroll: { paddingHorizontal: 24, paddingBottom: 100 },

  profileCard: { 
    backgroundColor: 'white', borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 30,
    shadowColor: Colors.shadow, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5
  },
  avatar: { 
    width: 80, height: 80, borderRadius: 40, backgroundColor: Colors.primary, 
    justifyContent: 'center', alignItems: 'center', marginBottom: 16,
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: {width: 0, height: 5}
  },
  avatarText: { fontSize: 32, fontWeight: '700', color: 'white' },
  name: { fontSize: 20, fontWeight: '800', color: Colors.primaryDark },
  handle: { fontSize: 14, color: Colors.primary, fontWeight: '600', marginBottom: 24 },
  
  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800', color: Colors.primaryDark },
  statLabel: { fontSize: 12, color: Colors.textDim, fontWeight: '600' },
  divider: { width: 1, height: '80%', backgroundColor: Colors.border },

  sectionTitle: { fontSize: 16, fontWeight: '800', color: Colors.primaryDark, marginBottom: 16 },
  badgesContainer: { gap: 12 },
  badgeCard: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 16, gap: 16,
    shadowColor: Colors.shadow, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  lockedCard: { opacity: 0.6, backgroundColor: '#F8FAFC' },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  badgeTitle: { fontSize: 15, fontWeight: '700', color: Colors.primaryDark },
  badgeDesc: { fontSize: 12, color: Colors.textDim },

  resetBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 20, marginTop: 20 },
  resetText: { color: Colors.error, fontWeight: '700' }
});