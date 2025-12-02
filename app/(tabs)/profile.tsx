import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Award, Flame, Layers, Search, Settings, Trash2, User, Zap } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function ProfileScreen() {
  const router = useRouter();
  const { xp, hearts, achievements, resetProgress } = useUser();

  const badges = [
    { id: 'first_win', title: 'First Steps', desc: 'Complete your first quiz', icon: <Zap size={24} color="#FFD700" /> },
    { id: 'novice_coder', title: 'Novice Coder', desc: 'Earn 100 XP', icon: <CodeIcon /> },
    { id: 'streak_3', title: 'On Fire', desc: 'Reach a 3-day streak', icon: <Flame size={24} color="#FF5C95" /> }
  ];

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Profile</Text>
          <Pressable onPress={() => router.push('/settings')}><Settings size={24} color={Colors.text} /></Pressable>
        </View>

        <View style={styles.profileHeader}>
          <View style={styles.avatar}><Text style={styles.avatarText}>JD</Text></View>
          <Text style={styles.name}>John Developer</Text>
          <Text style={styles.handle}>@johndev</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statCard}><Flame size={24} color={Colors.error} fill={Colors.error} /><Text style={styles.statValue}>{hearts}</Text><Text style={styles.statLabel}>Hearts</Text></View>
          <View style={styles.statCard}><Zap size={24} color={Colors.primary} fill={Colors.primary} /><Text style={styles.statValue}>{xp}</Text><Text style={styles.statLabel}>Total XP</Text></View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Achievements</Text>
          {badges.map(badge => {
            const isUnlocked = achievements.includes(badge.id);
            return (
              <View key={badge.id} style={[styles.achievementCard, !isUnlocked && {opacity: 0.5}]}>
                <View style={[styles.badge, { backgroundColor: isUnlocked ? '#FFF5E0' : '#F0F0F0' }]}>
                   {isUnlocked ? badge.icon : <Award size={24} color={Colors.textDim} />}
                </View>
                <View style={styles.achievementInfo}>
                  <Text style={styles.achTitle}>{badge.title}</Text>
                  <Text style={styles.achDesc}>{badge.desc}</Text>
                </View>
                {isUnlocked && <CheckIcon />}
              </View>
            );
          })}
        </View>

        <Pressable style={styles.resetBtn} onPress={resetProgress}>
            <Trash2 size={20} color={Colors.error} />
            <Text style={styles.resetText}>Reset Progress</Text>
        </Pressable>
      </ScrollView>

      <View style={styles.bottomBar}>
        <Pressable style={styles.navItem} onPress={() => router.push('/(tabs)')}><Layers size={26} color={Colors.textDim} /></Pressable>
        <Pressable style={styles.navItem} onPress={() => router.push('/(tabs)/explore')}><Search size={26} color={Colors.textDim} /></Pressable>
        <Pressable style={styles.navItem}><View style={styles.navIconActive}><User size={22} color="white" /></View><Text style={styles.navLabelActive}>Profile</Text></Pressable>
      </View>
    </View>
  );
}

function CodeIcon() { return <Layers size={24} color="#3F20F0" /> }
function CheckIcon() { return <View style={{backgroundColor: Colors.success, borderRadius: 10, padding: 2}}><Award size={12} color="white" /></View> }

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 24, marginBottom: 20 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: Colors.text },
  profileHeader: { alignItems: 'center', marginBottom: 30 },
  avatar: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#E0E0FF', justifyContent: 'center', alignItems: 'center', marginBottom: 16, borderWidth: 4, borderColor: 'white', shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10 },
  avatarText: { fontSize: 32, fontWeight: '800', color: Colors.primary },
  name: { fontSize: 24, fontWeight: '800', color: Colors.text },
  handle: { fontSize: 16, color: Colors.textDim, marginTop: 4 },
  statsRow: { flexDirection: 'row', paddingHorizontal: 24, gap: 16, marginBottom: 30 },
  statCard: { flex: 1, backgroundColor: 'white', padding: 20, borderRadius: 20, alignItems: 'center', borderWidth: 1, borderColor: '#F0F0F0', shadowColor: '#000', shadowOpacity: 0.05, shadowOffset: {width: 0, height: 4}, shadowRadius: 8 },
  statValue: { fontSize: 24, fontWeight: '800', color: Colors.text, marginTop: 8 },
  statLabel: { fontSize: 14, color: Colors.textDim, fontWeight: '600' },
  section: { paddingHorizontal: 24 },
  sectionTitle: { fontSize: 20, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  achievementCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#F0F0F0', marginBottom: 12 },
  badge: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  achievementInfo: { flex: 1 },
  achTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  achDesc: { fontSize: 13, color: Colors.textDim, marginTop: 2 },
  resetBtn: { marginTop: 40, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 8 },
  resetText: { color: Colors.error, fontWeight: '700' },
  bottomBar: { position: 'absolute', bottom: 0, width: '100%', height: 90, backgroundColor: 'white', borderTopWidth: 1, borderTopColor: '#F5F5F5', flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', paddingBottom: 20, elevation: 20 },
  navItem: { alignItems: 'center', justifyContent: 'center', width: 60 },
  navIconActive: { width: 48, height: 48, backgroundColor: Colors.text, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  navLabelActive: { fontSize: 12, fontWeight: '700', color: Colors.text }
});