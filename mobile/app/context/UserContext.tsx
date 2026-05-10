import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { createContext, ReactNode, useContext, useEffect, useState } from 'react';

type User = {
  id: string;
  name: string;
  email: string;
};

export type QuestionData = {
  q: string;
  options: string[];
  answer: string;
  explanation: string;
};

export type UserContextType = {
  user: User | null;
  token: string | null;
  hearts: number;

  xp: number;
  completedLevels: string[];
  mistakes: QuestionData[];
  achievements: string[];
  isLoaded: boolean;
  isDark: boolean;
  notifications: boolean;
  soundEffects: boolean;
  isPremium: boolean;
  streakCount: number;
  selectedLanguage: string;
  setSelectedLanguage: (lang: string) => void;
  updateStreak: () => boolean;
  signIn: (user: User, token: string) => void;

  signOut: () => void;
  deductHeart: () => void;
  addXp: (amount: number) => void;
  completeLevel: (slug: string) => void;
  addMistake: (question: QuestionData) => void;
  removeMistake: (questionQ: string) => void;
  unlockAchievement: (id: string) => void;
  refillHearts: () => void;
  resetProgress: () => void;
  toggleTheme: () => void;
  toggleNotifications: () => void;
  toggleSoundEffects: () => void;
  togglePremium: () => void;
};

const UserContext = createContext<UserContextType>({} as UserContextType);

// API Base URL - Update this for physical devices
const API_URL = 'http://localhost:5000/api';

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [hearts, setHearts] = useState(5);
  const [xp, setXp] = useState(0);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [mistakes, setMistakes] = useState<QuestionData[]>([]);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [isDark, setIsDark] = useState(false);
  const [notifications, setNotifications] = useState(true);
  const [soundEffects, setSoundEffects] = useState(true);
  
  const [isPremium, setIsPremium] = useState(false);
  const [streakCount, setStreakCount] = useState(0);
  const [selectedLanguage, setSelectedLanguage] = useState('javascript');
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('user_token');
        const storedUser = await AsyncStorage.getItem('user');
        
        if (storedToken) {
          setToken(storedToken);
          // Try to get fresh profile from backend
          try {
            const res = await fetch(`${API_URL}/user/profile`, {
              headers: { 'Authorization': `Bearer ${storedToken}` }
            });
            if (res.ok) {
              const profile = await res.json();
              setUser({ id: profile.id, name: profile.name, email: profile.email });
              setXp(profile.xp);
              setHearts(profile.hearts);
              setStreakCount(profile.streak);
              setIsPremium(profile.isPremium);
            } else if (storedUser) {
              setUser(JSON.parse(storedUser));
            }
          } catch (err) {
            if (storedUser) setUser(JSON.parse(storedUser));
          }
        }

        const storedXp = await AsyncStorage.getItem('user_xp');
        const storedLevels = await AsyncStorage.getItem('user_levels');
        const storedHearts = await AsyncStorage.getItem('user_hearts');
        const storedMistakes = await AsyncStorage.getItem('user_mistakes');
        const storedAchievements = await AsyncStorage.getItem('user_achievements');
        const storedIsDark = await AsyncStorage.getItem('user_isDark');
        const storedNotifications = await AsyncStorage.getItem('user_notifications');
        const storedSoundEffects = await AsyncStorage.getItem('user_soundEffects');
        const storedIsPremium = await AsyncStorage.getItem('user_isPremium');
        const storedStreak = await AsyncStorage.getItem('user_streak');
        const storedLastActive = await AsyncStorage.getItem('user_lastActiveDate');
        const storedLanguage = await AsyncStorage.getItem('user_language');

        if (!user && storedUser) setUser(JSON.parse(storedUser));
        if (storedXp && !xp) setXp(parseInt(storedXp));
        if (storedLevels) setCompletedLevels(JSON.parse(storedLevels));
        if (storedHearts && !hearts) setHearts(parseInt(storedHearts));
        if (storedMistakes) setMistakes(JSON.parse(storedMistakes));
        if (storedAchievements) setAchievements(JSON.parse(storedAchievements));
        
        if (storedIsDark !== null) setIsDark(JSON.parse(storedIsDark));
        if (storedNotifications !== null) setNotifications(JSON.parse(storedNotifications));
        if (storedSoundEffects !== null) setSoundEffects(JSON.parse(storedSoundEffects));
        if (storedIsPremium !== null && !isPremium) setIsPremium(JSON.parse(storedIsPremium));
        
        if (storedStreak && !streakCount) setStreakCount(parseInt(storedStreak));
        if (storedLastActive) setLastActiveDate(storedLastActive);
        if (storedLanguage) setSelectedLanguage(storedLanguage);

      } catch (e) {
        console.error("Failed to load state from storage", e);
      } finally {
        setIsLoaded(true);
      }
    };
    loadState();
  }, []);

  useEffect(() => {
    if (isLoaded) {
      if (user) AsyncStorage.setItem('user', JSON.stringify(user));
      else AsyncStorage.removeItem('user');
      
      if (token) AsyncStorage.setItem('user_token', token);
      else AsyncStorage.removeItem('user_token');

      AsyncStorage.setItem('user_xp', xp.toString());
      AsyncStorage.setItem('user_levels', JSON.stringify(completedLevels));
      AsyncStorage.setItem('user_hearts', hearts.toString());
      AsyncStorage.setItem('user_mistakes', JSON.stringify(mistakes));
      AsyncStorage.setItem('user_achievements', JSON.stringify(achievements));
      
      AsyncStorage.setItem('user_isDark', JSON.stringify(isDark));
      AsyncStorage.setItem('user_notifications', JSON.stringify(notifications));
      AsyncStorage.setItem('user_soundEffects', JSON.stringify(soundEffects));
      AsyncStorage.setItem('user_isPremium', JSON.stringify(isPremium));
      
      AsyncStorage.setItem('user_streak', streakCount.toString());
      AsyncStorage.setItem('user_language', selectedLanguage);
      if (lastActiveDate) AsyncStorage.setItem('user_lastActiveDate', lastActiveDate);
    }
  }, [user, token, xp, completedLevels, hearts, mistakes, achievements, isDark, notifications, soundEffects, isPremium, streakCount, selectedLanguage, lastActiveDate, isLoaded]);

  const signIn = async (userData: User, userToken: string) => {
    setUser(userData);
    setToken(userToken);
    await AsyncStorage.setItem('user', JSON.stringify(userData));
    await AsyncStorage.setItem('user_token', userToken);
    
    // Sync other stats if they exist on user object from backend
    if ((userData as any).xp !== undefined) setXp((userData as any).xp);
    if ((userData as any).hearts !== undefined) setHearts((userData as any).hearts);
  };

  const signOut = async () => {
    setUser(null);
    setToken(null);
    setHearts(5);
    setXp(0);
    setCompletedLevels([]);
    setMistakes([]);
    setAchievements([]);
    setIsDark(false); 
    setStreakCount(0);
    setLastActiveDate(null);
    setIsPremium(false);
    await AsyncStorage.clear();
  };

  const deductHeart = async () => {
    if (isPremium) return;
    setHearts((prev) => Math.max(0, prev - 1));
    
    if (token) {
      try {
        await fetch(`${API_URL}/user/deduct-heart`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) { console.error("Failed to sync heart deduction", err); }
    }
  };

  const refillHearts = () => setHearts(5);

  const addXp = async (amount: number) => {
    setXp((prev) => prev + amount);
    if (token) {
      try {
        await fetch(`${API_URL}/user/update-xp`, {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ xp: amount })
        });
      } catch (err) { console.error("Failed to sync XP", err); }
    }
  };
  
  const completeLevel = async (slug: string) => {
    if (!completedLevels.includes(slug)) {
      setCompletedLevels((prev) => [...prev, slug]);
      if (token) {
        try {
          await fetch(`${API_URL}/quiz/complete`, {
            method: 'POST',
            headers: { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify({ slug })
          });
        } catch (err) { console.error("Failed to sync completion", err); }
      }
    }
  };

  const addMistake = (question: QuestionData) => {
    if (!mistakes.find(m => m.q === question.q)) {
      setMistakes(prev => [...prev, question]);
    }
  };

  const removeMistake = (questionQ: string) => {
    setMistakes(prev => prev.filter(m => m.q !== questionQ));
  };

  const unlockAchievement = (id: string) => {
    if (!achievements.includes(id)) {
      setAchievements(prev => [...prev, id]);
    }
  };

  const toggleTheme = () => setIsDark(prev => !prev);
  const toggleNotifications = () => setNotifications(prev => !prev);
  const toggleSoundEffects = () => setSoundEffects(prev => !prev);
  const togglePremium = () => setIsPremium(prev => !prev);

  const updateStreak = () => {
    const today = new Date().toDateString();
    if (lastActiveDate === today) return false;

    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    let streakUpdated = false;

    if (lastActiveDate === yesterday.toDateString()) {
      setStreakCount(prev => prev + 1);
      streakUpdated = true;
    } else {
      setStreakCount(1);
      streakUpdated = true;
    }

    setLastActiveDate(today);
    return streakUpdated;
  };

  const resetProgress = async () => {
    setHearts(5);
    setXp(0);
    setCompletedLevels([]);
    setMistakes([]);
    setAchievements([]);
    setStreakCount(0);
    setLastActiveDate(null);
    if (token) {
      try {
        await fetch(`${API_URL}/user/reset-progress`, {
          method: 'POST',
          headers: { 'Authorization': `Bearer ${token}` }
        });
      } catch (err) { console.error("Failed to sync reset", err); }
    }
    await AsyncStorage.multiRemove(['user_xp', 'user_levels', 'user_hearts', 'user_mistakes', 'user_achievements', 'user_streak', 'user_lastActiveDate']);
  };


  return (
    <UserContext.Provider value={{
      user, token, signIn, signOut,
      hearts, deductHeart, refillHearts,

      xp, addXp,
      completedLevels, completeLevel,
      mistakes, addMistake, removeMistake,
      achievements, unlockAchievement,
      resetProgress, isLoaded,
      isDark, toggleTheme,
      notifications, toggleNotifications,
      soundEffects, toggleSoundEffects, 
      isPremium, togglePremium,
      streakCount, updateStreak,
      selectedLanguage, setSelectedLanguage
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);