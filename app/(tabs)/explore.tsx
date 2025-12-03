import { useUser } from '@/app/context/UserContext';
import { Header } from '@/components/Header';
import { Colors } from '@/constants/Colors';
import { quizzes } from '@/constants/quizzes';
import { slugify } from '@/utils/slugify';
import { useRouter } from 'expo-router';
import { Code, Cpu, Hash, Layers, Search, Server, Terminal } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

const getDifficulty = (topic: string) => {
  const t = topic.toLowerCase();
  if (t.includes('core') || t.includes('linked')) return 'Easy';
  if (t.includes('tree') || t.includes('graph') || t.includes('advanced')) return 'Hard';
  return 'Medium';
};

export default function ExploreScreen() {
  const router = useRouter();
  const { isDark } = useUser();
  const theme = isDark ? Colors.dark : Colors.light;
  
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const rawTopics = quizzes['javascript']?.dsa || [];
  const allTopics = rawTopics.map(t => ({ ...t, difficulty: getDifficulty(t.topic) }));
  const filteredTopics = allTopics.filter(m => 
    m.topic.toLowerCase().includes(searchQuery.toLowerCase()) && 
    (activeFilter === 'All' || m.difficulty === activeFilter)
  );

  const getIcon = (slug: string) => {
    const size = 22; const color = theme.primary;
    if (slug.includes('core')) return <Cpu size={size} color={color} />;
    if (slug.includes('linked')) return <Code size={size} color={color} />;
    if (slug.includes('stack')) return <Layers size={size} color={color} />;
    if (slug.includes('sort')) return <Hash size={size} color={color} />;
    if (slug.includes('graph')) return <Terminal size={size} color={color} />;
    return <Server size={size} color={color} />;
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar barStyle={isDark ? "light-content" : "dark-content"} />
      <Header title="Library" showBack={false} style={{backgroundColor: theme.background, borderBottomWidth: 0}} />

      <View style={styles.controlsContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Search size={20} color={theme.textDim} />
          <TextInput
            placeholder="Search modules..."
            placeholderTextColor={theme.textDim}
            style={[styles.input, { color: theme.text }]}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterRow}>
          {['All', 'Easy', 'Medium', 'Hard'].map((filter) => (
            <Pressable 
              key={filter} 
              style={[
                styles.filterChip, 
                { backgroundColor: theme.card, borderColor: theme.border },
                activeFilter === filter && { backgroundColor: theme.primary, borderColor: theme.primary }
              ]}
              onPress={() => setActiveFilter(filter as any)}
            >
              <Text style={[styles.filterText, { color: theme.textDim }, activeFilter === filter && { color: 'white' }]}>{filter}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        {filteredTopics.map((module) => {
          const slug = slugify(module.topic);
          let diffColor = isDark ? '#1B2559' : '#F1F5F9';
          let diffText = theme.textDim;
          
          if (module.difficulty === 'Easy') { diffColor = isDark ? 'rgba(5, 205, 153, 0.2)' : '#DCFCE7'; diffText = '#05CD99'; }
          if (module.difficulty === 'Hard') { diffColor = isDark ? 'rgba(238, 93, 80, 0.2)' : '#FEE2E2'; diffText = '#EE5D50'; }

          return (
            <Pressable 
              key={slug} 
              style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border, shadowColor: theme.shadow }]} 
              onPress={() => router.push(`/quiz/${slug}`)}
            >
              <View style={styles.cardLeft}>
                <View style={[styles.iconBox, { backgroundColor: theme.background }]}>
                  {getIcon(slug)}
                </View>
                <View>
                  <Text style={[styles.cardTitle, { color: theme.text }]}>{module.topic}</Text>
                  <Text style={[styles.cardSubtitle, { color: theme.textDim }]}>{module.questions.length} Concepts</Text>
                </View>
              </View>
              
              <View style={[styles.badge, { backgroundColor: diffColor }]}>
                <Text style={[styles.badgeText, { color: diffText }]}>{module.difficulty}</Text>
              </View>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  controlsContainer: { paddingHorizontal: 24, paddingBottom: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, height: 50, borderRadius: 16, marginBottom: 16, borderWidth: 1, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  input: { flex: 1, marginLeft: 12, fontSize: 16, fontWeight: '500' },
  filterRow: { gap: 12 },
  filterChip: { paddingHorizontal: 20, paddingVertical: 10, borderRadius: 12, borderWidth: 1 },
  filterText: { fontSize: 14, fontWeight: '600' },
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  card: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, borderRadius: 20, marginBottom: 16, borderWidth: 1, shadowOpacity: 0.05, shadowRadius: 10, elevation: 2 },
  cardLeft: { flexDirection: 'row', alignItems: 'center', gap: 16 },
  iconBox: { width: 50, height: 50, borderRadius: 14, justifyContent: 'center', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', marginBottom: 4 },
  cardSubtitle: { fontSize: 13 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  badgeText: { fontSize: 11, fontWeight: '700' }
});