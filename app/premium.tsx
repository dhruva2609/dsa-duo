import { useUser } from '@/app/context/UserContext';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const PremiumScreen = () => {
  const { togglePremium, isPremium } = useUser();
  const { colors } = useTheme();
  const router = useRouter();

  const handlePress = () => {
    if (!isPremium) {
      togglePremium();
    }
    router.back();
  };

  return (
    <View style={styles.container}>
      <Text style={[styles.title, { color: colors.text }]}>Go Premium!</Text>
      <Text style={[styles.subtitle, { color: colors.text }]}>Unlock infinite hearts and learn without limits.</Text>
      
      <TouchableOpacity 
        style={[styles.button, { backgroundColor: colors.primary }]} 
        onPress={handlePress}
      >
        <Text style={styles.buttonText}>{isPremium ? 'You are already a Premium User' : 'Try Free for 7 Days'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 32,
    opacity: 0.7,
  },
  button: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default PremiumScreen;