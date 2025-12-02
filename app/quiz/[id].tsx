import { useUser } from '@/app/context/UserContext';
import CodeBlock from '@/components/CodeBlock';
import * as quizzes from '@/constants/quizzes';
import { useTheme } from '@react-navigation/native';
import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const QuizScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { colors } = useTheme();
  const { deductHeart, addXp, completeLevel } = useUser();

  const language = 'javascript'; // This can be dynamic in the future
  const allQuizzes = (quizzes as any)[language as keyof typeof quizzes];
  const topicData = (allQuizzes as any).dsa.find((t: any) => t.topic.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-') === id);
  
  const [questions, setQuestions] = useState(topicData?.questions || []);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const handleOptionPress = (option: string) => {
    if (showExplanation) return;

    const correct = option === questions[currentQuestionIndex].answer;
    setSelectedOption(option);
    setIsCorrect(correct);
    setShowExplanation(true);

    if (!correct) {
      deductHeart();
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

  if (questions.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={{ color: colors.text }}>Quiz not found.</Text>
      </View>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

  return (
    <>
      <Stack.Screen options={{ title: topicData?.topic }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={[styles.question, { color: colors.text }]}>{currentQuestion.q}</Text>

        {currentQuestion.q.includes('`') && (
            <CodeBlock code={currentQuestion.q.substring(currentQuestion.q.indexOf('`') + 1, currentQuestion.q.lastIndexOf('`'))} />
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
            <Text style={{ color: colors.text }}>{option}</Text>
          </TouchableOpacity>
        ))}

        {showExplanation && (
          <View style={[styles.explanation, { backgroundColor: colors.border }]}>
            <Text style={{ color: colors.text, fontWeight: 'bold' }}>{isCorrect ? 'Correct!' : 'Not quite...'}</Text>
            <Text style={{ color: colors.text }}>{currentQuestion.explanation}</Text>
            <TouchableOpacity style={[styles.nextButton, { backgroundColor: colors.primary }]} onPress={handleNext}>
              <Text style={{ color: 'white' }}>Next</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  question: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  correct: {
    backgroundColor: '#4CAF50', // Green
    borderColor: '#4CAF50',
    borderWidth: 2,
  },
  incorrect: {
    backgroundColor: '#F44336', // Red
    borderColor: '#F44336',
    borderWidth: 2,
  },
  explanation: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
  },
  nextButton: {
    marginTop: 10,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default QuizScreen;