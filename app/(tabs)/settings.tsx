import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Bell, ChevronLeft, Lock, LogOut, Moon, Volume2 } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, ScrollView, StyleSheet, Switch, Text, View } from 'react-native';

export default function SettingsScreen() {
  const router = useRouter();
  const [isDark, setIsDark] = React.useState(false);
  const [notifications, setNotifications] = React.useState(true);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={28} color={Colors.text} />
        </Pressable>
        <Text style={styles.title}>Settings</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.sectionHeader}>Preferences</Text>
        
        <View style={styles.section}>
          <SettingItem 
            icon={<Bell size={22} color={Colors.primary} />}
            label="Notifications"
            value={notifications}
            onToggle={() => setNotifications(!notifications)}
            type="switch"
          />
          <Divider />
          <SettingItem 
            icon={<Volume2 size={22} color={Colors.accentPink} />}
            label="Sound Effects"
            value={true}
            type="switch"
          />
          <Divider />
          <SettingItem 
            icon={<Moon size={22} color="#7D5FFF" />}
            label="Dark Mode"
            value={isDark}
            onToggle={() => setIsDark(!isDark)}
            type="switch"
          />
        </View>

        <Text style={styles.sectionHeader}>Account</Text>
        <View style={styles.section}>
          <SettingItem 
            icon={<Lock size={22} color={Colors.textDim} />}
            label="Privacy Policy"
            type="link"
          />
          <Divider />
          <SettingItem 
            icon={<LogOut size={22} color={Colors.error} />}
            label="Sign Out"
            type="button"
            textColor={Colors.error}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function SettingItem({ icon, label, value, onToggle, type, textColor }: any) {
  return (
    <View style={styles.item}>
      <View style={styles.itemLeft}>
        <View style={styles.iconBox}>{icon}</View>
        <Text style={[styles.label, textColor && { color: textColor }]}>{label}</Text>
      </View>
      {type === 'switch' && (
        <Switch 
          value={value} 
          onValueChange={onToggle}
          trackColor={{ false: '#E5E5E5', true: Colors.primary }}
          thumbColor={'white'}
        />
      )}
      {type === 'link' && <ChevronLeft size={20} color={Colors.textDim} style={{transform: [{rotate: '180deg'}]}} />}
    </View>
  );
}

function Divider() {
  return <View style={styles.divider} />;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F6F5FF' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingTop: Platform.OS === 'android' ? 50 : 60, paddingHorizontal: 20, paddingBottom: 20,
    backgroundColor: 'white'
  },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800', color: Colors.text },
  content: { padding: 20 },
  sectionHeader: { fontSize: 14, fontWeight: '700', color: Colors.textDim, marginBottom: 10, marginTop: 10, textTransform: 'uppercase' },
  section: { backgroundColor: 'white', borderRadius: 20, padding: 4, marginBottom: 20 },
  item: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16 },
  itemLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 36, height: 36, borderRadius: 10, backgroundColor: '#F8F8FA', justifyContent: 'center', alignItems: 'center' },
  label: { fontSize: 16, fontWeight: '600', color: Colors.text },
  divider: { height: 1, backgroundColor: '#F0F0F0', marginLeft: 66 }
});