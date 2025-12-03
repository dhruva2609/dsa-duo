import { Header } from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { quizzes } from '@/constants/quizzes';
import { slugify } from '@/utils/slugify';
import { useRouter } from 'expo-router';
import { Braces, Code, Cpu, Hash, Layers, Search, Server, Terminal } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

const TOPIC_ICONS: Record<string, any> = {
  'core-concepts-complexity': <Cpu size={24} color={Colors.primary} />,
  'linked-lists':             <Code size={24} color={Colors.primary} />,
  'stacks-queues':            <Layers size={24} color={Colors.primary} />,
  'sorting-algorithms':       <Hash size={24} color={Colors.primary} />,
  'hash-maps-sets':           <Search size={24} color={Colors.primary} />,
  'trees-heaps':              <Server size={24} color={Colors.primary} />,
  'graphs':                   <Terminal size={24} color={Colors.primary} />,
  'advanced-techniques':      <Braces size={24} color={Colors.primary} />,
};

const getDifficulty = (topic: string) => {
  const t = topic.toLowerCase();
  if (t.includes('core') || t.includes('linked')) return 'Easy';
  if (t.includes('tree') || t.includes('graph') || t.includes('advanced')) return 'Hard';
  return 'Medium';
};

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const language = 'javascript';
  const rawTopics = quizzes[language as keyof typeof quizzes]?.dsa || [];

  const allTopics = rawTopics.map(t => ({
    ...t,
    difficulty: getDifficulty(t.topic)
  }));

  const filteredTopics = allTopics.filter(module => {
    const matchesSearch = module.topic.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = activeFilter === 'All' || module.difficulty === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Header title="Library" showBack={false} style={styles.header} />

      <View style={styles.controlsContainer}>
        <View style={styles.searchBar}>
          <Search size={20} color={Colors.textDim} />
          <TextInput
            placeholder="Search topics..."
            placeholderTextColor={Colors.textDim}
            style={styles.input}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {['All', 'Easy', 'Medium', 'Hard'].map((filter) => {
            const isActive = activeFilter === filter;
            return (
              <Pressable 
                key={filter} 
                style={[styles.filterChip, isActive && styles.filterChipActive]}
                onPress={() => setActiveFilter(filter as any)}
              >
                <Text style={[styles.filterText, isActive && styles.filterTextActive]}>{filter}</Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list} showsVerticalScrollIndicator={false}>
        {filteredTopics.map((module) => {
          const slug = slugify(module.topic);
          const icon = TOPIC_ICONS[slug] || <Code size={24} color={Colors.primary} />;
          
          let badgeColor = Colors.primary + '15'; // 15% opacity
          let badgeText = Colors.primary;
          
          if (module.difficulty === 'Hard') { badgeColor = '#FFF5F5'; badgeText = '#E53E3E'; }
          if (module.difficulty === 'Medium') { badgeColor = '#FFFBEB'; badgeText = '#D97706'; }

          return (
            <Pressable 
              key={slug} 
              style={styles.card} 
              onPress={() => router.push(`/quiz/${slug}`)}
            >
              <View style={styles.cardLeft}>
                <View style={styles.iconBox}>{icon}</View>
                <View>
                  <Text style={styles.cardTitle}>{module.topic}</Text>
                  <Text style={styles.cardSubtitle}>{module.questions.length} Concepts</Text>
                </View>
              </View>
              
              <View style={[styles.badge, { backgroundColor: badgeColor }]}>
                <Text style={[styles.badgeText, { color: badgeText }]}>{module.difficulty}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.background, borderBottomWidth: 0 },
  
  controlsContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  searchBar: { 
    flexDirection: 'row', alignItems: 'center', backgroundColor: 'white', 
    paddingHorizontal: 16, height: 50, borderRadius: 16, marginBottom: 16,
    shadowColor: Colors.shadow, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  input: { flex: 1, marginLeft: 12, fontSize: 16, color: Colors.primaryDark },
  
  filterRow: { gap: 12 },
  filterChip: { 
    paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, 
    backgroundColor: 'white', borderWidth: 1, borderColor: 'transparent'
  },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterText: { fontSize: 14, fontWeight: '600', color: Colors.textDim },
  filterTextActive: { color: 'white' },

  list: { paddingHorizontal: 24, paddingBottom: 100 },
  
  card: { 
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    padding: 16, borderRadius: 20, marginBottom: 16, 
    backgroundColor: 'white',
    shadowColor: Colors.shadow, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2
  },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { 
    width: 50, height: 50, borderRadius: 14, 
    backgroundColor: Colors.background, justifyContent: 'center', alignItems: 'center' 
  },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.primaryDark, marginBottom: 4 },
  cardSubtitle: { fontSize: 13, color: Colors.textDim },
  
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700' }
});