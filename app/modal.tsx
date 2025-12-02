import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { BookOpen, ChevronRight, Code, Home, LogOut, Moon, RefreshCw, Settings, Zap } from 'lucide-react-native';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

export default function MenuModal() {
  const router = useRouter();
  const { mistakes } = useUser();
  
  // Safe check if context exists
  let user;
  try { user = useUser(); } catch { user = null; }

  return (
    <View style={styles.container}>
      {/* HEADER / CLOSE */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Menu</Text>
        <Pressable onPress={() => router.back()} style={styles.closeBtn}>
          <Text style={{fontSize: 16, fontWeight: '600', color: Colors.text}}>Done</Text>
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* USER PROFILE CARD */}
        <Pressable style={styles.profileCard} onPress={() => router.push('/profile')}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>JD</Text>
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Developer</Text>
            <View style={styles.xpRow}>
               <Zap size={14} color={Colors.primary} fill={Colors.primary} />
               <Text style={styles.profileXp}>{user?.xp || 0} XP</Text>
            </View>
          </View>
          <ChevronRight size={20} color={Colors.textDim} />
        </Pressable>

        {/* MENU ITEMS */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Learning</Text>
          
          <MenuItem 
            icon={<Home size={22} color={Colors.text} />} 
            label="Home" 
            onPress={() => { router.dismiss(); router.push('/(tabs)'); }} 
          />
          <MenuItem 
            icon={<BookOpen size={22} color={Colors.text} />} 
            label="Library" 
            onPress={() => { router.dismiss(); router.push('/(tabs)/explore'); }} 
          />
          
          {/* NEW FEATURES */}
          <MenuItem 
            icon={<RefreshCw size={22} color="#FF9600" />} 
            label="Review Mistakes" 
            badge={mistakes?.length > 0 ? String(mistakes.length) : undefined}
            onPress={() => { router.dismiss(); router.push('/review'); }} 
          />
          <MenuItem 
            icon={<Code size={22} color={Colors.success} />} 
            label="JS Playground" 
            onPress={() => { router.dismiss(); router.push('/playground'); }} 
          />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Preferences</Text>
          <MenuItem icon={<Settings size={22} color={Colors.text} />} label="Settings" onPress={() => router.push('/settings')} />
          <MenuItem icon={<Moon size={22} color={Colors.text} />} label="Dark Mode" />
        </View>

        <Pressable style={styles.logoutBtn} onPress={() => router.replace('/login')}>
           <LogOut size={20} color={Colors.error} />
           <Text style={styles.logoutText}>Log Out</Text>
        </Pressable>

      </ScrollView>
    </View>
  );
}

// Helper Component for List Items
function MenuItem({ icon, label, badge, rightElement, onPress }: any) {
  return (
    <Pressable style={({pressed}) => [styles.menuItem, pressed && styles.menuItemPressed]} onPress={onPress}>
      <View style={styles.menuLeft}>
        {icon}
        <Text style={styles.menuLabel}>{label}</Text>
      </View>
      <View style={styles.menuRight}>
        {rightElement ? rightElement : (
          <>
            {badge && <View style={styles.badge}><Text style={styles.badgeText}>{badge}</Text></View>}
          </>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingVertical: 20, borderBottomWidth: 1, borderBottomColor: '#F0F0F0' },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  closeBtn: { padding: 4, backgroundColor: '#F5F5F5', borderRadius: 8, paddingHorizontal: 10 },
  scrollContent: { padding: 24, paddingBottom: 50 },
  profileCard: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8F8FA', padding: 16, borderRadius: 16, marginBottom: 24, borderWidth: 1, borderColor: '#F0F0F0' },
  avatar: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  avatarText: { color: 'white', fontWeight: '800', fontSize: 18 },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '700', color: Colors.text },
  xpRow: { flexDirection: 'row', alignItems: 'center', marginTop: 4, gap: 4 },
  profileXp: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  section: { marginBottom: 30 },
  sectionLabel: { fontSize: 12, fontWeight: '700', color: Colors.textDim, textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 },
  menuItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 14 },
  menuItemPressed: { opacity: 0.6 },
  menuLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  menuLabel: { fontSize: 16, fontWeight: '600', color: Colors.text },
  menuRight: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  badge: { backgroundColor: Colors.error, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8 },
  badgeText: { color: 'white', fontSize: 12, fontWeight: '700' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, padding: 16, borderRadius: 12, backgroundColor: '#FFF0F0' },
  logoutText: { color: Colors.error, fontWeight: '700', fontSize: 15, marginLeft: 8 }
});