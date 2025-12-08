import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { apiCall } from '@/utils/api'; // Import the helper
import { useRouter } from 'expo-router';
import { Layers } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, Pressable, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn, isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const data = await apiCall('/api/auth/login', 'POST', { email, password });
      
      // data.user and data.token come from the backend response
      signIn(data.user, data.token); 
      
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Login Failed', error.message);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={styles.header}>
        <View style={[styles.logoBox, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
          <Layers size={32} color="white" />
        </View>
        <Text style={[styles.title, { color: theme.text }]}>Welcome back!</Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textDim }]}>Email</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
            placeholder="test@example.com" 
            placeholderTextColor={theme.textDim}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={[styles.label, { color: theme.textDim }]}>Password</Text>
          <TextInput 
            style={[styles.input, { backgroundColor: theme.card, color: theme.text, borderColor: theme.border }]} 
            placeholder="password" 
            placeholderTextColor={theme.textDim}
            secureTextEntry
            value={password}
            onChangeText={setPassword}
          />
        </View>

        <Pressable style={[styles.loginBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]} onPress={handleLogin}>
          <Text style={styles.loginText}>LOG IN</Text>
        </Pressable>

        <View style={styles.footer}>
          <Text style={[styles.footerText, { color: theme.textDim }]}>Don't have an account?</Text>
          <Pressable onPress={() => router.push('/(tabs)/signup')}>
            <Text style={[styles.link, { color: theme.primary }]}>Sign Up</Text>
          </Pressable>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  header: { alignItems: 'center', marginBottom: 40 },
  logoBox: { width: 64, height: 64, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 20, shadowOpacity: 0.3, shadowRadius: 12, shadowOffset: {width: 0, height: 8}, elevation: 10 },
  title: { fontSize: 28, fontWeight: '800' },
  form: { width: '100%' },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '700', marginBottom: 8, textTransform: 'uppercase' },
  input: { width: '100%', height: 56, borderRadius: 16, paddingHorizontal: 16, fontSize: 16, borderWidth: 1 },
  loginBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginTop: 10, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: {width: 0, height: 4}, elevation: 5 },
  loginText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30, gap: 8 },
  footerText: { fontSize: 15, fontWeight: '600' },
  link: { fontSize: 15, fontWeight: '800' }
});