import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Bell, ChevronLeft, Lock, LogOut, Moon, Volume2 } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const { isDark, toggleTheme, notifications, toggleNotifications, soundEffects, toggleSoundEffects, signOut } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color={theme.text} />
        </Pressable>
        <Text style={[styles.title, { color: theme.text }]}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={[styles.sectionHeader, { color: theme.textDim }]}>Preferences</Text>
        
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <SettingItem 
            icon={<Bell size={22} color={theme.primary} />}
            label="Notifications"
            value={notifications}
            onToggle={toggleNotifications}
            type="switch"
            theme={theme}
          />
          <Divider theme={theme} />
          <SettingItem 
            icon={<Volume2 size={22} color={theme.error} />}
            label="Sound Effects"
            value={soundEffects}
            onToggle={toggleSoundEffects}
            type="switch"
            theme={theme}
          />
          <Divider theme={theme} />
          <SettingItem 
            icon={<Moon size={22} color={theme.primary} />}
            label="Dark Mode"
            value={isDark}
            onToggle={toggleTheme}
            type="switch"
            theme={theme}
          />
        </View>

        <Text style={[styles.sectionHeader, { color: theme.textDim }]}>Account</Text>
        <View style={[styles.section, { backgroundColor: theme.card }]}>
          <SettingItem 
            icon={<Lock size={22} color={theme.textDim} />}
            label="Privacy Policy"
            type="link"
            theme={theme}
          />
          <Divider theme={theme} />
          <SettingItem 
            icon={<LogOut size={22} color={theme.error} />}
            label="Sign Out"
            type="button"
            textColor={theme.error}
            onPress={signOut}
            theme={theme}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SettingItem({ icon, label, value, onToggle, type, textColor, onPress, theme }: any) {
  return (
    <Pressable style={styles.item} onPress={type === 'button' || type === 'link' ? onPress : undefined}>
      <View style={styles.itemLeft}>
        <View style={[styles.iconBox, { backgroundColor: theme.background }]}>{icon}</View>
        <Text style={[styles.label, { color: textColor || theme.text }]}>{label}</Text>
      </View>
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: theme.border, true: theme.primary }}
          thumbColor={'white'}
        />
      )}
      {type === 'link' && <ChevronLeft size={20} color={theme.textDim} style={{transform: [{rotate: '180deg'}]}} />}
    </Pressable>
  );
}

function Divider({ theme }: { theme: any }) {
  return <View style={[styles.divider, { backgroundColor: theme.border }]} />;
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 20, paddingBottom: 20,
    borderBottomWidth: 1
  },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800' },
  content: { padding: 20 },
  sectionHeader: { fontSize: 14, fontWeight: '700', marginBottom: 10, marginTop: 10, textTransform: 'uppercase' },
  section: { borderRadius: 20, padding: 4, marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 36, height: 36, borderRadius: 10, justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600' },
  divider: { height: 1, marginLeft: 66 }
});