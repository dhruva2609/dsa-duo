import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, ViewStyle } from 'react-native';

interface HeaderProps {
  title: string;
  showBack?: boolean;
  rightElement?: React.ReactNode;
  style?: ViewStyle;
}

export function Header({ title, showBack = true, rightElement, style }: HeaderProps) {
  const router = useRouter();
  const { isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;

  return (
    <View style={[styles.header, { borderBottomColor: theme.border, backgroundColor: theme.background }, style]}>
      <View style={styles.left}>
        {showBack && (
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={theme.text} />
          </Pressable>
        )}
        {!showBack && <View style={{ width: 40 }} />} 
      </View>
      <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
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
    paddingTop: Platform.OS === 'android' ? 50 : 60, 
    paddingHorizontal: 24, 
    paddingBottom: 12,
    borderBottomWidth: 1, 
  },
  left: { width: 40, alignItems: 'flex-start' },
  right: { width: 40, alignItems: 'flex-end' },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800', flex: 1, textAlign: 'center' },
});