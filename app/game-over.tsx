import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { HeartCrack, RotateCcw } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function GameOverScreen() {
  const router = useRouter();
  const { refillHearts } = useUser();

  const handleRefill = () => {
    refillHearts();
    router.replace('/(tabs)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <HeartCrack size={80} color={Colors.error} style={{marginBottom: 20}} />
        <Text style={styles.title}>Out of Hearts!</Text>
        <Text style={styles.subtitle}>
          You made too many mistakes. Take a break or practice to refill your health.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={styles.btn} onPress={handleRefill}>
          <RotateCcw color="white" size={24} style={{marginRight: 8}} />
          <Text style={styles.btnText}>REFILL & TRY AGAIN</Text>
          <View style={styles.btnShadow} />
        </Pressable>
        
        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.textBtn}>
          <Text style={styles.textBtnLabel}>Quit for now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 24, justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', color: Colors.text, marginBottom: 12 },
  subtitle: { fontSize: 16, color: Colors.textDim, textAlign: 'center', lineHeight: 24 },
  
  footer: { marginBottom: 20, width: '100%', gap: 16 },
  btn: { 
    height: 56, backgroundColor: Colors.primary, borderRadius: 16, 
    justifyContent: 'center', alignItems: 'center', flexDirection: 'row', position: 'relative'
  },
  btnText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  btnShadow: { position: 'absolute', bottom: -4, width: '100%', height: '100%', borderRadius: 16, backgroundColor: Colors.primaryDark, zIndex: -1 },
  
  textBtn: { alignItems: 'center', padding: 10 },
  textBtnLabel: { fontSize: 16, fontWeight: '700', color: Colors.primary, textTransform: 'uppercase' }
});