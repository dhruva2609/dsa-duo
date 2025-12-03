import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { Tabs } from 'expo-router';
import { Crown, Layers, Search, User } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const TabIcon = ({ focused, icon: Icon, label, color }: { focused: boolean; icon: any; label: string; color: string }) => {
  return (
    <View style={styles.tabItem}>
      <View style={[styles.iconBox, focused && { backgroundColor: color + '15' }]}>
        <Icon size={24} color={focused ? color : Colors.light.icon} />
      </View>
      <Text style={[styles.label, { color: focused ? color : Colors.light.icon, fontWeight: focused ? '700' : '500' }]}>{label}</Text>
    </View>
  );
};

export default function TabLayout() {
  const { isDark } = useUser();
  const insets = useSafeAreaInsets();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: [
          styles.tabBar,
          { 
            height: 60 + insets.bottom, // Dynamic height based on device
            backgroundColor: theme.card,
            borderTopColor: theme.border,
            paddingBottom: insets.bottom, // Push content up from home indicator
          }
        ],
        tabBarHideOnKeyboard: true,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Layers} label="Learn" color={Colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Search} label="Explore" color={Colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={Crown} label="Rank" color={Colors.primary} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon={User} label="Profile" color={Colors.primary} />,
        }}
      />
      
      {/* Hidden Tabs */}
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
    borderTopWidth: 1,
    elevation: 0,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
    paddingTop: 10,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    height: 50,
  },
  iconBox: {
    width: 32, // Smaller icon box to save space
    height: 32,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
  },
});