// app/quiz/success.tsx
import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useTheme } from '@react-navigation/native'; // FIX: Import useTheme for consistency
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, Zap } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SuccessScreen() {
  const router = useRouter();
  const { addXp } = useUser();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { colors } = useTheme(); // FIX: Use theme colors

  const xpGained = 20;

  useEffect(() => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addXp(xpGained);
  }, []);

  const handleContinue = () => {
    router.dismissAll();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}> 
      <View style={styles.content}>
        <CheckCircle size={80} color={Colors.success} style={{marginBottom: 20}} />
        <Text style={[styles.title, { color: colors.text }]}>Level Complete!</Text>
        
        <View style={[styles.statsCard, { backgroundColor: colors.card, borderColor: colors.border }]}> 
           <View style={styles.statRow}>
             <Text style={[styles.statLabel, { color: colors.text }]}>XP Earned</Text>
             <View style={[styles.xpBadge, { backgroundColor: colors.background }]}>
                <Zap size={16} color="#FF9600" fill="#FF9600" />
                <Text style={styles.xpText}>+{xpGained}</Text>
             </View>
           </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={[styles.btn, { backgroundColor: Colors.primary }]} 
          onPress={handleContinue}
        >
          <Text style={styles.btnText}>CONTINUE</Text>
          <View style={styles.btnShadow} />
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
    borderWidth: 2, 
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { fontSize: 18, fontWeight: '700' },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 12 },
  xpText: { fontSize: 18, fontWeight: '800', color: '#FF9600' },
  
  footer: { marginBottom: 20 },
  btn: { 
    height: 56, borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center', position: 'relative'
  },
  btnText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  btnShadow: { 
    position: 'absolute', bottom: -4, width: '100%', height: '100%', 
    borderRadius: 16, backgroundColor: Colors.primaryDark, zIndex: -1 
  }
});