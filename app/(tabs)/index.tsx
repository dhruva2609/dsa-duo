import { useUser } from '@/app/context/UserContext';
import { quizzes } from '@/constants/quizzes';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useTheme } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

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
  const { user, xp, hearts, isPremium, updateStreak, streakCount, isLoaded, completedLevels } = useUser();
  const router = useRouter();
  const { colors } = useTheme();
  const [showStreakModal, setShowStreakModal] = useState(false);
  const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      const streakUpdated = updateStreak();
      if (streakUpdated) {
        setShowStreakModal(true);
      }
    }
  }, [isLoaded, updateStreak]);

  const language = 'javascript';
  const topics = (quizzes[language as keyof typeof quizzes]?.dsa ?? []) as { topic: string }[];

  const handleTopicPress = (topicSlug: string) => {
    setSelectedTopic(topicSlug);
  };

  const handleChoice = (choice: 'study' | 'quiz') => {
    if (selectedTopic) {
      if (choice === 'study') {
        router.push({
          pathname: '/learn/[id]',
          params: { id: selectedTopic, topic: selectedTopic },
        });
      } else {
        router.push({
          pathname: '/quiz/[id]',
          params: { id: selectedTopic, topic: selectedTopic },
        });
      }
    }
    setSelectedTopic(null);
  };

  const getTopicSlug = (topicName: string) =>
    topicName.toLowerCase().replace(/ & /g, '-').replace(/ /g, '-');

  const isTopicCompleted = (slug: string) => completedLevels.includes(slug);

  if (!isLoaded) {
    return (
      <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <Text style={{ color: colors.text, fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
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
            <MaterialCommunityIcons name="star" size={24} color="#FFD700" />
            <Text style={[styles.statValue, { color: colors.text }]}>{streakCount}</Text>
          </View>
        </View>

        {/* Continue Learning Section */}
        {completedLevels.length > 0 && (
          <>
            <Text style={[styles.sectionTitle, { color: colors.text }]}>Continue Learning</Text>
            {topics
              .filter((topic) => isTopicCompleted(getTopicSlug(topic.topic)))
              .map((topic) => {
                const slug = getTopicSlug(topic.topic);
                const iconData = topicIcons[slug] || { name: 'book', color: '#6366F1' };
                return (
                  <TouchableOpacity
                    key={`continue-${topic.topic}`}
                    style={[styles.continueItem, { backgroundColor: colors.card }]}
                    onPress={() => handleTopicPress(slug)}
                  >
                    <View style={[styles.iconBox, { backgroundColor: `${iconData.color}20` }]}>
                      <MaterialCommunityIcons name={iconData.name as any} size={24} color={iconData.color} />
                    </View>
                    <View style={styles.continueTextContainer}>
                      <Text style={[styles.continueTitle, { color: colors.text }]}>{topic.topic}</Text>
                      <Text style={[styles.continueSubtitle, { color: colors.text }]}>You are on a roll!</Text>
                    </View>
                    <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />
                  </TouchableOpacity>
                );
              })}
          </>
        )}

        {/* All Topics Section */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>All Topics</Text>
        {topics.map((topic) => {
          const slug = getTopicSlug(topic.topic);
          const iconData = topicIcons[slug] || { name: 'book', color: '#6366F1' };
          const lessonCount = 5; // Default value from the design

          return (
            <TouchableOpacity
              key={topic.topic}
              style={[styles.topicItem, { backgroundColor: colors.card }]}
              onPress={() => handleTopicPress(slug)}
            >
              <View style={[styles.iconBox, { backgroundColor: `${iconData.color}20` }]}>
                <MaterialCommunityIcons name={iconData.name as any} size={24} color={iconData.color} />
              </View>
              <View style={styles.topicTextContainer}>
                <Text style={[styles.topicTitle, { color: colors.text }]}>{topic.topic}</Text>
                <Text style={[styles.topicSubtitle, { color: colors.text }]}>{lessonCount} Lessons</Text>
              </View>
              <MaterialCommunityIcons name="chevron-right" size={24} color={colors.text} />
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom Navigation Bar */}
      <View style={[styles.bottomBar, { backgroundColor: colors.card, borderTopColor: colors.border }]}
      accessible
      accessibilityRole="tablist"
      >
        <TouchableOpacity style={styles.navItem} onPress={() => router.push({ pathname: '/(tabs)' })} accessibilityRole="button" accessibilityLabel="Learn tab">
          <View style={[styles.navIcon, { backgroundColor: colors.background }]}> 
            <MaterialCommunityIcons name="book-open-variant" size={22} color={colors.primary} />
          </View>
          <Text style={[styles.navLabel, { color: colors.primary }]}>Learn</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push({ pathname: '/(tabs)/explore' })} accessibilityRole="button" accessibilityLabel="Explore tab">
          <View style={styles.navIcon}> 
            <MaterialCommunityIcons name="magnify" size={22} color={colors.text} />
          </View>
          <Text style={[styles.navLabel, { color: colors.text }]}>Explore</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.navItem} onPress={() => router.push({ pathname: '/(tabs)/profile' })} accessibilityRole="button" accessibilityLabel="Profile tab">
          <View style={styles.navIcon}> 
            <MaterialCommunityIcons name="account" size={22} color={colors.text} />
          </View>
          <Text style={[styles.navLabel, { color: colors.text }]}>Profile</Text>
        </TouchableOpacity>
      </View>

      {/* Streak Modal */}
      <Modal
        transparent={true}
        visible={showStreakModal}
        animationType="fade"
        onRequestClose={() => setShowStreakModal(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowStreakModal(false)}>
          <View style={[styles.modalContent, { backgroundColor: colors.card }]}>
            <Text style={[styles.modalTitle, { color: colors.primary }]}>🔥 Daily Streak!</Text>
            <Text style={[styles.modalText, { color: colors.text }]}>You've maintained a streak of {streakCount} days. Keep it up!</Text>
          </View>
        </Pressable>
      </Modal>

      {/* Topic Choice Modal */}
      <Modal
        transparent={true}
        visible={selectedTopic !== null}
        animationType="slide"
        onRequestClose={() => setSelectedTopic(null)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setSelectedTopic(null)}>
          <View style={[styles.bottomSheet, { backgroundColor: colors.card }]}>
            <View style={styles.bottomSheetContent}>
              <Text style={[styles.modalTitle, { color: colors.primary, marginBottom: 20, textAlign: 'center' }]}>What would you like to do?</Text>
              <TouchableOpacity style={[styles.choiceButton, { backgroundColor: colors.primary }]} onPress={() => handleChoice('study')}>
                <Text style={styles.choiceText}>📚 Study Theory</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.choiceButton, { backgroundColor: colors.primary }]} onPress={() => handleChoice('quiz')}>
                <Text style={styles.choiceText}>✏️ Start Quiz</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  greeting: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  subGreeting: {
    fontSize: 16,
    fontWeight: '400',
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
    gap: 12,
  },
  statBox: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    marginTop: 8,
  },
  continueItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  topicItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  iconBox: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  continueTextContainer: {
    flex: 1,
  },
  topicTextContainer: {
    flex: 1,
  },
  continueTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  continueSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.7,
  },
  topicTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  topicSubtitle: {
    fontSize: 13,
    fontWeight: '400',
    opacity: 0.7,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    padding: 24,
    borderRadius: 16,
    width: '100%',
    maxWidth: 300,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
  },
  modalText: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 24,
    paddingBottom: 32,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 10,
  },
  bottomSheetContent: {
    width: '100%',
  },
  choiceButton: {
    width: '100%',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginVertical: 8,
    flexDirection: 'row',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  choiceText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 84,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingBottom: 12,
    borderTopWidth: 1,
  },
  navItem: { alignItems: 'center', justifyContent: 'center', width: 100 },
  navIcon: { width: 48, height: 48, borderRadius: 12, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  navLabel: { fontSize: 12, fontWeight: '600' },
});

export default HomeScreen;
// The setShowStreakModal function is already defined via useState in the HomeScreen component.
// You do not need to implement it separately here.
// Remove this function to avoid conflicts and errors.
