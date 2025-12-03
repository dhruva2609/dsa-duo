import { useUser } from '@/app/context/UserContext';
import { quizzes } from '@/constants/quizzes';
import { slugify } from '@/utils/slugify';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const topicIcons: Record<string, { name: string; color: string }> = {
  'core-concepts-complexity': { name: 'code-braces', color: '#6366F1' },
  'linked-lists': { name: 'link-variant', color: '#EC4899' },
  'stacks-queues': { name: 'layers', color: '#F59E0B' },
  'sorting-algorithms': { name: 'sort', color: '#14B8A6' },
  'hash-maps-sets': { name: 'magnify', color: '#8B5CF6' },
  'trees-heaps': { name: 'tree', color: '#10B981' },
  'graphs': { name: 'network', color: '#3B82F6' },
  'advanced-techniques': { name: 'flash', color: '#F97316' },
};

const HomeScreen = () => {
  const { user, xp, streakCount, isLoaded, completedLevels, updateStreak } = useUser();
  const router = useRouter();
  const { colors } = useTheme();
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const streakUpdated = updateStreak();
      if (streakUpdated) setShowStreakModal(true);
    }
  }, [isLoaded]);

  const language = 'javascript';
  // Use 'dsa' from quizzes as the main topic source
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

  const isTopicCompleted = (slug: string) => completedLevels.includes(slug);
  
  // Filter topics into two separate lists
  const completedTopics = topics.filter((topic) => isTopicCompleted(slugify(topic.topic)));
  const newTopics = topics.filter((topic) => !isTopicCompleted(slugify(topic.topic)));

  if (!isLoaded) return <View style={styles.loading}><Text>Loading...</Text></View>;

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={[styles.greeting, { color: colors.text }]}>Hello, {user?.name || 'Guest'}</Text>
          <Text style={[styles.subGreeting, { color: colors.text }]}>Let's learn something new today!</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="flash" size={24} color="#6366F1" />
            <Text style={[styles.statValue, { color: colors.text }]}>{xp} XP</Text>
          </View>
          <View style={[styles.statBox, { backgroundColor: colors.card }]}>
            <MaterialCommunityIcons name="fire" size={24} color="#FFD700" />
            <Text style={[styles.statValue, { color: colors.text }]}>{streakCount} Day Streak</Text>
          </View>
        </View>

        {/* Continue Learning - Only show completed topics here */}
        {completedTopics.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Continue Learning</Text>
            {completedTopics.map((topic) => {
              const slug = slugify(topic.topic);
              const iconData = topicIcons[slug] || { name: 'book', color: '#6366F1' };
              return (
                <TouchableOpacity key={`continue-${slug}`} style={[styles.card, { backgroundColor: colors.card, borderColor: '#14B8A6' }]} onPress={() => setSelectedTopic(slug)}>
                  <View style={[styles.iconBox, { backgroundColor: `${iconData.color}20` }]}>
                    <MaterialCommunityIcons name="check-bold" size={24} color={'#14B8A6'} />
                  </View>
                  <View style={styles.textContainer}>
                    <Text style={[styles.cardTitle, { color: colors.text }]}>{topic.topic}</Text>
                    <Text style={[styles.cardSubtitle, { color: colors.text }]}>Module completed. Keep the streak alive!</Text>
                  </View>
                  <MaterialCommunityIcons name="refresh" size={24} color={colors.text} />
                </TouchableOpacity>
              );
            })}
          </>
        )}

        {/* New Topics - Only show topics NOT yet completed (distinct UI from Explore) */}
        <Text style={[styles.sectionTitle, { color: colors.text, marginTop: completedTopics.length > 0 ? 30 : 0 }]}>New Topics</Text>
        {newTopics.map((topic) => {
          const slug = slugify(topic.topic);
          const iconData = topicIcons[slug] || { name: 'book', color: '#6366F1' };
          return (
            <TouchableOpacity key={slug} style={[styles.card, { backgroundColor: colors.card }]} onPress={() => setSelectedTopic(slug)}>
              <View style={[styles.iconBox, { backgroundColor: `${iconData.color}20` }]}>
                <MaterialCommunityIcons name={iconData.name as any} size={24} color={iconData.color} />
              </View>
              <View style={styles.textContainer}>
                <Text style={[styles.cardTitle, { color: colors.text }]}>{topic.topic}</Text>
                <Text style={[styles.cardSubtitle, { color: colors.text }]}>Start learning concepts to earn XP.</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Choice Modal */}
      <Modal transparent visible={selectedTopic !== null} animationType="slide" onRequestClose={() => setSelectedTopic(null)}>
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedTopic(null)}>
          <View style={[styles.bottomSheet, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>What would you like to do?</Text>
            <TouchableOpacity style={[styles.choiceBtn, { backgroundColor: colors.primary }]} onPress={() => handleChoice('study')}>
              <Text style={styles.choiceText}>📚 Study Theory</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.choiceBtn, { backgroundColor: colors.primary }]} onPress={() => handleChoice('quiz')}>
              <Text style={styles.choiceText}>✏️ Start Quiz</Text>
            </TouchableOpacity>
          </View>
        </Pressable>
      </Modal>

      {/* Streak Modal */}
      <Modal transparent visible={showStreakModal} animationType="fade" onRequestClose={() => setShowStreakModal(false)}>
        <Pressable style={styles.modalOverlay} onPress={() => setShowStreakModal(false)}>
          <View style={[styles.streakCard, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>🔥 Daily Streak!</Text>
            <Text style={{ textAlign: 'center', color: colors.text }}>You've maintained a streak of {streakCount} days!</Text>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  scrollContent: { padding: 20, paddingBottom: 100 }, 
  header: { marginBottom: 24, marginTop: 10 },
  greeting: { fontSize: 28, fontWeight: '700' },
  subGreeting: { fontSize: 16, opacity: 0.7 },
  statsContainer: { flexDirection: 'row', gap: 12, marginBottom: 32 },
  statBox: { 
    flex: 1, 
    padding: 16, 
    borderRadius: 16, 
    alignItems: 'center', 
    justifyContent: 'center',
    // Added elevation/shadow for prominence on Home screen
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  statValue: { fontSize: 16, fontWeight: '700', marginTop: 8 },
  sectionTitle: { fontSize: 20, fontWeight: '700', marginBottom: 16 },
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 16, 
    marginBottom: 12,
    borderWidth: 1, // Added border for clarity
    borderColor: '#F0F0F0',
    // Removed the strong shadows found on Explore screen cards for a softer look
  },
  iconBox: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginRight: 16 },
  textContainer: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '600' },
  cardSubtitle: { fontSize: 13, opacity: 0.6 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  bottomSheet: { padding: 24, paddingBottom: 40, borderTopLeftRadius: 24, borderTopRightRadius: 24 },
  streakCard: { margin: 40, padding: 24, borderRadius: 20, alignItems: 'center', alignSelf: 'center', justifyContent: 'center' },
  modalTitle: { fontSize: 20, fontWeight: '700', marginBottom: 20, textAlign: 'center' },
  choiceBtn: { 
    padding: 16, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginBottom: 12,
    shadowColor: '#000', // Added button shadow
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  choiceText: { color: 'white', fontWeight: '700', fontSize: 16 },
});

export default HomeScreen;