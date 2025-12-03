import { useUser } from '@/app/context/UserContext';
import CodeBlock from '@/components/CodeBlock';
import { Colors } from '@/constants/Colors';
import { quizzes } from '@/constants/quizzes';
import { slugify } from '@/utils/slugify';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QuizScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { deductHeart, addXp, completeLevel, hearts, addMistake, isDark } = useUser(); 
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    if (hearts <= 0) {
      router.replace('/game-over');
    }
  }, [hearts, router]);

  const language = 'javascript'; 
  const topicData = (quizzes[language as keyof typeof quizzes]?.dsa ?? []).find((t: any) => slugify(t.topic) === id);
  
  if (!topicData) return null;

  const [questions] = useState(topicData.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionPress = (option: string) => {
    if (showExplanation) return;
    const currentQuestion = questions[currentQuestionIndex];
    const correct = option === currentQuestion.answer;
    setSelectedOption(option);
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (!correct) {
        deductHeart();
        addMistake({
          q: currentQuestion.q,
          options: currentQuestion.options,
          answer: currentQuestion.answer,
          explanation: currentQuestion.explanation,
        });
    } else {
        addXp(10);
    }
  };

  const handleNext = () => {
    setShowExplanation(false);
    setSelectedOption(null);
    setIsCorrect(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeLevel(id as string);
      router.replace('/quiz/success');
    }
  };

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Stack.Screen options={{ headerShown: false }} />
      
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.border }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <ChevronLeft size={24} color={theme.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.text }]}>{topicData.topic}</Text>
        <View style={{width: 24}} /> 
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Progress */}
        <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
          <View style={[styles.progressBarFill, { width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`, backgroundColor: theme.primary }]} />
        </View>

        <Text style={[styles.question, { color: theme.text }]}>{currentQuestion.q}</Text>

        {currentQuestion.q.includes('`') && (
            <CodeBlock code={currentQuestion.q.split('`')[1]} />
        )}

        {currentQuestion.options.map((option: string) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              { backgroundColor: theme.card, borderColor: theme.border }, 
              selectedOption === option && (isCorrect ? styles.correct : styles.incorrect),
            ]}
            onPress={() => handleOptionPress(option)}
            disabled={showExplanation}
          >
            <Text 
              style={[
                styles.optionText, 
                { color: theme.text },
                selectedOption === option && isCorrect !== null && { color: isCorrect ? '#006400' : '#8B0000' }
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}

        {showExplanation && (
          <View style={[styles.explanation, { backgroundColor: isCorrect ? (isDark ? 'rgba(5, 205, 153, 0.15)' : 'rgba(5, 205, 153, 0.15)') : (isDark ? 'rgba(238, 93, 80, 0.15)' : 'rgba(238, 93, 80, 0.15)') }]}>
            <Text style={{ color: isCorrect ? Colors.success : Colors.error, fontWeight: '800', fontSize: 18, marginBottom: 8 }}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
            </Text>
            <Text style={{ color: theme.text, lineHeight: 22 }}>{currentQuestion.explanation}</Text>
            <TouchableOpacity style={[styles.nextButton, { backgroundColor: theme.primary }]} onPress={handleNext}>
              <Text style={{ color: 'white', fontWeight: 'bold' }}>
                {currentQuestionIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
              </Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 20, paddingTop: 10, borderBottomWidth: 1 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', flex: 1, textAlign: 'center' },
  content: { padding: 20, paddingBottom: 50 },
  progressBarBg: { height: 8, borderRadius: 5, marginBottom: 24, width: '100%' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  question: { fontSize: 22, fontWeight: '700', textAlign: 'left', marginBottom: 24, lineHeight: 30 },
  option: { padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1 },
  optionText: { fontSize: 16, fontWeight: '600' },
  correct: { backgroundColor: 'rgba(5, 205, 153, 0.2)', borderColor: Colors.success }, 
  incorrect: { backgroundColor: 'rgba(238, 93, 80, 0.2)', borderColor: Colors.error },
  explanation: { marginTop: 24, padding: 20, borderRadius: 16 },
  nextButton: { marginTop: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
});

export default QuizScreen;