import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Crown } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function PremiumScreen() {
  const { isPremium, isDark } = useUser();
  const router = useRouter();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Crown size={80} color="#FFCE20" style={{marginBottom: 24}} />
      <Text style={[styles.title, { color: theme.text }]}>Go Premium!</Text>
      <Text style={[styles.subtitle, { color: theme.textDim }]}>Unlock infinite hearts and learn without limits.</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: theme.primary, shadowColor: theme.primary }]} 
        onPress={() => router.back()}
      >
        <Text style={styles.buttonText}>{isPremium ? 'You are already a Premium User' : 'Try Free for 7 Days'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.back()} style={{marginTop: 20}}>
        <Text style={{color: theme.textDim, fontWeight: '600'}}>Maybe Later</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 32, fontWeight: 'bold', marginBottom: 8 },
  subtitle: { fontSize: 18, textAlign: 'center', marginBottom: 32, maxWidth: 300 },
  button: { paddingVertical: 18, paddingHorizontal: 32, borderRadius: 30, width: '100%', alignItems: 'center', shadowOpacity: 0.3, shadowRadius: 10, shadowOffset: {width: 0, height: 5}, elevation: 5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});