import { useUser } from '@/app/context/UserContext';
import CodeBlock from '@/components/CodeBlock';
import { Colors } from '@/constants/Colors'; // Explicitly import Colors for functional colors
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
  // Include addMistake to log wrong answers
  const { deductHeart, addXp, completeLevel, hearts, addMistake } = useUser(); 

  // 1. Logic Change: ADDED Heart Check
  useEffect(() => {
    if (hearts <= 0) {
      router.replace('/game-over');
    }
  }, [hearts, router]); // Added router to dependencies

  const language = 'javascript'; 
  const allQuizzes = quizzes[language as keyof typeof quizzes];
  // Access data from the consolidated source
  const topicData = (allQuizzes as any)?.dsa?.find((t: any) => slugify(t.topic) === id);
  
  // Safety check for topic
  if (!topicData) {
    return (
      <View style={[styles.centered, { backgroundColor: colors.background }]}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Topic not found.</Text>
        <TouchableOpacity onPress={() => router.back()} style={[styles.backBtn, { backgroundColor: Colors.primary }]}>
          <Text style={{color: 'white', fontWeight: 'bold'}}>Go Back</Text>
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
    return <View style={[styles.centered, { backgroundColor: colors.background }]}><Text style={{ color: colors.text }}>No questions available.</Text></View>;
  }

  const handleOptionPress = (option: string) => {
    if (showExplanation) return;
    const currentQuestion = questions[currentQuestionIndex];
    const correct = option === currentQuestion.answer;
    setSelectedOption(option);
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (!correct) {
        deductHeart();
        // Add mistake to list for review screen
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
    <SafeAreaView style={{flex: 1, backgroundColor: colors.background}}>
      <Stack.Screen options={{ title: topicData.topic, headerBackTitle: 'Back' }} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* Progress Bar */}
        <View style={styles.progressBarBg}>
          {/* Use primary color from theme colors */}
          <View style={[styles.progressBarFill, {width: `${((currentQuestionIndex + 1) / questions.length) * 100}%`, backgroundColor: colors.primary}]} />
        </View>

        <Text style={[styles.question, { color: colors.text }]}>{currentQuestion.q}</Text>

        {/* Check for code block content using backticks */}
        {currentQuestion.q.includes('`') && (
            <CodeBlock code={currentQuestion.q.split('`')[1]} />
        )}

        {currentQuestion.options.map((option: string) => (
          <TouchableOpacity
            key={option}
            style={[
              styles.option,
              { backgroundColor: colors.card, borderColor: colors.border }, 
              // Apply specific colors only when selected and in explanation phase
              selectedOption === option && (isCorrect ? styles.correct : styles.incorrect),
            ]}
            onPress={() => handleOptionPress(option)}
            disabled={showExplanation}
          >
            <Text 
              style={[
                styles.optionText, 
                { color: colors.text },
                // Apply specific text color for feedback
                selectedOption === option && isCorrect !== null && { 
                  color: isCorrect ? Colors.successDark : Colors.errorDark 
                }
              ]}
            >
              {option}
            </Text>
          </TouchableOpacity>
        ))}

        {showExplanation && (
          <View 
            style={[
              styles.explanation, 
              // FIX: Use brand colors for a more cohesive UI response
              { backgroundColor: isCorrect ? Colors.success + '15' : Colors.error + '15' } 
            ]}
          >
            <Text style={{ color: isCorrect ? Colors.successDark : Colors.errorDark, fontWeight: 'bold', fontSize: 18, marginBottom: 8 }}>
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
  option: { 
    padding: 20, 
    borderRadius: 16, 
    marginBottom: 12, 
    borderWidth: 2, 
    // Default border/background colors are set in JSX using theme
  },
  optionText: { fontSize: 16, fontWeight: '500' },
  // Use Colors from constants for uniform brand feedback styling
  correct: { backgroundColor: Colors.success + '15', borderColor: Colors.success }, 
  incorrect: { backgroundColor: Colors.error + '15', borderColor: Colors.error },
  explanation: { marginTop: 24, padding: 20, borderRadius: 16 },
  nextButton: { 
    marginTop: 20, 
    padding: 16, 
    borderRadius: 12, 
    alignItems: 'center', 
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  // Styled the fallback button for consistency
  backBtn: { 
    marginTop: 20, 
    paddingHorizontal: 24,
    paddingVertical: 12, 
    borderRadius: 12,
    alignItems: 'center',
  }
});

export default QuizScreen;