import { Header } from '@/components/Header'; // Import new Header component
import { Colors } from '@/constants/Colors';
import { quizzes } from '@/constants/quizzes'; // Import the consolidated data source
import { slugify } from '@/utils/slugify';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native'; // Still needed for the fallback header
import React from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- REMOVED: Deleted manual LEVEL_DATA object construction ---

const language = 'javascript'; 

export default function LearnScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  const topicKey = String(id);
  
  // Correctly fetch topicData from the consolidated quiz structure
  const topicData = (quizzes[language as keyof typeof quizzes]?.dsa ?? []).find((t: any) => slugify(t.topic) === topicKey);
  const theoryContent = topicData?.theory; // Get theory, which is now consistently available/optional

  // 1. Safety Check: If topic doesn't exist
  if (!topicData) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Fallback Header (simplified, as Header component needs theme context which might fail here) */}
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

  const hasTheory = theoryContent && theoryContent.length > 0;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header: Replaced the manual header with the reusable component */}
      <Header title={topicData.topic} />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {hasTheory ? (
          theoryContent.map((item: {title: string, description: string}, index: number) => (
            <View key={index} style={styles.card}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDesc}>{item.description}</Text>
            </View>
          ))
        ) : (
           <View style={styles.card}>
              <Text style={styles.cardTitle}>Introduction</Text>
              <Text style={styles.cardDesc}>
                Welcome to the {topicData.topic} module. There are no detailed theory notes for this module, but you can jump straight into the quiz!
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
  // --- Removed manual header, backBtn, headerTitle styles as they are now handled by <Header> ---
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
    backgroundColor: Colors.primary, 
    height: 56,
    borderRadius: 16, 
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10 
  },
  quizBtnText: { color: 'white', fontSize: 16, fontWeight: '800' }
});