import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { Crown, Layers, Search, User } from 'lucide-react-native';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native';

const TabIcon = ({ focused, icon: Icon, label }: { focused: boolean; icon: any; label: string }) => {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconBox, focused && styles.iconBoxFocused]}>
        <Icon size={24} color={focused ? 'white' : Colors.textDim} />
      </View>
      {focused && <Text style={styles.label}>{label}</Text>}
    </View>
  );
};

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: styles.tabBar,
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Layers} label="Learn" />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Search} label="Explore" />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Crown} label="Rank" />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={User} label="Profile" />,
        }}
      />
      
      {/* Hidden Tabs (accessible via routes but no tab button) */}
      <Tabs.Screen name="signup" options={{ href: null }} />
      <Tabs.Screen name="login" options={{ href: null }} />
      <Tabs.Screen name="settings" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: Platform.OS === 'android' ? 70 : 90,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#F5F5F5',
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconBoxFocused: {
    backgroundColor: Colors.text, // Dark Navy
  },
  label: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.text,
  },
});