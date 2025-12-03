import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Flame, Layers, Settings, Trash2, Zap } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { xp, hearts, achievements, resetProgress, isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;

  const badges = [
    { id: 'first_win', title: 'Hello World', desc: 'First quiz done', icon: <Zap size={20} color="#FFCE20" /> },
    { id: 'novice_coder', title: 'Git Commit', desc: 'Earned 100 XP', icon: <Layers size={20} color={theme.primary} /> },
    { id: 'streak_3', title: 'Hotfix Hero', desc: '3-day streak', icon: <Flame size={20} color="#EE5D50" /> }
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Profile</Text>
        <Pressable onPress={() => router.push('/settings')} style={[styles.iconBtn, { backgroundColor: theme.card }]}>
          <Settings size={22} color={theme.text} />
        </Pressable>
      </View>

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.profileCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>DP</Text>
          </View>
          <Text style={[styles.name, { color: theme.text }]}>Dhruva Pandya</Text>
          <Text style={[styles.handle, { color: theme.primary }]}>@dhruvadev</Text>
          
          <View style={styles.statsRow}>
            <StatItem label="XP" value={xp} theme={theme} />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <StatItem label="Hearts" value={hearts} theme={theme} />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <StatItem label="Streak" value={0} theme={theme} />
          </View>
        </View>

        <Text style={[styles.sectionTitle, { color: theme.text }]}>Achievements</Text>
        <View style={styles.badgesContainer}>
          {badges.map(badge => {
            const isUnlocked = achievements.includes(badge.id);
            return (
              <View key={badge.id} style={[styles.badgeCard, { backgroundColor: theme.card, opacity: isUnlocked ? 1 : 0.6 }]}>
                <View style={[styles.iconBox, { backgroundColor: theme.background }]}>{badge.icon}</View>
                <View>
                  <Text style={[styles.badgeTitle, { color: theme.text }]}>{badge.title}</Text>
                  <Text style={[styles.badgeDesc, { color: theme.textDim }]}>{badge.desc}</Text>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable style={styles.resetBtn} onPress={resetProgress}>
            <Trash2 size={18} color="#EE5D50" />
            <Text style={styles.resetText}>Reset All Progress</Text>
        </Pressable>
      </ScrollView>
    </View>
  );
}

const StatItem = ({ label, value, theme }: any) => (
  <View style={styles.statItem}>
    <Text style={[styles.statValue, { color: theme.text }]}>{value}</Text>
    <Text style={[styles.statLabel, { color: theme.textDim }]}>{label}</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 24, paddingBottom: 20 },
  headerTitle: { fontSize: 24, fontWeight: '800' },
  iconBtn: { padding: 8, borderRadius: 12 },
  scroll: { paddingHorizontal: 24, paddingBottom: 100 },
  profileCard: { borderRadius: 24, padding: 24, alignItems: 'center', marginBottom: 30, shadowOpacity: 0.1, shadowRadius: 20, elevation: 5 },
  avatar: { width: 80, height: 80, borderRadius: 40, justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  avatarText: { fontSize: 32, fontWeight: '700', color: 'white' },
  name: { fontSize: 20, fontWeight: '800' },
  handle: { fontSize: 14, fontWeight: '600', marginBottom: 24 },
  statsRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-around' },
  statItem: { alignItems: 'center' },
  statValue: { fontSize: 22, fontWeight: '800' },
  statLabel: { fontSize: 12, fontWeight: '600' },
  divider: { width: 1, height: '80%' },
  sectionTitle: { fontSize: 16, fontWeight: '800', marginBottom: 16 },
  badgesContainer: { gap: 12 },
  badgeCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, gap: 16 },
  iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  badgeTitle: { fontSize: 15, fontWeight: '700' },
  badgeDesc: { fontSize: 12 },
  resetBtn: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8, padding: 20, marginTop: 20 },
  resetText: { color: '#EE5D50', fontWeight: '700' }
});