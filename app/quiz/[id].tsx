import { useUser } from '@/app/context/UserContext';
import CodeBlock from '@/components/CodeBlock';
import { quizzes } from '@/constants/quizzes';
import { slugify } from '@/utils/slugify';
import { useTheme } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QuizScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { deductHeart, addXp, completeLevel, hearts } = useUser(); // Make sure to destructure 'hearts'

  // 1. Logic Change: ADDED Heart Check
  useEffect(() => {
    if (hearts <= 0) {
      router.replace('/game-over');
    }
  }, [hearts]);

  const language = 'javascript'; 
  const allQuizzes = quizzes[language as keyof typeof quizzes];
  const topicData = (allQuizzes as any)?.dsa?.find((t: any) => slugify(t.topic) === id);
  
  // Safety check for topic
  if (!topicData) {
    return (
      <View style={styles.centered}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Topic not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={{color: 'white'}}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const [questions] = useState(topicData.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  // Safety check for questions
  if (questions.length === 0) {
    return <View style={styles.centered}><Text>No questions available.</Text></View>;
  }

  const handleOptionPress = (option: string) => {
    if (showExplanation) return;
    const correct = option === questions[currentQuestionIndex].answer;
    setSelectedOption(option);
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (!correct) {
        deductHeart();
        // The useEffect above will handle the redirect if hearts drop to 0
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
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Stack.Screen options={{ title: topicData.topic, headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
            <View style={[styles.progressBarFill, {width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`, backgroundColor: colors.primary}]} />
        </View>

        <Text style={[styles.question, { color: colors.text }]}>{currentQuestion.q}</Text>

        {currentQuestion.q.includes('`') && (
            <CodeBlock code={currentQuestion.q.split('`')[1]} />
        )}

        {currentQuestion.options.map((option: string) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              { backgroundColor: colors.card },
              selectedOption === option && (isCorrect ? styles.correct : styles.incorrect),
            ]}
            onPress={() => handleOptionPress(option)}
            disabled={showExplanation}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>{option}</Text>
          </TouchableOpacity>
        ))}

        {showExplanation && (
          <View style={[styles.explanation, { backgroundColor: '#F6F5FF' }]}>
            <Text style={{ color: isCorrect ? '#4CAF50' : '#F44336', fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
                {isCorrect ? 'Correct!' : 'Incorrect'}
            </Text>
            <Text style={{ color: colors.text, lineHeight: 22 }}>{currentQuestion.explanation}</Text>
            <TouchableOpacity style={[styles.nextButton, { backgroundColor: colors.primary }]} onPress={handleNext}>
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
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 20, paddingBottom: 50 },
  progressBarBg: { height: 8, backgroundColor: '#E0E0E0', borderRadius: 5, marginBottom: 24, width: '100%' },
  progressBarFill: { height: '100%', borderRadius: 5 },
  question: { fontSize: 22, fontWeight: '700', textAlign: 'left', marginBottom: 24, lineHeight: 30 },
  option: { padding: 20, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#EEE' },
  optionText: { fontSize: 16, fontWeight: '500' },
  correct: { backgroundColor: '#E7FFDB', borderColor: '#4CAF50' },
  incorrect: { backgroundColor: '#FFDFDF', borderColor: '#F44336' },
  explanation: { marginTop: 24, padding: 20, borderRadius: 16, backgroundColor: '#F8F9FA' },
  nextButton: { marginTop: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
  backBtn: { marginTop: 20, padding: 12, backgroundColor: '#333', borderRadius: 8 }
});

export default QuizScreen;