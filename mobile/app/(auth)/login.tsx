import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'expo-router';
import { Lock, Mail } from 'lucide-react-native';
import React, { useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useUser();
  const router = useRouter();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      // Replace with your local IP for physical device testing if needed
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        signIn(data.user, data.token);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Login Failed', data.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Network Error', 'Could not connect to server. Make sure backend is running.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1 px-6 justify-center"
      >
        <View className="mb-10 items-center">
          <View className="w-20 h-20 bg-blue-500 rounded-3xl items-center justify-center shadow-lg shadow-blue-300">
             <Text className="text-white text-4xl font-bold">D</Text>
          </View>
          <Text className="text-3xl font-extrabold text-slate-800 mt-4 tracking-tight">
            Welcome Back
          </Text>
          <Text className="text-slate-500 mt-2 text-center">
            Sign in to continue your DSA journey
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-slate-700 font-semibold mb-2 ml-1">Email Address</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Mail size={20} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 text-slate-800 text-base"
                placeholder="you@example.com"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View className="mt-4">
            <Text className="text-slate-700 font-semibold mb-2 ml-1">Password</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <Lock size={20} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 text-slate-800 text-base"
                placeholder="••••••••"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
              />
            </View>
          </View>

          <TouchableOpacity className="mt-2 items-end">
            <Text className="text-blue-500 font-medium">Forgot Password?</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className={`mt-8 py-4 rounded-2xl items-center shadow-md ${
              loading ? 'bg-blue-300' : 'bg-blue-600 shadow-blue-200'
            }`}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Sign In</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-10">
          <Text className="text-slate-500">Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text className="text-blue-600 font-bold">Sign Up</Text>
          </TouchableOpacity>

        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
