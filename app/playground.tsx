import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ChevronLeft, Play, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

export default function PlaygroundScreen() {
  const router = useRouter();
  const { isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;

  // Default code snippet
  const [code, setCode] = useState(`// Write JavaScript here\n\nconst a = 10;\nconst b = 20;\n\nconsole.log("Result: " + (a + b));`);
  const [output, setOutput] = useState('Output will appear here...');

  const runCode = () => {
    try {
      let logs: string[] = [];
      const mockConsole = {
        log: (...args: any[]) => {
          logs.push(args.join(' '));
        }
      };
      
      // Execute code safely-ish
      const run = new Function('console', code);
      run(mockConsole);
      
      setOutput(logs.length > 0 ? logs.join('\n') : 'Code ran successfully (No output).');
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        {/* Header */}
        <View style={[styles.header, { borderBottomColor: theme.border }]}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <ChevronLeft size={24} color={theme.text} />
          </Pressable>
          <Text style={[styles.title, { color: theme.text }]}>JS Playground</Text>
          <Pressable onPress={() => setCode('')} style={styles.iconBtn}>
            <Trash2 size={22} color={theme.error} />
          </Pressable>
        </View>

        {/* Editor Area */}
        <View style={[styles.editorContainer, { backgroundColor: theme.codeBg }]}>
          <TextInput 
            style={[styles.editor, { color: isDark ? '#D4D4D4' : '#333333' }]} 
            multiline 
            autoCapitalize="none"
            autoCorrect={false}
            value={code}
            onChangeText={setCode}
            textAlignVertical="top"
            placeholder="// Start typing..."
            placeholderTextColor={theme.textDim}
          />
        </View>

        {/* Output Console */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={[styles.consoleContainer, { backgroundColor: isDark ? '#1E1E1E' : '#F8F9FA', borderTopColor: theme.border }]}>
            <View style={[styles.consoleHeader, { backgroundColor: isDark ? '#252526' : '#E0E5F2' }]}>
              <Text style={[styles.consoleLabel, { color: theme.textDim }]}>CONSOLE</Text>
              <Pressable style={[styles.runBtn, { backgroundColor: Colors.success }]} onPress={runCode}>
                <Play size={14} color="white" fill="white" />
                <Text style={styles.runText}>RUN</Text>
              </Pressable>
            </View>
            <View style={styles.outputBox}>
              <Text style={[styles.outputText, { color: isDark ? '#4EC9B0' : '#05CD99' }]}>{output}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1 },
  title: { fontWeight: '700', fontSize: 16 },
  iconBtn: { padding: 8 },
  editorContainer: { flex: 1, padding: 16 },
  editor: { flex: 1, fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 14, lineHeight: 22 },
  consoleContainer: { height: 200, borderTopWidth: 1 },
  consoleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8 },
  consoleLabel: { fontSize: 12, fontWeight: '700' },
  runBtn: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, gap: 6 },
  runText: { color: 'white', fontSize: 12, fontWeight: '800' },
  outputBox: { flex: 1, padding: 16 },
  outputText: { fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 13 }
});