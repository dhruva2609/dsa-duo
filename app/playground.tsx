import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { ChevronLeft, Play, Trash2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, TextInput, TouchableWithoutFeedback, View } from 'react-native';

export default function PlaygroundScreen() {
  const router = useRouter();
  const [code, setCode] = useState(`// Write JavaScript here\n\nconst a = 10;\nconst b = 20;\n\nconsole.log("Result: " + (a + b));`);
  const [output, setOutput] = useState('Output will appear here...');

  const runCode = () => {
    try {
      let logs: string[] = [];
      // Mock console.log to capture output
      const mockConsole = {
        log: (...args: any[]) => {
          logs.push(args.join(' '));
        }
      };
      
      // Execute code safely-ish
      // Note: direct eval is risky in production apps, but fine for a local playground
      const run = new Function('console', code);
      run(mockConsole);
      
      setOutput(logs.length > 0 ? logs.join('\n') : 'Code ran successfully (No output).');
    } catch (error: any) {
      setOutput(`Error: ${error.message}`);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{flex: 1}}>
        {/* Header */}
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.iconBtn}>
            <ChevronLeft size={24} color="#A0A0A0" />
          </Pressable>
          <Text style={styles.title}>JS Playground</Text>
          <Pressable onPress={() => setCode('')} style={styles.iconBtn}>
            <Trash2 size={22} color="#A0A0A0" />
          </Pressable>
        </View>

        {/* Editor */}
        <View style={styles.editorContainer}>
          <TextInput 
            style={styles.editor} 
            multiline 
            autoCapitalize="none"
            autoCorrect={false}
            value={code}
            onChangeText={setCode}
            textAlignVertical="top"
          />
        </View>

        {/* Output Console */}
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.consoleContainer}>
            <View style={styles.consoleHeader}>
              <Text style={styles.consoleLabel}>CONSOLE</Text>
              <Pressable style={styles.runBtn} onPress={runCode}>
                <Play size={16} color="white" fill="white" />
                <Text style={styles.runText}>RUN</Text>
              </Pressable>
            </View>
            <View style={styles.outputBox}>
              <Text style={styles.outputText}>{output}</Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1E1E1E' }, // Dark Theme
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  title: { color: 'white', fontWeight: '700', fontSize: 16 },
  iconBtn: { padding: 8 },
  editorContainer: { flex: 1, padding: 16 },
  editor: { flex: 1, color: '#D4D4D4', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 14, lineHeight: 20 },
  consoleContainer: { height: 200, backgroundColor: '#252526', borderTopWidth: 1, borderTopColor: '#333' },
  consoleHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, backgroundColor: '#333' },
  consoleLabel: { color: '#A0A0A0', fontSize: 12, fontWeight: '700' },
  runBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.success, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 4, gap: 6 },
  runText: { color: 'white', fontSize: 12, fontWeight: '800' },
  outputBox: { flex: 1, padding: 16 },
  outputText: { color: '#4EC9B0', fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace', fontSize: 13 }
});