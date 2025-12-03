import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight, Code, GitPullRequest, Home, LogOut, Moon, RefreshCw, Settings, Zap } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MenuModal() {
  const router = useRouter();
  const { mistakes, user, xp, isDark, toggleTheme } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.card }]}>
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Menu</Text>
        <Pressable onPress={() => router.back()} style={[styles.closeBtn, { backgroundColor: theme.background }]}>
          <Text style={{fontSize: 16, fontWeight: '600', color: theme.text}}>Done</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        <Pressable style={[styles.profileCard, { backgroundColor: theme.background, borderColor: theme.border }]} onPress={() => router.push('/profile')}>
          <View style={[styles.avatar, { backgroundColor: theme.primary }]}>
            <Text style={styles.avatarText}>DP</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: theme.text }]}>{user?.name || 'Dev'}</Text>
            <View style={styles.xpRow}>
               <Zap size={14} color={Colors.light.warning} fill={Colors.light.warning} />
               <Text style={[styles.profileXp, { color: theme.textDim }]}>{xp || 0} XP</Text>
            </View>
          </View>
          <ChevronRight size={20} color={theme.textDim} />
        </Pressable>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Learning</Text>
          <MenuItem icon={<Home size={22} color={theme.text} />} label="Home" onPress={() => { router.dismiss(); router.push('/(tabs)'); }} theme={theme} />
          <MenuItem icon={<BookOpen size={22} color={theme.text} />} label="Library" onPress={() => { router.dismiss(); router.push('/(tabs)/explore'); }} theme={theme} />
          <MenuItem icon={<GitPullRequest size={22} color={Colors.error} />} label="Code Blitz" onPress={() => { router.dismiss(); router.push('/blitz'); }} theme={theme} />
          <MenuItem icon={<RefreshCw size={22} color="#FF9600" />} label="Review Mistakes" badge={mistakes?.length > 0 ? String(mistakes.length) : undefined} onPress={() => { router.dismiss(); router.push('/review'); }} theme={theme} />
          <MenuItem icon={<Code size={22} color={Colors.success} />} label="JS Playground" onPress={() => { router.dismiss(); router.push('/playground'); }} theme={theme} />
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionLabel, { color: theme.textDim }]}>Preferences</Text>
          <MenuItem icon={<Settings size={22} color={theme.text} />} label="Settings" onPress={() => router.push('/settings')} theme={theme} />
          <MenuItem icon={<Moon size={22} color={theme.text} />} label="Dark Mode" rightElement={<Pressable onPress={toggleTheme}><Text style={{color: theme.primary, fontWeight:'700'}}>{isDark ? 'ON' : 'OFF'}</Text></Pressable>} theme={theme} />
        </View>

        <Pressable style={[styles.logoutBtn, { backgroundColor: isDark ? '#1B2559' : '#FFF0F0' }]} onPress={() => router.replace('/login')}>
           <LogOut size={20} color={Colors.error} />
           <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

function MenuItem({ icon, label, badge, rightElement, onPress, theme }: any) {
  return (
    <Pressable style={({pressed}) => [styles.menuItem, pressed && { opacity: 0.6 }]} onPress={onPress}>
      <View style={styles.menuLeft}>
        {icon}
        <Text style={[styles.menuLabel, { color: theme.text }]}>{label}</Text>
      </View>
      <View style={styles.menuRight}>
        {rightElement ? rightElement : (
          badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1 },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  closeBtn: { padding: 4, borderRadius: 8, paddingHorizontal: 10 },
  scrollContent: { padding: 24, paddingBottom: 50 },
  profileCard: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1 },
  avatar: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { color: 'white', fontWeight: '800', fontSize: 18 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '700' },
  xpRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  profileXp: { fontSize: 13, fontWeight: '600' },
  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 12, fontWeight: '700', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  menuLabel: { fontSize: 16, fontWeight: '600' },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { backgroundColor: Colors.error, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, padding: 16, borderRadius: 12 },
  logoutText: { color: Colors.error, fontWeight: '700', fontSize: 15, marginLeft: 8 }
});