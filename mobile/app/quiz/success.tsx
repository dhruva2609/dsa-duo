import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import * as Haptics from 'expo-haptics';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { CheckCircle, Zap, AlertCircle, BookOpen, X, Trophy } from 'lucide-react-native';
import LottieView from 'lottie-react-native';
import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View, ScrollView, Modal } from 'react-native';

export default function SuccessScreen() {

  const router = useRouter();
  const { score, mistakes } = useLocalSearchParams<{ score: string; mistakes?: string }>();
  const { addXp, isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;
  
  const [showReview, setShowReview] = useState(false);
  
  const userScore = parseInt(score || '0');
  const sessionMistakes = mistakes ? JSON.parse(mistakes) : [];
  const isMastered = userScore >= 80;

  useEffect(() => {
    if (isMastered) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addXp(20);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, []);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <View style={styles.content}>
        {isMastered ? (
          <View style={styles.trophyContainer}>
            <View style={[styles.trophyGlow, { backgroundColor: theme.primary }]} />
            <Trophy size={100} color="#FF6347" fill="#FF6347" />
            {/* <LottieView source={require('@/assets/lottie/success.json')} autoPlay loop style={styles.lottie} /> */}
          </View>
        ) : (
          <AlertCircle size={80} color={theme.accent} style={{marginBottom: 20}} />
        )}
        
        <Text style={[styles.title, { color: isMastered ? theme.primary : theme.accent, marginTop: 20 }]}>
          {isMastered ? 'Level Mastered!' : 'Keep Practicing!'}
        </Text>

        
        <View style={[styles.statsCard, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: theme.text }]}>Your Score</Text>
              <Text style={[styles.xpText, { color: isMastered ? theme.primary : Colors.error }]}>{userScore}%</Text>
            </View>

            {isMastered && (
              <View style={[styles.statRow, { marginTop: 16, borderTopWidth: 1, borderTopColor: theme.border, paddingTop: 16 }]}>
                <Text style={[styles.statLabel, { color: theme.text }]}>XP Earned</Text>
                <View style={[styles.xpBadge, { backgroundColor: theme.background }]}>
                    <Zap size={16} color="#FFCE20" fill="#FFCE20" />
                    <Text style={styles.xpText}>+20</Text>
                </View>
              </View>
            )}
        </View>
        
        {!isMastered && (
          <Text style={[styles.hint, { color: theme.textDim }]}>
            You need 80% to unlock the next level. Review your mistakes and try again!
          </Text>
        )}

        {sessionMistakes.length > 0 && (
          <Pressable 
            style={[styles.reviewBtn, { borderColor: theme.primary }]} 
            onPress={() => setShowReview(true)}
          >
            <BookOpen size={20} color={theme.primary} />
            <Text style={[styles.reviewBtnText, { color: theme.primary }]}>REVIEW MISTAKES</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.footer}>
        <Pressable 
          style={[styles.btn, { backgroundColor: isMastered ? theme.primary : theme.text, shadowColor: theme.shadow }]} 
          onPress={() => { router.dismissAll(); router.replace('/(tabs)'); }}
        >
          <Text style={styles.btnText}>CONTINUE</Text>
        </Pressable>
      </View>

      <Modal visible={showReview} animationType="slide" transparent={false}>
        <View style={[styles.modalContainer, { backgroundColor: theme.background }]}>
          <View style={[styles.modalHeader, { borderBottomColor: theme.border }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Mistakes Review</Text>
            <Pressable onPress={() => setShowReview(false)}>
              <X size={24} color={theme.text} />
            </Pressable>
          </View>
          <ScrollView contentContainerStyle={styles.modalContent}>
            {sessionMistakes.map((m: any, i: number) => (
              <View key={i} style={[styles.mistakeCard, { backgroundColor: theme.card, borderColor: theme.border }]}>
                <Text style={[styles.mistakeQ, { color: theme.text }]}>{m.q}</Text>
                <View style={[styles.correctAnswerBox, { backgroundColor: theme.background }]}>
                  <Text style={[styles.label, { color: Colors.success }]}>Correct Answer:</Text>
                  <Text style={[styles.answerText, { color: theme.text }]}>{m.answer}</Text>
                </View>
                <Text style={[styles.explanationText, { color: theme.textDim }]}>{m.explanation}</Text>
              </View>
            ))}
          </ScrollView>
        </View>
      </Modal>
    </View>
  );
}



const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, justifyContent: 'space-between' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  trophyContainer: { alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  trophyGlow: { position: 'absolute', width: 140, height: 140, borderRadius: 70, opacity: 0.2, transform: [{ scale: 1.2 }] },
  lottie: { width: 200, height: 200, position: 'absolute' },
  title: { fontSize: 36, fontWeight: '900', marginBottom: 40, letterSpacing: -1 },
  statsCard: { 
    width: '100%', padding: 24, borderRadius: 20,
    borderWidth: 1, shadowOpacity: 0.05, shadowRadius: 10, elevation: 3
  },
  statRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statLabel: { fontSize: 18, fontWeight: '700' },
  xpBadge: { flexDirection: 'row', alignItems: 'center', gap: 6, padding: 8, borderRadius: 12 },
  xpText: { fontSize: 18, fontWeight: '800', color: '#FFCE20' },
  hint: { marginTop: 32, textAlign: 'center', fontSize: 14, paddingHorizontal: 16 },
  footer: { marginBottom: 20 },

  btn: { height: 56, borderRadius: 16, justifyContent: 'center', alignItems: 'center', shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  btnText: { color: 'white', fontSize: 16, fontWeight: '800', letterSpacing: 1 },
  reviewBtn: { flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 24, paddingVertical: 12, paddingHorizontal: 20, borderRadius: 12, borderWidth: 1.5, borderStyle: 'dashed' },
  reviewBtnText: { fontWeight: '700', fontSize: 14 },
  
  // Modal Styles
  modalContainer: { flex: 1 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 20, borderBottomWidth: 1, paddingTop: 40 },
  modalTitle: { fontSize: 20, fontWeight: '800' },
  modalContent: { padding: 20 },
  mistakeCard: { padding: 20, borderRadius: 16, marginBottom: 16, borderWidth: 1 },
  mistakeQ: { fontSize: 16, fontWeight: '700', marginBottom: 12 },
  correctAnswerBox: { padding: 12, borderRadius: 8, marginBottom: 12 },
  label: { fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 4 },
  answerText: { fontSize: 15, fontWeight: '600' },
  explanationText: { fontSize: 14, lineHeight: 20 }
});