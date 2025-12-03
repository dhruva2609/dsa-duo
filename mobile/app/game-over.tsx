import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { HeartCrack, RotateCcw } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function GameOverScreen() {
  const router = useRouter();
  const { refillHearts, isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;

  const handleRefill = () => {
    refillHearts();
    router.replace('/(tabs)');
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        <HeartCrack size={80} color={Colors.error} style={{marginBottom: 20}} />
        <Text style={[styles.title, { color: theme.text }]}>Out of Hearts!</Text>
        <Text style={[styles.subtitle, { color: theme.textDim }]}>
          Review concepts to refill your health and try again.
        </Text>
      </View>

      <View style={styles.footer}>
        <Pressable style={[styles.btn, { backgroundColor: theme.primary, shadowColor: theme.primary }]} onPress={handleRefill}>
          <RotateCcw color="white" size={24} style={{marginRight: 8}} />
          <Text style={styles.btnText}>REFILL & TRY AGAIN</Text>
        </Pressable>
        
        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.textBtn}>
          <Text style={[styles.textBtnLabel, { color: theme.textDim }]}>Quit for now</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 32, fontWeight: '900', marginBottom: 12 },
  subtitle: { fontSize: 16, textAlign: 'center', lineHeight: 24, paddingHorizontal: 20 },
  footer: { marginBottom: 20, width: '100%', gap: 16 },
  btn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', flexDirection: 'row', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 5 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  textBtn: { alignItems: 'center', padding: 10 },
  textBtnLabel: { fontSize: 16, fontWeight: '700', textTransform: 'uppercase' }
});