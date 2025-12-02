import { Colors } from '@/constants/Colors';
import { quizData } from '@/constants/dsa-quiz-data';
import { slugify } from '@/utils/slugify';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LEVEL_DATA = quizData.reduce((acc, module) => {
  const slug = slugify(module.topic);
  acc[slug] = {
    title: module.topic,
    theory: (module as any).theory || [], 
  };
  return acc;
}, {} as Record<string, { title: string; theory: any[] }>);

export default function LearnScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // REMOVED the line causing error: const { colors } = useUser();
  // We use the imported 'Colors' constant directly in the styles below.

  const topicKey = String(id);
  const topicData = LEVEL_DATA[topicKey];

  // 1. Safety Check: If topic doesn't exist
  if (!topicData) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
                <ChevronLeft size={24} color={Colors.text} />
            </TouchableOpacity>
        </View>
        <View style={styles.centerContent}>
            <Text style={styles.errorText}>Topic not found.</Text>
            <TouchableOpacity style={styles.btnPrimary} onPress={() => router.back()}>
                <Text style={styles.btnText}>Go Back</Text>
            </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{topicData.title}</Text>
        <View style={{ width: 40 }} /> 
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {topicData.theory && topicData.theory.length > 0 ? (
          topicData.theory.map((item, index) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          ))
        ) : (
           <View style={styles.card}>
              <Text style={styles.cardTitle}>Introduction</Text>
              <Text style={styles.cardDesc}>
                Welcome to the {topicData.title} module. Here you will learn the fundamental concepts before testing your knowledge in the quiz.
              </Text>
           </View>
        )}

        <TouchableOpacity 
            style={styles.quizBtn} 
            onPress={() => router.replace({ pathname: '/quiz/[id]', params: { id: topicKey } })}
        >
            <Text style={styles.quizBtnText}>Ready for the Quiz?</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FA' },
  header: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', 
    paddingHorizontal: 20, paddingTop: 10, paddingBottom: 10, backgroundColor: 'white'
  },
  backBtn: { padding: 8, borderRadius: 8, backgroundColor: '#F0F0F0' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, flex: 1, textAlign: 'center' },
  scrollContent: { padding: 20, paddingBottom: 50 },
  card: { 
    backgroundColor: 'white', padding: 20, borderRadius: 16, marginBottom: 16,
    shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 10, shadowOffset: { width: 0, height: 4 }
  },
  cardTitle: { fontSize: 18, fontWeight: '700', color: Colors.primary, marginBottom: 8 },
  cardDesc: { fontSize: 16, color: Colors.text, lineHeight: 24 },
  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText: { fontSize: 18, color: Colors.textDim, marginBottom: 20 },
  btnPrimary: { backgroundColor: Colors.primary, paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12 },
  btnText: { color: 'white', fontWeight: '700' },
  quizBtn: { 
    backgroundColor: Colors.primary, padding: 18, borderRadius: 16, 
    alignItems: 'center', marginTop: 10 
  },
  quizBtnText: { color: 'white', fontSize: 16, fontWeight: '800' }
});