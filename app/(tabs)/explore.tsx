import { Header } from '@/components/Header'; // FIX: Use shared Header component
import { Colors } from '@/constants/Colors';
import { quizzes } from '@/constants/quizzes'; // FIX: Use consolidated data source
import { slugify } from '@/utils/slugify';
import { useRouter } from 'expo-router';
import { Braces, ChevronRight, Code, Hash, Layers, Search } from 'lucide-react-native';
import React, { useState } from 'react';
import { Pressable, ScrollView, StatusBar, StyleSheet, Text, TextInput, View } from 'react-native';

const topicMetadata: Record<string, { icon: React.ReactNode; color: string }> = {
  'core-concepts-complexity': { icon: <Hash size={20} color="#3F20F0" />, color: '#F6F5FF' },
  'linked-lists': { icon: <Code size={20} color="#FF5C95" />, color: '#FFF0F5' },
  'stacks-queues': { icon: <Layers size={20} color="#FFB800" />, color: '#FFF9E6' },
  'sorting-algorithms': { icon: <Braces size={20} color="#00C48C" />, color: '#E6FAF4' },
  'hash-maps-sets': { icon: <Search size={20} color="#7D5FFF" />, color: '#F2F0FF' },
  'trees-heaps': { icon: <Hash size={20} color="#FF9F43" />, color: '#FFF5ED' },
  'graphs': { icon: <Code size={20} color="#3F20F0" />, color: '#F6F5FF' },
  'advanced-techniques': { icon: <Layers size={20} color="#FF5C95" />, color: '#FFF0F5' },
};

export default function ExploreScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<'All' | 'Easy' | 'Medium' | 'Hard'>('All');

  const language = 'javascript';
  // FIX: Fetch data from the new, reliable consolidated source
  const allTopics = quizzes[language as keyof typeof quizzes]?.dsa || []; 

  const filteredTopics = allTopics.filter(module => {
    const matchesSearch = module.topic.toLowerCase().includes(searchQuery.toLowerCase());
    // FIX: module.difficulty is now correctly available
    const matchesFilter = activeFilter === 'All' || module.difficulty === activeFilter; 
    return matchesSearch && matchesFilter;
  });

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* FIX: Replaced manual large header with shared Header component */}
      <Header title="Explore Topics" showBack={false} style={{paddingBottom: 0}} />

      <View style={styles.searchContainer}>
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
        
        {/* FILTERS */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterRow} contentContainerStyle={{gap: 8, paddingRight: 20}}>
          {['All', 'Easy', 'Medium', 'Hard'].map((filter) => (
            <Pressable 
              key={filter} 
              style={[styles.filterChip, activeFilter === filter && styles.filterChipActive]}
              onPress={() => setActiveFilter(filter as any)}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.filterTextActive]}>{filter}</Text>
            </Pressable>
          ))}
        </ScrollView>
      </View>

      <ScrollView contentContainerStyle={styles.list}>
        <Text style={styles.sectionTitle}>
          {searchQuery ? `Search Results` : `${activeFilter} Topics`}
        </Text>
        {filteredTopics.map((module) => {
          const slug = slugify(module.topic);
          const metadata = topicMetadata[slug] || { icon: <Code size={20} color={Colors.textDim} />, color: '#F0F0F0' };
          const difficulty = module.difficulty || 'Medium';
          
          return (
            <Pressable 
              key={slug} 
              style={[
                styles.card, 
                // UI FIX: Apply the unique metadata color for visual distinction
                { backgroundColor: metadata.color } 
              ]} 
              onPress={() => router.push(`/quiz/${slug}`)}
            >
              {/* Icon box is explicitly white for contrast */}
              <View style={[styles.iconBox, { backgroundColor: 'white' }]}>
                {metadata.icon}
              </View>
              <View style={styles.info}>
                <Text style={styles.cardTitle}>{module.topic}</Text>
                <View style={{flexDirection: 'row', gap: 8, marginTop: 4}}>
                   <Text style={styles.cardSubtitle}>{module.questions.length} Lessons</Text>
                   {/* Updated difficulty badge color logic for better theme adherence */}
                   <View style={[styles.badge, difficulty === 'Easy' ? {backgroundColor: '#E7FFDB'} : difficulty === 'Hard' ? {backgroundColor: Colors.errorDark + '20'} : {backgroundColor: '#FFF9E6'}]}>
                      <Text style={{fontSize: 10, fontWeight: '700', color: Colors.text}}>{difficulty}</Text>
                   </View>
                </View>
              </View>
              <ChevronRight size={20} color={Colors.textDim} />
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  // Removed manual header/title styles
  searchContainer: { paddingHorizontal: 24, marginVertical: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F2F2F7', paddingHorizontal: 16, height: 50, borderRadius: 16, marginBottom: 12 },
  input: { flex: 1, marginLeft: 10, fontSize: 16, color: Colors.text, height: '100%' },
  filterRow: { flexDirection: 'row' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: 'white', borderWidth: 1, borderColor: '#E5E5E5' },
  filterChipActive: { backgroundColor: Colors.text, borderColor: Colors.text },
  filterText: { fontWeight: '600', color: Colors.text },
  filterTextActive: { color: 'white' },
  list: { paddingHorizontal: 24, paddingBottom: 100 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: Colors.text, marginBottom: 16 },
  // Distinct card style for Explore screen
  card: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 12, 
    borderWidth: 2, 
    borderColor: '#E0EEED', // Added thicker border for contrast
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    shadowOffset: { width: 0, height: 4 }, 
    shadowRadius: 8,
  },
  iconBox: { width: 48, height: 48, borderRadius: 14, justifyContent: 'center', alignItems: 'center', marginRight: 16, backgroundColor: 'white' },
  info: { flex: 1 },
  cardTitle: { fontSize: 16, fontWeight: '700', color: Colors.text },
  cardSubtitle: { fontSize: 13, color: Colors.textDim },
  badge: { paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4 },
});