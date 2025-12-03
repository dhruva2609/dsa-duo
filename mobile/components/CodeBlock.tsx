import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import React from 'react';
import { Platform, StyleSheet, Text, View } from 'react-native'; // Fixed: Added Platform import

const CodeBlock = ({ code }: { code: string }) => {
  const { isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;

  // Simple syntax highlighting logic
  const highlight = (text: string) => {
    const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'from', 'console'];
    
    // Colors adjusted for theme
    const keywordColor = isDark ? '#569CD6' : '#0000FF'; // Blue
    const stringColor = isDark ? '#CE9178' : '#A31515'; // Red/Orange
    const numberColor = isDark ? '#B5CEA8' : '#098658'; // Green
    
    const parts = text.split(/(\bconst\b|\blet\b|\bvar\b|\bfunction\b|\breturn\b|\bif\b|\belse\b|\bfor\b|\bwhile\b|\bimport\b|\bexport\b|\bfrom\b|\bconsole\b|'.*?'|".*?"|`.*?`|\b\d+\b)/g);

    return parts.map((part, index) => {
      if (keywords.includes(part)) {
        return <Text key={index} style={{ color: keywordColor, fontWeight: 'bold' }}>{part}</Text>;
      } else if (/^'.*?'$|^".*?"$|^`.*?`$/.test(part)) {
        return <Text key={index} style={{ color: stringColor }}>{part}</Text>;
      } else if (/^\d+$/.test(part)) {
        return <Text key={index} style={{ color: numberColor }}>{part}</Text>;
      }
      return <Text key={index} style={{ color: theme.text }}>{part}</Text>;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: isDark ? '#1E1E1E' : '#F8F9FA', borderColor: theme.border }]}>
      <Text style={[styles.code, { color: theme.text }]}>
        {highlight(code)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    width: '100%',
  },
  code: {
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
});

export default CodeBlock;