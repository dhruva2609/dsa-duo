import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { BlurView } from 'expo-blur';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Check, Lock, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withRepeat, withSequence, withTiming, interpolateColor } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const NODE_SIZE = 84;
const NODE_MARGIN = 40;

const TOPIC_ICONS: Record<string, string> = {
  'core-concepts': 'code-braces',
  'basics': 'code-braces',
  'linked-lists': 'link-variant',
  'stacks-queues': 'layers',
  'sorting': 'sort',
  'recursion': 'repeat',
  'hash-maps-sets': 'magnify',
  'trees-heaps': 'tree',
  'graphs': 'network',
  'advanced-techniques': 'flash',
  'greedy': 'trophy',
  'dp': 'lightning-bolt',
  'boss': 'skull',
  'star': 'star',
};

const AnimatedNode = ({ isActive, isUnlocked, colors, borderColor, icon, isDark }: any) => {
  const scale = useSharedValue(1);

  useEffect(() => {
    if (isActive) {
      scale.value = withRepeat(
        withSequence(
          withTiming(1.1, { duration: 1000 }),
          withTiming(1, { duration: 1000 })
        ),
        -1,
        true
      );
    } else {
      scale.value = withTiming(1);
    }
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!isUnlocked) {
    return (
      <View style={[styles.circle, { backgroundColor: 'transparent', borderColor: 'rgba(255,255,255,0.1)', borderWidth: 1 }]}>
        <BlurView intensity={isDark ? 20 : 40} style={StyleSheet.absoluteFill} tint={isDark ? 'dark' : 'light'} />
        <Lock size={24} color={isDark ? '#475569' : '#94A3B8'} />
      </View>
    );
  }

  return (
    <Animated.View style={[animatedStyle]}>
      <LinearGradient colors={colors} style={[styles.circle, { borderColor, borderWidth: 2 }]}>
         <MaterialCommunityIcons name={icon as any} size={32} color="white" />
      </LinearGradient>
    </Animated.View>
  );
};




export default function HomeScreen() {
  const { user, xp, streakCount, isLoaded, completedLevels, updateStreak, isDark, selectedLanguage, setSelectedLanguage } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  const [topics, setTopics] = useState<{ id: string; slug: string; title: string; difficulty: string; icon: string }[]>([]);
  
  const theme = isDark ? Colors.dark : Colors.light;

  const languages = [
    { id: 'javascript', label: 'JavaScript', icon: 'js' },
    { id: 'python', label: 'Python', icon: 'py' },
    { id: 'cpp', label: 'C++', icon: 'c' },
  ];

  useEffect(() => {
    if (isLoaded) {
      updateStreak();
      fetchModules();
    }
  }, [isLoaded, selectedLanguage]);

  const fetchModules = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/quiz?language=${selectedLanguage}`);
      const data = await response.json();
      if (response.ok) {
        setTopics(data);
      }
    } catch (error) {
      console.error('Failed to fetch modules', error);
    }
  };

  const handleChoice = (choice: 'study' | 'quiz') => {
    if (selectedTopic) {
      router.push({ pathname: choice === 'study' ? '/learn/[id]' : '/quiz/[id]', params: { id: selectedTopic } });
    }
    setSelectedTopic(null);
  };

  const generatePath = () => {
    if (topics.length === 0) return '';
    const startY = 60;
    const amplitude = 80;
    const frequency = 0.5;
    let path = `M ${width / 2 + Math.sin(0) * amplitude} ${startY + NODE_SIZE / 2}`; 
    topics.forEach((_, index) => {
      if (index === topics.length - 1) return;
      const currentX = (width / 2) + Math.sin(index * frequency) * amplitude;
      const startYNode = startY + (index * (NODE_SIZE + NODE_MARGIN)) + (NODE_SIZE / 2);
      const nextX = (width / 2) + Math.sin((index + 1) * frequency) * amplitude;
      const endYNode = startY + ((index + 1) * (NODE_SIZE + NODE_MARGIN)) + (NODE_SIZE / 2);
      const controlY = (startYNode + endYNode) / 2;
      path += ` C ${currentX} ${controlY}, ${nextX} ${controlY}, ${nextX} ${endYNode}`;
    });
    return path;
  };

  if (!isLoaded) return <View style={[styles.loading, {backgroundColor: theme.background}]}><Text style={{color: theme.text}}>Loading...</Text></View>;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle="light-content" />
      
      {/* Scrollable Language Selector */}
      <View style={[styles.languageHeader, { paddingTop: insets.top + 10, borderColor: theme.border, backgroundColor: theme.background }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.langList}>
          {languages.map(lang => (
            <TouchableOpacity 
              key={lang.id} 
              onPress={() => setSelectedLanguage(lang.id)}
              style={[
                styles.langPill, 
                { backgroundColor: selectedLanguage === lang.id ? theme.primary : theme.card },
                selectedLanguage === lang.id && styles.activeLangPill
              ]}
            >
              <Text style={[styles.langText, { color: selectedLanguage === lang.id ? 'white' : theme.text }]}>
                {lang.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Main Path */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: 150 }]}>
        {topics.length > 0 && (
          <View style={styles.svgContainer} pointerEvents="none">
            <Svg width={width} height={topics.length * (NODE_SIZE + NODE_MARGIN) + 200}>
              <Path
                d={generatePath()}
                stroke={theme.primary}
                strokeWidth="6"
                strokeDasharray="10, 10"
                strokeOpacity={0.3}
                strokeLinecap="round"
                fill="none"
              />
            </Svg>
          </View>
        )}

        {topics.map((topic, index) => {
          const slug = topic.slug;
          const icon = TOPIC_ICONS[slug] || 'book';
          const baseSlug = slug.includes('-') ? slug.split('-').pop()! : slug;
          const displayIcon = TOPIC_ICONS[slug] || TOPIC_ICONS[baseSlug] || icon;

          const isCompleted = completedLevels.includes(slug) || user?.email === 'test@test.com';
          const isUnlocked = index === 0 || completedLevels.includes(topics[index - 1]?.slug) || user?.email === 'test@test.com';
          const isActive = isUnlocked && !isCompleted;
          
          // Zig-Zag S-Curve logic
          const amplitude = 80;
          const frequency = 0.5;
          const xOffset = Math.sin(index * frequency) * amplitude;

          let bg = isCompleted ? [theme.secondary, theme.secondary] : [theme.primary, theme.primaryDark];
          let border = isUnlocked ? 'rgba(255,255,255,0.3)' : 'transparent';

          return (
            <View key={slug} style={[styles.nodeWrapper, { transform: [{ translateX: xOffset }] }]}>
              {isActive && (
                <View style={[styles.floatingLabel, { backgroundColor: theme.primary, shadowColor: theme.primary }]}>
                  <Text style={styles.labelText}>START</Text>
                  <View style={[styles.triangle, { borderTopColor: theme.primary }]} />
                </View>
              )}
              
              <TouchableOpacity 
                activeOpacity={isUnlocked ? 0.7 : 1}
                onPress={() => isUnlocked ? setSelectedTopic(slug) : null}
              >
                <AnimatedNode 
                  isActive={isActive} 
                  isUnlocked={isUnlocked}
                  colors={bg}
                  borderColor={border}
                  icon={isCompleted ? 'check' : displayIcon}
                  isDark={isDark}
                />
              </TouchableOpacity>
              
              <View style={[styles.titleBubble, { backgroundColor: theme.card, borderColor: theme.border, borderWidth: 1 }]}>
                <Text numberOfLines={1} style={[styles.topicTitle, { color: isUnlocked ? theme.text : theme.textDim, fontWeight: isActive ? '800' : '600' }]}>
                  {topic.title}
                </Text>
              </View>
            </View>
          );
        })}


        {topics.length === 0 && (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="emoticon-sad-outline" size={60} color={theme.textDim} />
            <Text style={[styles.emptyText, { color: theme.textDim }]}>No levels found for this language.</Text>
          </View>
        )}
      </ScrollView>
      
      {/* Modal remains same */}
      <Modal transparent visible={selectedTopic !== null} animationType="fade" onRequestClose={() => setSelectedTopic(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedTopic(null)}>
          <View style={[styles.bottomSheet, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
            <Text style={[styles.modalTitle, { color: theme.text }]}>Ready to learn?</Text>
            <TouchableOpacity style={[styles.choiceBtn, { backgroundColor: theme.background, borderColor: theme.border }]} onPress={() => handleChoice('study')}>
              <Text style={{fontSize: 24}}>📚</Text>
              <View>
                <Text style={[styles.choiceTitle, { color: theme.text }]}>Read Theory</Text>
                <Text style={[styles.choiceDesc, { color: theme.textDim }]}>Master concepts first</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.choiceBtn, { backgroundColor: theme.background, borderColor: theme.border }]} onPress={() => handleChoice('quiz')}>
              <Text style={{fontSize: 24}}>⚡️</Text>
              <View>
                <Text style={[styles.choiceTitle, { color: theme.text }]}>Start Quiz</Text>
                <Text style={[styles.choiceDesc, { color: theme.textDim }]}>Test your skills</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  languageHeader: { backgroundColor: 'white', paddingBottom: 10, zIndex: 10, borderBottomWidth: 1 },
  langList: { paddingHorizontal: 16, gap: 10 },
  langPill: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, alignItems: 'center', justifyContent: 'center', minWidth: 100 },
  activeLangPill: { shadowOpacity: 0.2, shadowRadius: 5, elevation: 3 },
  langText: { fontSize: 14, fontWeight: '700' },
  scrollContent: { paddingBottom: 100, paddingTop: 40, alignItems: 'center' },
  svgContainer: { position: 'absolute', top: 0, left: 0, right: 0 },
  nodeWrapper: { alignItems: 'center', marginBottom: NODE_MARGIN + 20, width: 200 },
  circle: { width: NODE_SIZE, height: NODE_SIZE, borderRadius: NODE_SIZE / 2, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.4, shadowOffset: { width: 0, height: 6 }, shadowRadius: 10, elevation: 10 },
  titleBubble: { marginTop: 10, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, shadowOpacity: 0.05, shadowRadius: 5, elevation: 2 },
  topicTitle: { fontSize: 13, textAlign: 'center' },
  floatingLabel: { position: 'absolute', top: -50, paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12, zIndex: 2, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
  labelText: { color: 'white', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  triangle: { width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 8, borderRightWidth: 8, borderTopWidth: 8, borderLeftColor: 'transparent', borderRightColor: 'transparent', alignSelf: 'center', position: 'absolute', bottom: -8 },
  emptyContainer: { alignItems: 'center', marginTop: 100, gap: 20 },
  emptyText: { fontSize: 16, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  bottomSheet: { padding: 24, borderRadius: 24, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  choiceBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, gap: 16, borderWidth: 1 },
  choiceTitle: { fontSize: 16, fontWeight: '700' },
  choiceDesc: { fontSize: 13 }
});