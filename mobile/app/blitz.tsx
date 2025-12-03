import { useUser } from '@/app/context/UserContext';
import CodeBlock from '@/components/CodeBlock';
import { BLITZ_CARDS } from '@/constants/blitz';
import { Colors } from '@/constants/Colors';
import { useRouter } from 'expo-router';
import { Check, ChevronLeft, GitMerge, GitPullRequest, X } from 'lucide-react-native';
import React, { useState } from 'react';
import { Dimensions, Platform, Pressable, SafeAreaView, StyleSheet, Text, View } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withSpring, withTiming } from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SWIPE_THRESHOLD = width * 0.3;

export default function BlitzScreen() {
  const router = useRouter();
  const { addXp, deductHeart, isDark } = useUser();
  // Select the correct palette based on isDark
  const theme = isDark ? Colors.dark : Colors.light;
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const translateX = useSharedValue(0);
  const nextCardScale = useSharedValue(0.9);

  const currentCard = BLITZ_CARDS[currentIndex];

  const handleSwipeComplete = (direction: 'left' | 'right') => {
    const isRight = direction === 'right';
    const userGuess = isRight; 
    const isCorrect = userGuess === currentCard.isValid;

    if (isCorrect) {
      addXp(15);
    } else {
      deductHeart();
    }

    translateX.value = withTiming(isRight ? width : -width, { duration: 250 }, () => {
      runOnJS(nextCard)();
    });
  };

  const nextCard = () => {
    if (currentIndex >= BLITZ_CARDS.length - 1) {
      setIsComplete(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
      translateX.value = 0;
      nextCardScale.value = 0.9;
    }
  };

  const gesture = Gesture.Pan()
    .onUpdate((e) => {
      translateX.value = e.translationX;
      nextCardScale.value = 0.9 + Math.min(Math.abs(e.translationX) / (width * 0.8), 0.1);
    })
    .onEnd(() => {
      if (Math.abs(translateX.value) > SWIPE_THRESHOLD) {
        runOnJS(handleSwipeComplete)(translateX.value > 0 ? 'right' : 'left');
      } else {
        translateX.value = withSpring(0);
        nextCardScale.value = withTiming(0.9);
      }
    });

  const cardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotate: `${translateX.value / 20}deg` }
    ],
  }));

  const nextCardStyle = useAnimatedStyle(() => ({
    transform: [{ scale: nextCardScale.value }],
    opacity: nextCardScale.value,
  }));

  if (isComplete) {
    return (
      <SafeAreaView style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.centerContent}>
          <GitPullRequest size={80} color={theme.primary} />
          <Text style={[styles.title, { color: theme.text }]}>Queue Cleared!</Text>
          <Text style={[styles.subtitle, { color: theme.textDim }]}>You've reviewed all pending code snippets.</Text>
          <Pressable style={[styles.btn, { backgroundColor: theme.primary }]} onPress={() => router.back()}>
            <Text style={styles.btnText}>BACK TO DASHBOARD</Text>
          </Pressable>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <GestureHandlerRootView style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backBtn}>
            <ChevronLeft size={28} color={theme.text} />
          </Pressable>
          <Text style={[styles.headerTitle, { color: theme.text }]}>Code Review Blitz</Text>
          <View style={[styles.counter, { backgroundColor: theme.card }]}>
            <Text style={[styles.counterText, { color: theme.primary }]}>{currentIndex + 1} / {BLITZ_CARDS.length}</Text>
          </View>
        </View>

        <View style={styles.deck}>
          {currentIndex < BLITZ_CARDS.length - 1 && (
            <Animated.View style={[styles.card, styles.nextCard, nextCardStyle, { backgroundColor: theme.card, borderColor: theme.border }]}>
              <View style={[styles.placeholderBlock, { backgroundColor: theme.background }]} />
            </Animated.View>
          )}

          <GestureDetector gesture={gesture}>
            <Animated.View style={[styles.card, cardStyle, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]}>
              <View style={[styles.cardHeader, { backgroundColor: theme.background, borderBottomColor: theme.border }]}>
                <View style={{flexDirection: 'row', gap: 8}}>
                  <View style={[styles.dot, {backgroundColor: '#FF5F56'}]} />
                  <View style={[styles.dot, {backgroundColor: '#FFBD2E'}]} />
                  <View style={[styles.dot, {backgroundColor: '#27C93F'}]} />
                </View>
                <Text style={[styles.filename, { color: theme.textDim }]}>snippet.js</Text>
              </View>
              
              <View style={styles.codeContainer}>
                <CodeBlock code={currentCard.code} />
              </View>

              <View style={[styles.claimBox, { backgroundColor: theme.background, borderColor: theme.primary }]}>
                <Text style={[styles.claimLabel, { color: theme.primary }]}>THE CLAIM:</Text>
                <Text style={[styles.claimText, { color: theme.text }]}>{currentCard.claim}</Text>
              </View>

              <View style={styles.tutorialOverlay}>
                <View style={styles.tutorialLeft}>
                  {/* FIX: Using theme.error instead of Colors.error */}
                  <X color={theme.error} size={24} />
                  <Text style={[styles.tutorialText, {color: theme.error}]}>REJECT</Text>
                </View>
                <View style={styles.tutorialRight}>
                  <Text style={[styles.tutorialText, {color: theme.success}]}>MERGE</Text>
                  <Check color={theme.success} size={24} />
                </View>
              </View>
            </Animated.View>
          </GestureDetector>
        </View>

        <View style={styles.controls}>
          <Pressable style={[styles.controlBtn, {backgroundColor: theme.error + '15', borderColor: theme.error}]} onPress={() => handleSwipeComplete('left')}>
            <X color={theme.error} size={32} />
          </Pressable>
          <Pressable style={[styles.controlBtn, {backgroundColor: theme.success + '15', borderColor: theme.success}]} onPress={() => handleSwipeComplete('right')}>
            <GitMerge color={theme.success} size={32} />
          </Pressable>
        </View>

      </SafeAreaView>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: { flexDirection: 'row', justifyContent: 'space-between', padding: 24, alignItems: 'center', paddingTop: Platform.OS === 'android' ? 50 : 20 },
  backBtn: { padding: 4 },
  headerTitle: { fontSize: 20, fontWeight: '800' },
  counter: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  counterText: { fontWeight: '700' },
  
  deck: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  card: {
    width: width * 0.9,
    height: '75%',
    borderRadius: 24,
    borderWidth: 1,
    position: 'absolute',
    shadowOpacity: 0.1, shadowRadius: 10, shadowOffset: { width: 0, height: 5 },
    elevation: 5,
    overflow: 'hidden'
  },
  nextCard: { zIndex: -1 },
  
  cardHeader: { 
    height: 48, borderBottomWidth: 1, 
    flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, justifyContent: 'space-between' 
  },
  dot: { width: 10, height: 10, borderRadius: 5 },
  filename: { fontSize: 12, fontWeight: '600', flex: 1, textAlign: 'center', marginRight: 24 },
  
  codeContainer: { padding: 16, flex: 1 },
  
  claimBox: { 
    margin: 16, padding: 16, borderRadius: 16, borderWidth: 2 
  },
  claimLabel: { fontSize: 12, fontWeight: '800', marginBottom: 4 },
  claimText: { fontSize: 18, fontWeight: '700' },

  placeholderBlock: { height: '100%' },

  tutorialOverlay: { 
    flexDirection: 'row', justifyContent: 'space-between', padding: 20, 
    position: 'absolute', bottom: 0, width: '100%', pointerEvents: 'none' 
  },
  tutorialLeft: { flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.5 },
  tutorialRight: { flexDirection: 'row', alignItems: 'center', gap: 4, opacity: 0.5 },
  tutorialText: { fontWeight: '800', fontSize: 12 },

  controls: { flexDirection: 'row', justifyContent: 'center', gap: 40, marginBottom: 30 },
  controlBtn: { 
    width: 64, height: 64, borderRadius: 32, justifyContent: 'center', alignItems: 'center', 
    borderWidth: 2, shadowOpacity: 0.05, shadowRadius: 4, elevation: 2 
  },

  centerContent: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 30 },
  title: { fontSize: 28, fontWeight: '800', marginTop: 20 },
  subtitle: { fontSize: 16, textAlign: 'center', marginTop: 10, marginBottom: 40 },
  btn: { paddingVertical: 16, paddingHorizontal: 32, borderRadius: 16 },
  btnText: { color: 'white', fontWeight: '800', fontSize: 16 }
});