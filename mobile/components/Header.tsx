import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export function Header({ title, showBack = true, rightElement, style }: HeaderProps) {
  const router = useRouter();
  const { isDark } = useUser();
  const insets = useSafeAreaInsets();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[
      styles.header, 
      { 
        borderBottomColor: theme.border, 
        backgroundColor: theme.background,
        paddingTop: insets.top + 10, // Dynamic safe area padding
        height: 60 + insets.top,     // Dynamic total height
      }, 
      style
    ]}>
      <View style={styles.left}>
        {showBack ? (
          <Pressable onPress={() => router.back()} style={styles.backBtn} hitSlop={10}>
            <ChevronLeft size={24} color={theme.text} />
          </Pressable>
        ) : <View style={{ width: 40 }} />} 
      </View>
      
      <Text 
        style={[styles.title, { color: theme.text }]} 
        numberOfLines={1} 
        adjustsFontSizeToFit
      >
        {title}
      </Text>
      
      <View style={styles.right}>
        {rightElement || <View style={{ width: 40 }} />}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    paddingHorizontal: 20, 
    paddingBottom: 12,
    borderBottomWidth: 1, 
    zIndex: 100,
  },
  left: { width: 40, alignItems: 'flex-start' },
  right: { width: 40, alignItems: 'flex-end' },
  backBtn: { padding: 4, marginLeft: -4 },
  title: { 
    fontSize: 18, 
    fontWeight: '800', 
    flex: 1, 
    textAlign: 'center',
    marginHorizontal: 10, // Prevent touching buttons
  },
});