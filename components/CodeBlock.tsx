import { useTheme } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

const CodeBlock = ({ code }: { code: string }) => {
  const { colors } = useTheme();

  const keywords = ['const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'import', 'export', 'from'];
  const numbers = /\b\d+\b/g;
  const strings = /('.*?'|".*?"|`.*?`)/g;

  const highlight = (text: string) => {
    let highlighted = text;

    // Highlight keywords
    keywords.forEach(keyword => {
      const regex = new RegExp(`\\b${keyword}\\b`, 'g');
      highlighted = highlighted.replace(regex, `<span class="keyword">${keyword}</span>`);
    });

    // Highlight numbers
    highlighted = highlighted.replace(numbers, `<span class="number">$&</span>`);

    // Highlight strings
    highlighted = highlighted.replace(strings, `<span class="string">$&</span>`);

    return highlighted.split(/(<span class=".*?".*?<\/span>)/g).map((part, index) => {
      if (part.startsWith('<span')) {
        const className = part.match(/class="(.*?)"/)?.[1];
        const content = part.replace(/<.*?>/g, '');
        switch (className) {
          case 'keyword':
            return <Text key={index} style={[styles.keyword, { color: colors.primary }]}>{content}</Text>;
          case 'number':
            return <Text key={index} style={[styles.number, { color: '#6897BB' }]}>{content}</Text>;
          case 'string':
            return <Text key={index} style={[styles.string, { color: '#A31515' }]}>{content}</Text>;
          default:
            return <Text key={index}>{content}</Text>;
        }
      }
      return <Text key={index} style={{ color: colors.text }}>{part}</Text>;
    });
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.card }]}>
      <Text style={styles.code}>
        {highlight(code)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 14,
    lineHeight: 20,
  },
  keyword: {
    fontWeight: 'bold',
  },
  number: {},
  string: {},
});

export default CodeBlock;