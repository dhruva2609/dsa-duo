import { useUser } from '@/app/context/UserContext';
import { useRouter } from 'expo-router';
import { Lock, Mail, User } from 'lucide-react-native';
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

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signIn } = useUser();
  const router = useRouter();

  const handleSignup = async () => {
    if (!name || !email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await response.json();

      if (response.ok) {
        signIn(data.user, data.token);
        router.replace('/(tabs)');
      } else {
        Alert.alert('Signup Failed', data.message || 'Something went wrong');
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
          <View className="w-20 h-20 bg-green-500 rounded-3xl items-center justify-center shadow-lg shadow-green-300">
             <Text className="text-white text-4xl font-bold">D</Text>
          </View>
          <Text className="text-3xl font-extrabold text-slate-800 mt-4 tracking-tight">
            Create Account
          </Text>
          <Text className="text-slate-500 mt-2 text-center">
            Join the community and master DSA
          </Text>
        </View>

        <View className="space-y-4">
          <View>
            <Text className="text-slate-700 font-semibold mb-2 ml-1">Full Name</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-3">
              <User size={20} color="#64748b" />
              <TextInput
                className="flex-1 ml-3 text-slate-800 text-base"
                placeholder="John Doe"
                value={name}
                onChangeText={setName}
              />
            </View>
          </View>

          <View className="mt-4">
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

          <TouchableOpacity
            className={`mt-10 py-4 rounded-2xl items-center shadow-md ${
              loading ? 'bg-green-300' : 'bg-green-600 shadow-green-200'
            }`}
            onPress={handleSignup}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">Create Account</Text>
            )}
          </TouchableOpacity>
        </View>

        <View className="flex-row justify-center mt-10">
          <Text className="text-slate-500">Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text className="text-green-600 font-bold">Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
