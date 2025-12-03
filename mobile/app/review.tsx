import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { CheckCircle, X, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function ReviewScreen() {
  const router = useRouter();
  const { mistakes, removeMistake, isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'neutral' | 'correct' | 'wrong'>('neutral');
  const [showFeedback, setShowFeedback] = useState(false);

  if (mistakes.length === 0) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}><X size={26} color={theme.text} /></Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Review</Text>
          <View style={{width: 26}} />
        </View>
        <View style={styles.emptyState}>
          <CheckCircle size={60} color={Colors.success} />
          <Text style={[styles.emptyTitle, { color: theme.text }]}>All Caught Up!</Text>
          <Text style={[styles.emptyText, { color: theme.textDim }]}>You have no pending mistakes to review. Great job!</Text>
          <Pressable style={[styles.goBackBtn, { backgroundColor: theme.primary }]} onPress={() => router.back()}>
            <Text style={styles.goBackText}>GO BACK</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentQ = mistakes[qIndex];
  const progress = ((qIndex + 1) / mistakes.length) * 100;

  const handleCheck = () => {
    if (!selected) return;
    if (selected === currentQ.answer) {
      setStatus('correct');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    } else {
      setStatus('wrong');
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    }
    setShowFeedback(true);
  };

  const handleContinue = () => {
    setShowFeedback(false);
    if (status === 'correct') {
      removeMistake(currentQ.q);
      if (mistakes.length <= 1) return; 
      if (qIndex >= mistakes.length - 1) setQIndex(0);
    } else {
      if (qIndex < mistakes.length - 1) setQIndex(qIndex + 1);
      else setQIndex(0);
    }
    setStatus('neutral');
    setSelected(null);
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><X color={theme.textDim} size={28} /></Pressable>
        <View style={[styles.progressBarBg, { backgroundColor: theme.border }]}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={[styles.countText, { color: theme.textDim }]}>{mistakes.length} Left</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.topicLabel}>Mistake Review</Text>
        <Text style={[styles.questionText, { color: theme.text }]}>{currentQ.q}</Text>
        <View style={styles.optionsContainer}>
          {currentQ.options.map((opt, index) => {
            const isSelected = selected === opt;
            const isCorrectState = status === 'correct' && isSelected;
            const isWrongState = status === 'wrong' && isSelected;
            
            let borderColor = theme.border;
            let bgColor = theme.card;
            let textColor = theme.text;

            if (isSelected) { borderColor = theme.primary; bgColor = isDark ? theme.primary + '20' : '#F6F5FF'; textColor = theme.primary; }
            if (isCorrectState) { borderColor = Colors.success; bgColor = isDark ? 'rgba(5, 205, 153, 0.2)' : '#E7FFDB'; textColor = Colors.success; }
            if (isWrongState) { borderColor = Colors.error; bgColor = isDark ? 'rgba(238, 93, 80, 0.2)' : '#FFDFDF'; textColor = Colors.error; }

            return (
              <Pressable
                key={index}
                onPress={() => status === 'neutral' && setSelected(opt)}
                style={[styles.optionBtn, { borderColor, backgroundColor: bgColor }]}
              >
                <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={[styles.footer, { borderTopColor: theme.border }]}>
        <Pressable 
          style={[styles.checkBtn, { backgroundColor: selected ? Colors.success : theme.border }]} 
          onPress={handleCheck} 
          disabled={!selected}
        >
          <Text style={styles.checkBtnText}>CHECK</Text>
        </Pressable>
      </View>

      <Modal visible={showFeedback} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[
            styles.feedbackBox, 
            { backgroundColor: status === 'correct' ? (isDark ? '#022C22' : '#D7FFB8') : (isDark ? '#450A0A' : '#FFDFDF') }
          ]}>
            <View style={styles.feedbackHeader}>
              {status === 'correct' ? <CheckCircle color={Colors.success} size={32} /> : <XCircle color={Colors.error} size={32} />}
              <Text style={[styles.feedbackTitle, { color: status === 'correct' ? Colors.success : Colors.error }]}>
                {status === 'correct' ? 'Correct!' : 'Keep Trying'}
              </Text>
            </View>
            <Text style={[styles.feedbackText, { color: isDark ? 'white' : Colors.text }]}>
              {status === 'correct' ? 'Mistake cleared!' : currentQ.explanation}
            </Text>
            <Pressable 
              style={[styles.continueBtn, { backgroundColor: status === 'correct' ? Colors.success : Colors.error }]} 
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
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 40 : 10, paddingBottom: 10, justifyContent: 'space-between' },
  progressBarBg: { flex: 1, height: 8, borderRadius: 4, marginHorizontal: 16 },
  progressBarFill: { height: '100%', backgroundColor: '#FF9600', borderRadius: 4 },
  countText: { fontSize: 16, fontWeight: '700' },
  body: { flex: 1, padding: 24 },
  topicLabel: { fontSize: 12, fontWeight: '800', color: Colors.error, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  questionText: { fontSize: 22, fontWeight: '800', marginBottom: 24, lineHeight: 30 },
  optionsContainer: { gap: 12 },
  optionBtn: { borderWidth: 2, borderRadius: 16, padding: 18, marginBottom: 4 },
  optionText: { fontSize: 16, fontWeight: '600' },
  footer: { padding: 20, borderTopWidth: 1 },
  checkBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  checkBtnText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.5)' },
  feedbackBox: { padding: 30, borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 250 },
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  feedbackTitle: { fontSize: 24, fontWeight: '800' },
  feedbackText: { fontSize: 16, marginBottom: 30, lineHeight: 24 },
  continueBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  continueText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 24, fontWeight: '800', marginTop: 20, marginBottom: 10 },
  emptyText: { fontSize: 16, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  closeBtn: { padding: 4 },
  goBackBtn: { paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
  goBackText: { color: 'white', fontWeight: '800', fontSize: 16 }
});