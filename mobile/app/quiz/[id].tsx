import { useUser } from '@/app/context/UserContext';
import CodeBlock from '@/components/CodeBlock';
import { Colors } from '@/constants/Colors';
import { slugify } from '@/utils/slugify';
import { LinearGradient } from 'expo-linear-gradient';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, Info } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const OptionCard = ({ option, isSelected, isCorrect, isWrong, theme, onPress, disabled }: any) => {
  const scale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    borderColor: isCorrect ? Colors.success : isWrong ? Colors.error : isSelected ? theme.primary : theme.border,
    borderWidth: isSelected ? 2 : 1,
  }));

  const handlePressIn = () => {
    if (disabled) return;
    scale.value = withSpring(0.95);
  };

  const handlePressOut = () => {
    if (disabled) return;
    scale.value = withSpring(1);
  };

  return (
    <Pressable 
      onPress={onPress} 
      onPressIn={handlePressIn} 
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Animated.View style={[styles.optionCard, animatedStyle, { backgroundColor: isSelected ? 'rgba(139, 92, 246, 0.1)' : 'rgba(255,255,255,0.05)' }]}>
        <Text style={[styles.optionText, { color: isSelected ? theme.primary : theme.text }]}>
          {option}
        </Text>
      </Animated.View>
    </Pressable>
  );
};

const QuizScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { deductHeart, addXp, completeLevel, hearts, addMistake, isDark, token } = useUser(); 
  const theme = isDark ? Colors.dark : Colors.light;

  const [topicData, setTopicData] = useState<any>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (hearts <= 0) {
      router.replace('/game-over');
    }
  }, [hearts, router]);

  useEffect(() => {
    fetchQuiz();
  }, [id]);

  const fetchQuiz = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz/${id}`);
      const data = await response.json();
      if (response.ok) {
        setTopicData(data);
        // Questions from backend have 'text' instead of 'q' and 'correctAnswer' instead of 'answer'
        const normalizedQuestions = data.questions.map((q: any) => ({
          q: q.text,
          options: q.options,
          answer: q.correctAnswer,
          explanation: q.explanation,
          codeSnippet: q.codeSnippet
        }));
        setQuestions(normalizedQuestions);
      }
    } catch (error) {
      console.error('Failed to fetch quiz', error);
    } finally {
      setLoading(false);
    }
  };
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [sessionMistakes, setSessionMistakes] = useState<any[]>([]);

  if (loading) return <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ color: theme.text }}>Loading Quiz...</Text></View>;
  if (!topicData) return <View style={[styles.container, { backgroundColor: theme.background, justifyContent: 'center', alignItems: 'center' }]}><Text style={{ color: theme.text }}>Quiz not found</Text></View>;


  const handleOptionPress = (option: string) => {
    if (showExplanation) return;
    const currentQuestion = questions[currentQuestionIndex];
    const correct = option === currentQuestion.answer;
    setSelectedOption(option);
    setIsCorrect(correct);
    setShowExplanation(true);
    
    if (!correct) {
        deductHeart();
        const mistakeData = {
          q: currentQuestion.q,
          options: currentQuestion.options,
          answer: currentQuestion.answer,
          explanation: currentQuestion.explanation,
        };
        addMistake(mistakeData);
        setSessionMistakes(prev => [...prev, mistakeData]);
    } else {
        setCorrectCount(prev => prev + 1);
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
      const score = correctCount / questions.length;
      if (score >= 0.8) {
        completeLevel(id as string);
      }
      router.replace({ 
        pathname: '/quiz/success', 
        params: { 
          score: (score * 100).toFixed(0),
          mistakes: JSON.stringify(sessionMistakes) 
        } 
      });
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

        {currentQuestion.options.map((option: string) => {
          const isSelected = selectedOption === option;
          const isCorrectAnswer = isSelected && isCorrect;
          const isWrongAnswer = isSelected && !isCorrect;

          return (
            <OptionCard
              key={option}
              option={option}
              isSelected={isSelected}
              isCorrect={isCorrectAnswer}
              isWrong={isWrongAnswer}
              theme={theme}
              onPress={() => handleOptionPress(option)}
              disabled={showExplanation}
            />
          );
        })}


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
  question: { fontSize: 24, fontWeight: '800', textAlign: 'left', marginBottom: 24, lineHeight: 32 },
  optionCard: { padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 },
  optionText: { fontSize: 16, fontWeight: '700' },
  correct: { backgroundColor: 'rgba(5, 205, 153, 0.2)', borderColor: Colors.success }, 
  incorrect: { backgroundColor: 'rgba(238, 93, 80, 0.2)', borderColor: Colors.error },
  explanation: { marginTop: 24, padding: 20, borderRadius: 16 },
  nextButton: { marginTop: 20, padding: 16, borderRadius: 12, alignItems: 'center' },
});

export default QuizScreen;