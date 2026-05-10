const tintColorLight = '#8B5CF6';
const tintColorDark = '#8B5CF6';

export const Colors = {
  light: {
    primary: '#8B5CF6',       // Electric Violet
    primaryDark: '#7C3AED',
    primaryLight: '#C4B5FD',
    secondary: '#10B981',     // Emerald
    accent: '#F43F5E',        // Rose Red
    background: '#F8FAFC',    // Light Slate
    card: '#FFFFFF',          
    text: '#0F172A',          // Deep Midnight
    textDim: '#64748B',       
    border: '#E2E8F0',        
    icon: '#64748B',          
    success: '#10B981',       
    error: '#F43F5E',         
    warning: '#F59E0B',       
    shadow: 'rgba(139, 92, 246, 0.15)',
    codeBg: '#F1F5F9',        
    surface: 'rgba(255, 255, 255, 0.8)', // Glassmorphism
    tint: tintColorLight,
    tabIconDefault: '#64748B',
    tabIconSelected: tintColorLight,
  },
  dark: {
    primary: '#8B5CF6',       // Electric Violet
    primaryDark: '#7C3AED',
    primaryLight: '#C4B5FD',
    secondary: '#10B981',     // Emerald
    accent: '#F43F5E',        // Rose Red
    background: '#0F172A',    // Deep Midnight
    card: '#1E293B',          // Slate 800
    text: '#F8FAFC',          
    textDim: '#94A3B8',       
    border: '#334155',        
    icon: '#94A3B8',          
    success: '#10B981',       
    error: '#F43F5E',         
    warning: '#F59E0B',       
    shadow: 'rgba(0,0,0,0.5)',
    codeBg: '#0F172A',        
    surface: 'rgba(30, 41, 59, 0.6)', // Glassmorphism
    tint: tintColorDark,
    tabIconDefault: '#94A3B8',
    tabIconSelected: tintColorDark,
  },
  // Global Fallbacks
  primary: '#8B5CF6',
  error: '#F43F5E',
  success: '#10B981',
  warning: '#F59E0B',
  text: '#0F172A',
  textDim: '#64748B',
  border: '#E2E8F0',
  background: '#F8FAFC'
};