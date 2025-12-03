export const Colors = {
  light: {
    primary: '#4318FF',       // Vibrant Indigo
    primaryDark: '#2B3674',   // Deep Navy
    background: '#F4F7FE',    // Light Grey-Blue
    card: '#FFFFFF',          // White
    text: '#1B2559',          // Dark Navy
    textDim: '#A3AED0',       // Cool Grey
    border: '#E0E5F2',        // Subtle Border
    icon: '#A3AED0',          // Default Icon Color
    success: '#05CD99',       // Mint Green
    error: '#EE5D50',         // Soft Red
    warning: '#FFCE20',       // Amber
    shadow: '#7090B0',        // Soft Blue-Grey Shadow
    codeBg: '#F4F7FE',        // Code block background
  },
  dark: {
    primary: '#7551FF',       // Lighter Indigo for dark contrast
    primaryDark: '#FFFFFF',   // White Headings
    background: '#0B1437',    // Deep Navy (Image 1 Theme)
    card: '#111C44',          // Card Navy
    text: '#E0E5F2',          // Light Grey Text
    textDim: '#8F9BBA',       // Dimmed Blue-Grey
    border: '#2B3674',        // Dark Blue Border
    icon: '#8F9BBA',          // Default Icon Color
    success: '#05CD99',       // Mint Green
    error: '#EE5D50',         // Soft Red
    warning: '#FFCE20',       // Amber
    shadow: '#000000',        // Black Shadow
    codeBg: '#0B1437',        // Code block background
  },
  // Global Fallbacks (Required for TS & Static Styles)
  primary: '#4318FF',
  error: '#EE5D50',
  success: '#05CD99',
  warning: '#FFCE20', // Fixed: Added missing warning property
  text: '#1B2559',
  textDim: '#A3AED0',
  border: '#E0E5F2',
  background: '#F4F7FE'
};