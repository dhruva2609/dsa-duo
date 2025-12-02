// app/quiz/success.tsx
import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, Zap } from 'lucide-react-native';
import React, { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function SuccessScreen() {
  const router = useRouter();
  const { addXp } = useUser();
  const { id } = useLocalSearchParams<{ id: string }>();

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
    <View style={styles.container}>
      <View style={styles.content}>
        <CheckCircle size={80} color={Colors.success} style={{marginBottom: 20}} />
        <Text style={styles.title}>Level Complete!</Text>
        
        <View style={styles.statsCard}>
           <View style={styles.statRow}>
             <Text style={styles.statLabel}>XP Earned</Text>
             <View style={styles.xpBadge}>
                <Zap size={16} color="#FF9600" fill="#FF9600" />
                <Text style={styles.xpText}>+20</Text>
             </View>
           </View>
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={styles.btn} 
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
  container: { flex: 1, backgroundColor: 'white', padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '800', color: Colors.primary, marginBottom: 40 },
  statsCard: { 
    width: '100%', backgroundColor: '#F6F5FF', padding: 24, borderRadius: 20,
    borderWidth: 2, borderColor: '#F0F0F0'
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { fontSize: 18, fontWeight: '700', color: Colors.text },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: 'white', padding: 8, borderRadius: 12 },
  xpText: { fontSize: 18, fontWeight: '800', color: '#FF9600' },
  
  footer: { marginBottom: 20 },
  btn: { 
    height: 56, backgroundColor: Colors.primary, borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center', position: 'relative'
  },
  btnText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  btnShadow: { 
    position: 'absolute', bottom: -4, width: '100%', height: '100%', 
    borderRadius: 16, backgroundColor: Colors.primaryDark, zIndex: -1 
  }
});