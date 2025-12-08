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

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
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
  const [lastActiveDate, setLastActiveDate] = useState<string | null>(null);
  
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loadState = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
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

        if (storedUser) setUser(JSON.parse(storedUser));
        if (storedXp) setXp(parseInt(storedXp));
        if (storedLevels) setCompletedLevels(JSON.parse(storedLevels));
        if (storedHearts) setHearts(parseInt(storedHearts));
        if (storedMistakes) setMistakes(JSON.parse(storedMistakes));
        if (storedAchievements) setAchievements(JSON.parse(storedAchievements));
        
        // IMPORTANT: Parse boolean correctly
        if (storedIsDark !== null) setIsDark(JSON.parse(storedIsDark));
        if (storedNotifications !== null) setNotifications(JSON.parse(storedNotifications));
        if (storedSoundEffects !== null) setSoundEffects(JSON.parse(storedSoundEffects));
        if (storedIsPremium !== null) setIsPremium(JSON.parse(storedIsPremium));
        
        if (storedStreak) setStreakCount(parseInt(storedStreak));
        if (storedLastActive) setLastActiveDate(storedLastActive);

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
      
      AsyncStorage.setItem('user_xp', xp.toString());
      AsyncStorage.setItem('user_levels', JSON.stringify(completedLevels));
      AsyncStorage.setItem('user_hearts', hearts.toString());
      AsyncStorage.setItem('user_mistakes', JSON.stringify(mistakes));
      AsyncStorage.setItem('user_achievements', JSON.stringify(achievements));
      
      // Save Theme & Settings
      AsyncStorage.setItem('user_isDark', JSON.stringify(isDark));
      AsyncStorage.setItem('user_notifications', JSON.stringify(notifications));
      AsyncStorage.setItem('user_soundEffects', JSON.stringify(soundEffects));
      AsyncStorage.setItem('user_isPremium', JSON.stringify(isPremium));
      
      AsyncStorage.setItem('user_streak', streakCount.toString());
      if (lastActiveDate) AsyncStorage.setItem('user_lastActiveDate', lastActiveDate);
    }
  }, [user, xp, completedLevels, hearts, mistakes, achievements, isDark, notifications, soundEffects, isPremium, streakCount, lastActiveDate, isLoaded]);

const signIn = async (userData: User, token: string) => {
  setUser(userData);
  await AsyncStorage.setItem('user', JSON.stringify(userData));
  await AsyncStorage.setItem('user_token', token);
};
  const signOut = async () => {
    setUser(null);
    setHearts(5);
    setXp(0);
    setCompletedLevels([]);
    setMistakes([]);
    setAchievements([]);
    // Optional: Keep theme preference on sign out? Currently resetting.
    setIsDark(false); 
    setStreakCount(0);
    setLastActiveDate(null);
    setIsPremium(false);
    await AsyncStorage.clear();
  };

  const deductHeart = () => !isPremium && setHearts((prev) => Math.max(0, prev - 1));
  const refillHearts = () => setHearts(5);
  const addXp = (amount: number) => setXp((prev) => prev + amount);
  
  const completeLevel = (slug: string) => {
    if (!completedLevels.includes(slug)) {
      setCompletedLevels((prev) => [...prev, slug]);
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
    // We generally don't reset theme preference on progress reset
    await AsyncStorage.removeItem('user_xp');
    await AsyncStorage.removeItem('user_levels');
    await AsyncStorage.removeItem('user_hearts');
    // ... clear other progress keys
  };

  return (
    <UserContext.Provider value={{
      user, signIn, signOut,
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
      streakCount, updateStreak
    }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);