import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    if (!name || !email || !password) {
      Alert.alert('Missing Information', 'Please fill out all fields.');
      return;
    }
    // In a real app, you'd have more robust validation and an API call here.
    console.log('Creating account for:', { name, email });
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <Pressable onPress={() => router.back()} style={styles.backBtn}>
        <ChevronLeft size={32} color={Colors.text} />
      </Pressable>

      <Text style={styles.title}>Create Account</Text>
      <Text style={styles.subtitle}>Start your mastery journey today.</Text>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Name</Text>
          <TextInput 
            style={styles.input} 
            placeholder="John Doe" 
            placeholderTextColor="#C4C4C4" 
            value={name}
            onChangeText={setName}
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="hello@dsapod.com" 
            placeholderTextColor="#C4C4C4" 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <TextInput 
            style={styles.input} 
            placeholder="••••••••" 
            placeholderTextColor="#C4C4C4" 
            secureTextEntry 
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable style={styles.ctaBtn} onPress={handleSignup}>
          <Text style={styles.ctaText}>CREATE ACCOUNT</Text>
          <View style={styles.btnShadow} />
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 24, justifyContent: 'center' },
  backBtn: { position: 'absolute', top: 60, left: 24, zIndex: 10 },
  title: { fontSize: 32, fontWeight: '900', color: Colors.text, marginBottom: 8 },
  subtitle: { fontSize: 16, color: Colors.textDim, marginBottom: 40 },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.textDim, marginBottom: 8, textTransform: 'uppercase' },
  input: {
    width: '100%', height: 56, backgroundColor: '#F8F8FA', borderRadius: 16,
    paddingHorizontal: 16, fontSize: 16, color: Colors.text, borderWidth: 2, borderColor: '#F0F0F0'
  },
  ctaBtn: {
    height: 56, backgroundColor: Colors.success, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginTop: 20, position: 'relative'
  },
  ctaText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  btnShadow: {
    position: 'absolute', bottom: -4, width: '100%', height: '100%',
    borderRadius: 16, backgroundColor: Colors.successDark, zIndex: -1
  }
});