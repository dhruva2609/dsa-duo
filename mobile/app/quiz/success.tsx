import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { CheckCircle, Zap } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SuccessScreen() {
  const router = useRouter();
  const { addXp, isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addXp(20);
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <CheckCircle size={80} color={Colors.success} style={{marginBottom: 20}} />
        <Text style={[styles.title, { color: theme.primary }]}>Level Complete!</Text>
        
        <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}>
           <View style={styles.statRow}>
             <Text style={[styles.statLabel, { color: theme.text }]}>XP Earned</Text>
             <View style={[styles.xpBadge, { backgroundColor: theme.background }]}>
                <Zap size={16} color="#FFCE20" fill="#FFCE20" />
                <Text style={styles.xpText}>+20</Text>
             </View>
           </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={[styles.btn, { backgroundColor: theme.primary, shadowColor: theme.primary }]} 
          onPress={() => { router.dismissAll(); router.replace('/(tabs)'); }}
        >
          <Text style={styles.btnText}>CONTINUE</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '800', marginBottom: 40 },
  statsCard: { 
    width: '100%', padding: 24, borderRadius: 20,
    borderWidth: 1, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { fontSize: 18, fontWeight: '700' },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 12 },
  xpText: { fontSize: 18, fontWeight: '800', color: '#FFCE20' },
  footer: { marginBottom: 20 },
  btn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 1 }
});