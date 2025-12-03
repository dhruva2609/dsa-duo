import { useTheme } from '@react-navigation/native';
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
  // Use useTheme() to ensure access to dynamic colors (if theme changes)
  const { colors } = useTheme(); 

  return (
    <View style={[styles.header, { borderBottomColor: colors.border, backgroundColor: colors.card }, style]}>
      <View style={styles.left}>
        {showBack && (
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={24} color={colors.text} />
          </Pressable>
        )}
        {/* Placeholder to keep the title centered when no back button */}
        {!showBack && <View style={{ width: 40 }} />} 
      </View>
      <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
      <View style={styles.right}>
        {/* Placeholder to keep the title centered when no right element */}
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
    // Removed explicit white background, relying on theme color, but explicitly setting background color in header for uniformity
  },
  left: { width: 40, alignItems: 'flex-start' },
  right: { width: 40, alignItems: 'flex-end' },
  backBtn: { padding: 4 },
  title: { fontSize: 20, fontWeight: '800', flex: 1, textAlign: 'center' },
});