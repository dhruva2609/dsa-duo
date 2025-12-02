import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { quizData } from '@/constants/dsa-quiz-data';
import * as Haptics from 'expo-haptics';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { CheckCircle, Heart, X, XCircle } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
// Added Platform to imports below
import { Modal, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

const slugify = (text: string) => {
  return text.toString().toLowerCase().replace(/\s+/g, '-').replace(/[^\w\-]+/g, '').replace(/-+$/, '');
};

// Flatten quiz data for easier access
const LEVEL_DATA = quizData.reduce((acc, module) => {
  const slug = slugify(module.topic);
  acc[slug] = {
    title: module.topic,
    color: '#3F20F0',
    questions: module.questions
  };
  return acc;
}, {} as Record<string, { title: string; color: string; questions: any[] }>);

export default function DynamicQuizScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const { hearts, deductHeart, addMistake, addXp, completeLevel, unlockAchievement, xp } = useUser();

  const topicKey = String(id || 'core-concepts-complexity');
  const topicData = LEVEL_DATA[topicKey] || LEVEL_DATA['core-concepts-complexity'];
  const questions = topicData.questions;

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'neutral' | 'correct' | 'wrong'>('neutral');
  const [showFeedback, setShowFeedback] = useState(false);

  const currentQ = questions[qIndex];
  const progress = ((qIndex + 1) / questions.length) * 100;

  useEffect(() => {
    if (hearts <= 0) {
      router.replace('/game-over');
    }
  }, [hearts]);

  const handleCheck = () => {
    if (!selected) return;

    if (selected === currentQ.answer) {
      setStatus('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setStatus('wrong');
      deductHeart();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      
      // Feature: Add to Review List
      addMistake({
        q: currentQ.q,
        options: currentQ.options,
        answer: currentQ.answer,
        explanation: currentQ.explanation
      });
    }
    setShowFeedback(true);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    setStatus('neutral');
    setSelected(null);
    if (qIndex < questions.length - 1) {
      setQIndex(qIndex + 1);
    } else {
      // Quiz Completed Logic
      completeLevel(topicKey);
      addXp(20);
      
      // Feature: Check Achievements
      if (xp + 20 >= 100) unlockAchievement('novice_coder');
      unlockAchievement('first_win'); // Simple achievement for finishing any quiz

      router.replace('/quiz/success');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable onPress={() => router.back()} hitSlop={20}>
          <X color={Colors.textDim} size={28} />
        </Pressable>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <View style={styles.livesContainer}>
          <Heart color={Colors.error} fill={Colors.error} size={24} />
          <Text style={styles.livesText}>{hearts}</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.topicLabel}>{topicData.title}</Text>
        <Text style={styles.questionText}>{currentQ.q}</Text>

        <View style={styles.optionsContainer}>
          {currentQ.options.map((opt: string, index: number) => {
            const isSelected = selected === opt;
            const isCorrectState = status === 'correct' && isSelected;
            const isWrongState = status === 'wrong' && isSelected;

            let borderColor = '#E5E5E5';
            let bgColor = 'white';

            if (isSelected) {
               borderColor = Colors.primary;
               bgColor = '#F6F5FF';
            }
            if (isCorrectState) {
               borderColor = Colors.success;
               bgColor = '#E7FFDB';
            }
            if (isWrongState) {
               borderColor = Colors.error;
               bgColor = '#FFDFDF';
            }

            return (
              <Pressable
                key={index}
                onPress={() => status === 'neutral' && setSelected(opt)}
                style={[
                  styles.optionBtn,
                  { borderColor, backgroundColor: bgColor }
                ]}
              >
                <Text style={[
                  styles.optionText,
                  isSelected && { color: Colors.primaryDark },
                  isCorrectState && { color: Colors.successDark },
                  isWrongState && { color: Colors.errorDark }
                ]}>
                  {opt}
                </Text>
                <View style={[
                   styles.optionEdge,
                   isSelected && { backgroundColor: Colors.primary },
                   isCorrectState && { backgroundColor: Colors.success },
                   isWrongState && { backgroundColor: Colors.error }
                ]} />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable
          style={[styles.checkBtn, !selected && styles.checkBtnDisabled]}
          onPress={handleCheck}
          disabled={!selected}
        >
          <Text style={styles.checkBtnText}>CHECK</Text>
        </Pressable>
      </View>

      <Modal visible={showFeedback} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.feedbackBox, status === 'wrong' ? styles.feedbackWrong : styles.feedbackCorrect]}>
            <View style={styles.feedbackHeader}>
              {status === 'correct' ? <CheckCircle color={Colors.successDark} size={32} /> : <XCircle color={Colors.errorDark} size={32} />}
              <Text style={[styles.feedbackTitle, status === 'correct' ? {color: Colors.successDark} : {color: Colors.errorDark}]}>
                {status === 'correct' ? 'Awesome!' : 'Incorrect'}
              </Text>
            </View>

            <Text style={styles.feedbackText}>
              {status === 'wrong' && <Text style={{fontWeight: 'bold'}}>Answer: {currentQ.answer}{'\n'}</Text>}
              {currentQ.explanation}
            </Text>

            <Pressable
              style={[styles.continueBtn, status === 'wrong' ? {backgroundColor: Colors.error} : {backgroundColor: Colors.success}]}
              onPress={handleContinue}
            >
              <Text style={styles.continueText}>CONTINUE</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: 'white' },
  header: {
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20,
    paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 10,
    justifyContent: 'space-between'
  },
  progressBarBg: { flex: 1, height: 12, backgroundColor: '#F0F0F0', borderRadius: 6, marginHorizontal: 16 },
  progressBarFill: { height: '100%', backgroundColor: Colors.success, borderRadius: 6 },
  livesContainer: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  livesText: { color: Colors.error, fontWeight: '800', fontSize: 16 },
  body: { flex: 1, padding: 24 },
  topicLabel: { fontSize: 12, fontWeight: '800', color: Colors.textDim, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  questionText: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 24, lineHeight: 32 },
  optionsContainer: { gap: 14 },
  optionBtn: {
    backgroundColor: 'white', borderWidth: 2, borderColor: '#E5E5E5',
    borderRadius: 16, padding: 18, position: 'relative', marginBottom: 4
  },
  optionText: { fontSize: 17, color: Colors.text, fontWeight: '600' },
  optionEdge: {
    position: 'absolute', bottom: -6, left: -2, right: -2, height: 6,
    backgroundColor: '#E5E5E5', borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: -1
  },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#F5F5F5' },
  checkBtn: {
    backgroundColor: Colors.success, height: 56, borderRadius: 16,
    justifyContent: 'center', alignItems: 'center',
    shadowColor: Colors.success, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: {width: 0, height: 4}
  },
  checkBtnDisabled: { backgroundColor: '#E5E5E5', shadowOpacity: 0 },
  checkBtnText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  feedbackBox: { padding: 30, borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 250 },
  feedbackCorrect: { backgroundColor: '#D7FFB8' },
  feedbackWrong: { backgroundColor: '#FFDFDF' },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  feedbackTitle: { fontSize: 24, fontWeight: '800' },
  feedbackText: { fontSize: 16, color: Colors.text, marginBottom: 30, lineHeight: 24 },
  continueBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  continueText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
});