import { useUser } from '@/app/context/UserContext';
import { Header } from '@/components/Header'; // Use shared Header
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Flame, Layers, Settings, Trash2, Zap } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, xp, hearts, streakCount, achievements, resetProgress, signOut, isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;

  const badges = [
    { id: 'first_win', title: 'Hello World', desc: 'First quiz done', icon: <Zap size={20} color={Colors.warning} fill={Colors.warning} /> },
    { id: 'novice_coder', title: 'Git Commit', desc: 'Earned 100 XP', icon: <Layers size={20} color={theme.primary} /> },
    { id: 'streak_3', title: 'Hotfix Hero', desc: '3-day streak', icon: <Flame size={20} color={Colors.error} fill={Colors.error} /> }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Header 
        title="Profile" 
        showBack={false} 
        rightElement={
          <Pressable onPress={() => router.push('/settings')} style={[styles.iconBtn, { backgroundColor: theme.card }]}>
            <Settings size={22} color={theme.text} />
          </Pressable>
        }
        style={{borderBottomWidth: 0}}
      />

      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.profileCard, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>{user?.name ? getInitials(user.name) : '??'}</Text>
          </View>
          <Text style={[styles.name, { color: theme.text }]}>{user?.name || 'Developer'}</Text>
          <Text style={[styles.handle, { color: theme.primary }]}>@{user?.email.split('@')[0] || 'dev'}</Text>
          
          <View style={styles.statsRow}>
            <StatItem label="XP" value={xp} theme={theme} />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <StatItem label="Hearts" value={hearts} theme={theme} />
            <View style={[styles.divider, { backgroundColor: theme.border }]} />
            <StatItem label="Streak" value={streakCount} theme={theme} />
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

        <TouchableOpacity 
          className="mt-10 mb-5 bg-red-50 py-4 rounded-2xl flex-row justify-center items-center"
          onPress={signOut}
        >
          <Text className="text-red-500 font-bold text-lg">Sign Out</Text>
        </TouchableOpacity>

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
  iconBtn: { padding: 8, borderRadius: 12 },
  scroll: { paddingHorizontal: 24, paddingBottom: 120 }, // Fixed bottom overlap
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