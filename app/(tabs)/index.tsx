import { useUser } from '@/app/context/UserContext';
import { Colors } from '@/constants/Colors';
import { quizzes } from '@/constants/quizzes';
import { slugify } from '@/utils/slugify';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useRouter } from 'expo-router';
import { Check, Lock, Play } from 'lucide-react-native';
import React, { useEffect, useState } from 'react';
import { Dimensions, Modal, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const { width } = Dimensions.get('window');
const NODE_SIZE = 80;
const NODE_MARGIN = 30;

const OFFSETS = [0, -1, -1.5, 0, 1, 1.5];

// Modern Tech Icons
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

const HomeScreen = () => {
  const { user, xp, streakCount, isLoaded, completedLevels, updateStreak } = useUser();
  const router = useRouter();
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const streakUpdated = updateStreak();
      if (streakUpdated) setShowStreakModal(true);
    }
  }, [isLoaded]);

  const language = 'javascript';
  const topics = (quizzes[language as keyof typeof quizzes]?.dsa ?? []) as { topic: string }[];

  const handleChoice = (choice: 'study' | 'quiz') => {
    if (selectedTopic) {
      const path = choice === 'study' ? '/learn/[id]' : '/quiz/[id]';
      router.push({
        pathname: path,
        params: { id: selectedTopic },
      });
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

  if (!isLoaded) return <View style={styles.loading}><Text>Loading...</Text></View>;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Dashboard Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Hi, {user?.name || 'Dev'}</Text>
          <Text style={styles.subGreeting}>Continue your path</Text>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statPill}>
            <MaterialCommunityIcons name="flash" size={18} color={Colors.warning} />
            <Text style={styles.statText}>{xp}</Text>
          </View>
          <View style={styles.statPill}>
            <MaterialCommunityIcons name="fire" size={18} color={Colors.error} />
            <Text style={styles.statText}>{streakCount}</Text>
          </View>
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        
        {/* Path Line */}
        <View style={styles.svgContainer} pointerEvents="none">
          <Svg width={width} height={topics.length * 150}>
            <Path
              d={generatePath()}
              stroke={Colors.primary} // Indigo path
              strokeWidth="6"
              strokeDasharray="10, 10" // Dashed line looks more techie
              strokeOpacity={0.2}
              strokeLinecap="round"
              fill="none"
            />
          </Svg>
        </View>

        {/* Nodes */}
        {topics.map((topic, index) => {
          const slug = slugify(topic.topic);
          const icon = TOPIC_ICONS[slug] || 'book';
          
          const isCompleted = completedLevels.includes(slug);
          const isUnlocked = index === 0 || completedLevels.includes(slugify(topics[index - 1].topic));
          const isActive = isUnlocked && !isCompleted;
          
          const xOffset = OFFSETS[index % OFFSETS.length] * 60;

          // Colors based on state
          let bg = 'white';
          let iconColor = Colors.textDim;
          let border = 'transparent';
          let elevation = 2;

          if (isActive) {
            bg = Colors.primary;
            iconColor = 'white';
            elevation = 10;
          } else if (isCompleted) {
            bg = Colors.success; // Mint Green
            iconColor = 'white';
          } else if (isUnlocked) {
            bg = 'white';
            iconColor = Colors.primary;
            border = Colors.primary;
          }

          return (
            <View key={slug} style={[styles.nodeWrapper, { transform: [{ translateX: xOffset }] }]}>
              {isActive && (
                <View style={styles.floatingLabel}>
                  <Text style={styles.labelText}>START</Text>
                  <View style={styles.triangle} />
                </View>
              )}
              
              <TouchableOpacity 
                activeOpacity={isUnlocked ? 0.7 : 1}
                onPress={() => isUnlocked ? setSelectedTopic(slug) : null}
                style={[
                  styles.circle, 
                  { backgroundColor: bg, borderColor: border, borderWidth: border !== 'transparent' ? 3 : 0, elevation }
                ]}
              >
                {isCompleted ? (
                  <Check size={32} color="white" strokeWidth={3} />
                ) : isActive ? (
                  <Play size={32} color="white" fill="white" />
                ) : isUnlocked ? (
                  <MaterialCommunityIcons name={icon as any} size={30} color={Colors.primary} />
                ) : (
                  <Lock size={24} color={Colors.textDim} />
                )}
              </TouchableOpacity>
              
              <Text style={[
                styles.topicTitle, 
                { color: isUnlocked ? Colors.primaryDark : Colors.textDim, fontWeight: isActive ? '800' : '600' }
              ]}>
                {topic.topic}
              </Text>
            </View>
          );
        })}
      </ScrollView>

      {/* Modal matching new theme */}
      <Modal transparent visible={selectedTopic !== null} animationType="fade" onRequestClose={() => setSelectedTopic(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedTopic(null)}>
          <View style={styles.bottomSheet}>
            <Text style={styles.modalTitle}>Ready to learn?</Text>
            
            <TouchableOpacity style={styles.choiceBtn} onPress={() => handleChoice('study')}>
              <View style={[styles.iconBox, { backgroundColor: '#E0E5F2' }]}>
                <Text style={{fontSize: 20}}>📚</Text>
              </View>
              <View>
                <Text style={styles.choiceTitle}>Read Theory</Text>
                <Text style={styles.choiceDesc}>Master the concepts first</Text>
              </View>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.choiceBtn} onPress={() => handleChoice('quiz')}>
              <View style={[styles.iconBox, { backgroundColor: Colors.primary + '20' }]}>
                <Text style={{fontSize: 20}}>⚡️</Text>
              </View>
              <View>
                <Text style={styles.choiceTitle}>Start Quiz</Text>
                <Text style={styles.choiceDesc}>Test your skills now</Text>
              </View>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  header: { 
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 24, paddingTop: 10, paddingBottom: 10, backgroundColor: Colors.background, zIndex: 10
  },
  greeting: { fontSize: 24, fontWeight: '700', color: Colors.primaryDark },
  subGreeting: { fontSize: 14, color: Colors.textDim, fontWeight: '500' },
  
  statsRow: { flexDirection: 'row', gap: 12 },
  statPill: { 
    flexDirection: 'row', alignItems: 'center', gap: 6, 
    backgroundColor: 'white', paddingHorizontal: 12, paddingVertical: 8, 
    borderRadius: 20, shadowColor: Colors.shadow, shadowOpacity: 0.1, shadowRadius: 10, elevation: 2
  },
  statText: { fontSize: 14, fontWeight: '700', color: Colors.primaryDark },
  
  scrollContent: { paddingBottom: 100, paddingTop: 60, alignItems: 'center' },
  svgContainer: { position: 'absolute', top: 0, left: 0, right: 0 },
  
  nodeWrapper: { alignItems: 'center', marginBottom: NODE_MARGIN, width: 140 },
  circle: {
    width: NODE_SIZE, height: NODE_SIZE, borderRadius: NODE_SIZE / 2,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: Colors.primary, shadowOpacity: 0.3, shadowOffset: { width: 0, height: 8 }, shadowRadius: 15,
    marginBottom: 10
  },
  topicTitle: { fontSize: 13, textAlign: 'center', lineHeight: 18 },
  
  floatingLabel: {
    position: 'absolute', top: -40, backgroundColor: Colors.primaryDark,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 12,
    zIndex: 2, shadowColor: Colors.primaryDark, shadowOpacity: 0.3, shadowRadius: 8
  },
  labelText: { color: 'white', fontWeight: 'bold', fontSize: 12, letterSpacing: 1 },
  triangle: {
    width: 0, height: 0, backgroundColor: 'transparent', borderStyle: 'solid',
    borderLeftWidth: 6, borderRightWidth: 6, borderTopWidth: 6,
    borderLeftColor: 'transparent', borderRightColor: 'transparent', borderTopColor: Colors.primaryDark,
    alignSelf: 'center', position: 'absolute', bottom: -6
  },

  modalOverlay: { flex: 1, backgroundColor: 'rgba(27, 37, 89, 0.4)', justifyContent: 'center', padding: 24 },
  bottomSheet: { 
    padding: 24, borderRadius: 24, backgroundColor: 'white', 
    shadowColor: Colors.shadow, shadowOpacity: 0.2, shadowRadius: 20, elevation: 10 
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: Colors.primaryDark, marginBottom: 20, textAlign: 'center' },
  
  choiceBtn: { 
    flexDirection: 'row', alignItems: 'center', padding: 16, borderRadius: 16, 
    marginBottom: 12, gap: 16, backgroundColor: 'white', borderWidth: 1, borderColor: Colors.border
  },
  iconBox: { width: 48, height: 48, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  choiceTitle: { fontSize: 16, fontWeight: '700', color: Colors.primaryDark },
  choiceDesc: { fontSize: 13, color: Colors.textDim }
});

export default HomeScreen;