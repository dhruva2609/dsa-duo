import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { quizzes } from '@/constants/quizzes';
import { slugify } from '@/utils/slugify';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Check, Lock, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const NODE_SIZE = 80;
const NODE_MARGIN = 30;
const OFFSETS = [0, -1, -1.5, 0, 1, 1.5];

const TOPIC_ICONS: Record<string, string> = {
  'core-concepts-complexity': 'code-braces',
  'linked-lists': 'link-variant',
  'stacks-queues': 'layers',
  'sorting-algorithms': 'sort',
  'hash-maps-sets': 'magnify',
  'trees-heaps': 'tree',
  'graphs': 'network',
  'advanced-techniques': 'flash',
};

export default function HomeScreen() {
  const { user, xp, streakCount, isLoaded, completedLevels, updateStreak, isDark } = useUser();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
  
  const theme = isDark ? Colors.dark : Colors.light;

  useEffect(() => {
    if (isLoaded) updateStreak();
  }, [isLoaded]);

  const language = 'javascript';
  const topics = (quizzes[language as keyof typeof quizzes]?.dsa ?? []) as { topic: string }[];

  const handleChoice = (choice: 'study' | 'quiz') => {
    if (selectedTopic) {
      router.push({ pathname: choice === 'study' ? '/learn/[id]' : '/quiz/[id]', params: { id: selectedTopic } });
    }
    setSelectedTopic(null);
  };

  const generatePath = () => {
    const startY = 60;
    let path = `M ${width / 2} ${startY + NODE_SIZE / 2}`; 
    topics.forEach((_, index) => {
      if (index === topics.length - 1) return;
      const currentX = (width / 2) + (OFFSETS[index % OFFSETS.length] * 60);
      const startYNode = startY + (index * (NODE_SIZE + NODE_MARGIN)) + (NODE_SIZE / 2);
      const nextX = (width / 2) + (OFFSETS[(index + 1) % OFFSETS.length] * 60);
      const endYNode = startY + ((index + 1) * (NODE_SIZE + NODE_MARGIN)) + (NODE_SIZE / 2);
      const controlY = (startYNode + endYNode) / 2;
      path += ` C ${currentX} ${controlY}, ${nextX} ${controlY}, ${nextX} ${endYNode}`;
    });
    return path;
  };

  if (!isLoaded) return <View style={[styles.loading, {backgroundColor: theme.background}]}><Text style={{color: theme.text}}>Loading...</Text></View>;

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      
      {/* Custom Header with Safe Area */}
      <View style={[styles.header, { backgroundColor: theme.background, paddingTop: insets.top + 10 }]}>
        <View>
          <Text style={[styles.greeting, { color: theme.primaryDark }]}>Hi, {user?.name || 'Dev'}</Text>
          <Text style={[styles.subGreeting, { color: theme.textDim }]}>Continue your path</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={[styles.statPill, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
            <MaterialCommunityIcons name="flash" size={18} color={Colors.warning} />
            <Text style={[styles.statText, { color: theme.text }]}>{xp}</Text>
          </View>
          <View style={[styles.statPill, { backgroundColor: theme.card, shadowColor: theme.shadow }]}>
            <MaterialCommunityIcons name="fire" size={18} color={Colors.error} />
            <Text style={[styles.statText, { color: theme.text }]}>{streakCount}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={[styles.scrollContent, { paddingBottom: 100 }]}>
        <View style={styles.svgContainer} pointerEvents="none">
          <Svg width={width} height={topics.length * 150}>
            <Path
              d={generatePath()}
              stroke={theme.border}
              strokeWidth="6"
              strokeDasharray="10, 10"
              strokeOpacity={isDark ? 0.3 : 0.5}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </View>

        {topics.map((topic, index) => {
          const slug = slugify(topic.topic);
          const icon = TOPIC_ICONS[slug] || 'book';
          const isCompleted = completedLevels.includes(slug);
          const isUnlocked = index === 0 || completedLevels.includes(slugify(topics[index - 1].topic));
          const isActive = isUnlocked && !isCompleted;
          const xOffset = OFFSETS[index % OFFSETS.length] * 60;

          let bg = theme.card;
          let border = 'transparent';
          
          if (isActive) { bg = theme.primary; border = 'transparent'; }
          else if (isCompleted) { bg = theme.success; }
          else if (isUnlocked) { bg = theme.card; border = theme.primary; }
          else { bg = isDark ? '#1B2559' : '#F4F7FE'; } 

          return (
            <View key={slug} style={[styles.nodeWrapper, { transform: [{ translateX: xOffset }] }]}>
              {isActive && (
                <View style={[styles.floatingLabel, { backgroundColor: theme.primaryDark, shadowColor: theme.shadow }]}>
                  <Text style={styles.labelText}>START</Text>
                  <View style={[styles.triangle, { borderTopColor: theme.primaryDark }]} />
                </View>
              )}
              
              <TouchableOpacity 
                activeOpacity={isUnlocked ? 0.7 : 1}
                onPress={() => isUnlocked ? setSelectedTopic(slug) : null}
                style={[
                  styles.circle, 
                  { backgroundColor: bg, borderColor: border, borderWidth: border !== 'transparent' ? 3 : 0, shadowColor: theme.shadow }
                ]}
              >
                {isCompleted ? <Check size={32} color="white" strokeWidth={3} /> :
                 isActive ? <Play size={32} color="white" fill="white" /> :
                 isUnlocked ? <MaterialCommunityIcons name={icon as any} size={30} color={theme.primary} /> :
                 <Lock size={24} color={theme.textDim} />}
              </TouchableOpacity>
              
              <Text style={[styles.topicTitle, { color: isUnlocked ? theme.text : theme.textDim, fontWeight: isActive ? '800' : '600' }]}>
                {topic.topic}
              </Text>
            </View>
          );
        })}
      </ScrollView>
      
      {/* Modal Code (unchanged logic) */}
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
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 24, paddingBottom: 10, zIndex: 10 },
  greeting: { fontSize: 24, fontWeight: '700' },
  subGreeting: { fontSize: 14, fontWeight: '500' },
  statsRow: { flexDirection: 'row', gap: 12 },
  statPill: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 12, paddingVertical: 8, borderRadius: 20, shadowOpacity: 0.1, shadowRadius: 10, elevation: 2 },
  statText: { fontSize: 14, fontWeight: '700' },
  scrollContent: { paddingBottom: 100, paddingTop: 60, alignItems: 'center' },
  svgContainer: { position: 'absolute', top: 0, left: 0, right: 0 },
  nodeWrapper: { alignItems: 'center', marginBottom: NODE_MARGIN, width: 140 },
  circle: { width: NODE_SIZE, height: NODE_SIZE, borderRadius: NODE_SIZE / 2, alignItems: 'center', justifyContent: 'center', shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowRadius: 15, marginBottom: 10 },
  topicTitle: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  floatingLabel: { position: 'absolute', top: -40, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12, zIndex: 2, shadowOpacity: 0.3, shadowRadius: 8 },
  labelText: { color: 'white', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  triangle: { width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid', borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6, borderLeftColor: 'transparent', borderRightColor: 'transparent', alignSelf: 'center', position: 'absolute', bottom: -6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', padding: 24 },
  bottomSheet: { padding: 24, borderRadius: 24, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  choiceBtn: { flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, marginBottom: 12, gap: 16, borderWidth: 1 },
  choiceTitle: { fontSize: 16, fontWeight: '700' },
  choiceDesc: { fontSize: 13 }
});