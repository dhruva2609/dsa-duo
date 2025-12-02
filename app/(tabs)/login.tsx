import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Layers } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useUser();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // Hardcoded credentials for demo purposes
    if (email.toLowerCase() === 'test@example.com' && password === 'password') {
      signIn({ name: 'Test User' });
      router.replace('/(tabs)');
    } else {
      Alert.alert('Login Failed', 'Invalid email or password.');
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View style={styles.logoBox}>
          <Layers size={32} color="white" />
        </View>
        <Text style={styles.title}>Welcome back!</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput 
            style={styles.input} 
            placeholder="test@example.com" 
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
            placeholder="password" 
            placeholderTextColor="#C4C4C4"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable style={styles.loginBtn} onPress={handleLogin}>
          <Text style={styles.loginText}>LOG IN</Text>
          <View style={styles.btnShadow} />
        </Pressable>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.push('/(tabs)/signup')}>
            <Text style={styles.link}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white', padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoBox: {
    width: 64, height: 64, borderRadius: 20, backgroundColor: Colors.primary,
    justifyContent: 'center', alignItems: 'center', marginBottom: 20,
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: {width: 0, height: 8}
  },
  title: { fontSize: 28, fontWeight: '800', color: Colors.text },
  
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', color: Colors.textDim, marginBottom: 8, textTransform: 'uppercase' },
  input: {
    width: '100%', height: 56, backgroundColor: '#F8F8FA', borderRadius: 16,
    paddingHorizontal: 16, fontSize: 16, color: Colors.text, borderWidth: 2, borderColor: '#F0F0F0'
  },
  
  loginBtn: {
    height: 56, backgroundColor: Colors.primary, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center', marginTop: 10,
    position: 'relative'
  },
  loginText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  btnShadow: {
    position: 'absolute', bottom: -4, width: '100%', height: '100%',
    borderRadius: 16, backgroundColor: Colors.primaryDark, zIndex: -1
  },
  
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, gap: 8 },
  footerText: { fontSize: 15, color: Colors.textDim, fontWeight: '600' },
  link: { fontSize: 15, color: Colors.primary, fontWeight: '800' }
});