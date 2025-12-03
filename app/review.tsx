import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { useRouter } from 'expo-router';
import { CheckCircle, X, XCircle } from 'lucide-react-native';
import React, { useState } from 'react';
import { Modal, Platform, Pressable, SafeAreaView, StatusBar, StyleSheet, Text, View } from 'react-native';

export default function ReviewScreen() {
  const router = useRouter();
  // Ensure 'mistakes' is the source of truth for length
  const { mistakes, removeMistake } = useUser(); 

  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [status, setStatus] = useState<'neutral' | 'correct' | 'wrong'>('neutral');
  const [showFeedback, setShowFeedback] = useState(false);

  // Handle empty state - must be first
  if (mistakes.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.closeBtn}><X size={26} color={Colors.text} /></Pressable>
          <Text style={styles.headerTitle}>Review</Text>
          <View style={{width: 26}} />
        </View>
        <View style={styles.emptyState}>
          <CheckCircle size={60} color={Colors.success} />
          <Text style={styles.emptyTitle}>All Caught Up!</Text>
          <Text style={styles.emptyText}>You have no pending mistakes to review. Great job keeping your knowledge sharp!</Text>
          <Pressable style={styles.goBackBtn} onPress={() => router.back()}>
            <Text style={styles.goBackText}>GO BACK</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  const currentQ = mistakes[qIndex];
  // Calculate progress based on remaining mistakes
  const progress = ((mistakes.length - qIndex) / mistakes.length) * 100;

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
      // 🐛 FIX: Remove the item. We rely on the state update (mistakes array shrinking)
      // to determine the next question index in the render cycle.
      removeMistake(currentQ.q);
      
      // Since an item was removed, if we were at the last item (length N-1), 
      // the new length is N-1. If qIndex is now out of bounds (i.e., it was the last item),
      // we reset it to 0. We use the *old* length (mistakes.length) for the comparison
      // because the removal is async.
      if (qIndex >= mistakes.length - 1 && mistakes.length > 1) {
        setQIndex(0); // If we removed the last item of a non-empty list, loop back
      }
      // If mistakes.length was 1, it becomes 0, and the empty state handles the screen change.
      // If qIndex is still valid (list didn't end), we don't change qIndex, as the next item shifts to its position.
      
    } else {
      // 🐛 FIX: If wrong, move to the next question or loop back
      if (qIndex < mistakes.length - 1) {
        setQIndex(qIndex + 1);
      } else {
        setQIndex(0); // Loop back to start
      }
    }
    
    setStatus('neutral');
    setSelected(null);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <Pressable onPress={() => router.back()}><X color={Colors.textDim} size={28} /></Pressable>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
        </View>
        <Text style={styles.countText}>{mistakes.length} Left</Text>
      </View>

      <View style={styles.body}>
        <Text style={styles.topicLabel}>Mistake Review</Text>
        <Text style={styles.questionText}>{currentQ.q}</Text>
        <View style={styles.optionsContainer}>
          {currentQ.options.map((opt, index) => {
            const isSelected = selected === opt;
            const isCorrectState = status === 'correct' && currentQ.answer === opt; // Check if THIS option is the correct one
            const isWrongState = status === 'wrong' && isSelected;
            const isUnselectedCorrect = status !== 'neutral' && currentQ.answer === opt; // Highlight correct answer if wrong answer was chosen

            let borderColor = '#E5E5E5';
            let bgColor = 'white';
            let textColor = Colors.text;

            if (status !== 'neutral') {
              if (isUnselectedCorrect || isCorrectState) {
                // Correct answer highlight
                borderColor = Colors.success; 
                bgColor = '#E7FFDB'; 
                textColor = Colors.successDark;
              } else if (isWrongState) {
                // Wrong answer highlight
                borderColor = Colors.error; 
                bgColor = '#FFDFDF';
                textColor = Colors.errorDark;
              } else {
                // Normal unselected option after check
                borderColor = '#E5E5E5';
                bgColor = 'white';
                textColor = Colors.textDim;
              }
            } else if (isSelected) {
              // Neutral state selection highlight
              borderColor = Colors.primary; 
              bgColor = '#F6F5FF';
              textColor = Colors.primaryDark;
            }

            return (
              <Pressable
                key={index}
                onPress={() => status === 'neutral' && setSelected(opt)}
                style={[styles.optionBtn, { borderColor, backgroundColor: bgColor }]}
              >
                <Text style={[styles.optionText, { color: textColor }]}>{opt}</Text>
                {/* Visual indicator for edge/shadow */}
                <View style={[
                  styles.optionEdge, 
                  { 
                    backgroundColor: isUnselectedCorrect || isCorrectState 
                      ? Colors.success 
                      : isWrongState 
                        ? Colors.error 
                        : isSelected 
                          ? Colors.primary 
                          : '#E5E5E5' 
                  }
                ]} />
              </Pressable>
            );
          })}
        </View>
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={[
            styles.checkBtn, 
            !selected && styles.checkBtnDisabled, 
            status !== 'neutral' && {backgroundColor: status === 'correct' ? Colors.success : Colors.error}
          ]} 
          onPress={status === 'neutral' ? handleCheck : handleContinue} 
          disabled={!selected && status === 'neutral'}
        >
          <Text style={styles.checkBtnText}>
            {status === 'neutral' ? 'CHECK' : 'CONTINUE'}
          </Text>
        </Pressable>
      </View>

      <Modal visible={showFeedback} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={[styles.feedbackBox, status === 'wrong' ? styles.feedbackWrong : styles.feedbackCorrect]}>
            <View style={styles.feedbackHeader}>
              {status === 'correct' ? <CheckCircle color={Colors.successDark} size={32} /> : <XCircle color={Colors.errorDark} size={32} />}
              <Text style={[styles.feedbackTitle, status === 'correct' ? {color: Colors.successDark} : {color: Colors.errorDark}]}>
                {status === 'correct' ? 'Mistake Cleared!' : 'Keep Trying'}
              </Text>
            </View>
            <Text style={styles.feedbackText}>{status === 'correct' ? 'Great job! You reviewed this concept.' : currentQ.explanation}</Text>
            <Pressable style={[styles.continueBtn, status === 'wrong' ? {backgroundColor: Colors.error} : {backgroundColor: Colors.success}]} onPress={handleContinue}>
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
  // FIX: Removed manual paddingTop: 40 on Android. Let SafeAreaView handle padding.
  header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, paddingTop: Platform.OS === 'android' ? 10 : 10, paddingBottom: 10, justifyContent: 'space-between' },
  progressBarBg: { flex: 1, height: 12, backgroundColor: '#F0F0F0', borderRadius: 6, marginHorizontal: 16 },
  progressBarFill: { height: '100%', backgroundColor: Colors.primary, borderRadius: 6 },
  countText: { fontSize: 16, fontWeight: '700', color: Colors.textDim },
  body: { flex: 1, padding: 24 },
  topicLabel: { fontSize: 12, fontWeight: '800', color: Colors.error, textTransform: 'uppercase', marginBottom: 8, letterSpacing: 1 },
  questionText: { fontSize: 24, fontWeight: '800', color: Colors.text, marginBottom: 24, lineHeight: 32 },
  optionsContainer: { gap: 14 },
  optionBtn: { borderWidth: 2, borderRadius: 16, padding: 18, position: 'relative', marginBottom: 4 },
  optionText: { fontSize: 17, fontWeight: '600' },
  optionEdge: { position: 'absolute', bottom: -6, left: -2, right: -2, height: 6, borderBottomLeftRadius: 16, borderBottomRightRadius: 16, zIndex: -1 },
  footer: { padding: 20, borderTopWidth: 1, borderColor: '#F5F5F5' },
  checkBtn: { backgroundColor: Colors.primary, height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowColor: Colors.primary, shadowOpacity: 0.3, shadowRadius: 8, shadowOffset: {width: 0, height: 4} },
  checkBtnDisabled: { backgroundColor: '#E5E5E5', shadowOpacity: 0, shadowColor: 'transparent' },
  checkBtnText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  modalOverlay: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  feedbackBox: { padding: 30, borderTopLeftRadius: 30, borderTopRightRadius: 30, minHeight: 250 },
  feedbackCorrect: { backgroundColor: Colors.success + '20' }, // Use constant colors for consistency
  feedbackWrong: { backgroundColor: Colors.error + '20' }, // Use constant colors for consistency
  feedbackHeader: { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 12 },
  feedbackTitle: { fontSize: 24, fontWeight: '800' },
  feedbackText: { fontSize: 16, color: Colors.text, marginBottom: 30, lineHeight: 24 },
  continueBtn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center' },
  continueText: { color: 'white', fontWeight: '800', fontSize: 16, letterSpacing: 1 },
  emptyState: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyTitle: { fontSize: 24, fontWeight: '800', color: Colors.text, marginTop: 20, marginBottom: 10 },
  emptyText: { fontSize: 16, color: Colors.textDim, textAlign: 'center', lineHeight: 24, marginBottom: 30 },
  headerTitle: { fontSize: 20, fontWeight: '800', color: Colors.text },
  closeBtn: { padding: 4 },
  goBackBtn: { backgroundColor: Colors.primary, paddingHorizontal: 30, paddingVertical: 15, borderRadius: 12 },
  goBackText: { color: 'white', fontWeight: '800', fontSize: 16 }
});