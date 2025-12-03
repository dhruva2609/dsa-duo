import { useUser } from '@/app/context/UserContext';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { quizzes } from '@/constants/quizzes';
import { slugify } from '@/utils/slugify';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function LearnScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;
  
  const topicKey = String(id);
  const language = 'javascript'; 
  
  // Safe data access
  const allQuizzes = quizzes[language as keyof typeof quizzes];
  const topicData = (allQuizzes as any)?.dsa?.find((t: any) => slugify(t.topic) === topicKey);

  if (!topicData) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <Header title="Error" />
        <View style={styles.centerContent}>
            <Text style={[styles.errorText, { color: theme.textDim }]}>Topic not found.</Text>
            <TouchableOpacity style={[styles.btnPrimary, { backgroundColor: theme.primary }]} onPress={() => router.back()}>
                <Text style={styles.btnText}>Go Back</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const theoryContent = topicData.theory || [];
  const hasTheory = theoryContent.length > 0;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <Header title={topicData.topic} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {hasTheory ? (
          theoryContent.map((item: {title: string, description: string}, index: number) => (
            <View key={index} style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
              <Text style={[styles.cardTitle, { color: theme.primary }]}>{item.title}</Text>
              <Text style={[styles.cardDesc, { color: theme.text }]}>{item.description}</Text>
            </View>
          ))
        ) : (
           <View style={[styles.card, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
              <Text style={[styles.cardTitle, { color: theme.primary }]}>Introduction</Text>
              <Text style={[styles.cardDesc, { color: theme.text }]}>
                Welcome to the {topicData.topic} module. There are no detailed theory notes for this module, but you can jump straight into the quiz!
              </Text>
           </View>
        )}

        <TouchableOpacity 
            style={[styles.quizBtn, { backgroundColor: theme.primary, shadowColor: theme.primary }]} 
            onPress={() => router.replace({ pathname: '/quiz/[id]', params: { id: topicKey } })}
        >
            <Text style={styles.quizBtnText}>Ready for the Quiz?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 50 },
  card: { 
    padding: 20, borderRadius: 16, marginBottom: 16,
    shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }, elevation: 3
  },
  cardTitle: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
  cardDesc: { fontSize: 16, lineHeight: 24 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, marginBottom: 20 },
  btnPrimary: { paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: 'white', fontWeight: '700' },
  quizBtn: { 
    height: 56,
    borderRadius: 16, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
    shadowOpacity: 0.3, shadowRadius: 8, elevation: 5
  },
  quizBtnText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 1 }
});