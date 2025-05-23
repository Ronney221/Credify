const tintColorLight = '#007AFF'; // Our primary color
const tintColorDark = '#FFFFFF';  // A common dark mode tint

export const Colors = {
  light: {
    text: '#1C1C1E',
    background: '#F0F2F5', // This will be our app's main background
    tint: tintColorLight,
    icon: '#687076', // Example icon color
    tabIconDefault: '#ccc',
    tabIconSelected: tintColorLight,
    // Application-specific colors within the light theme
    primary: tintColorLight,
    accent: '#34C759',
    textSecondary: '#666666',
    cardBackground: '#FFFFFF', // Specific background for cards
    warning: '#FF9500',
    pending: '#FFCC00',
    error: '#FF3B30',
    disabledText: '#AEAEB2',
    disabledBackground: '#E5E5EA',
    borderLight: '#DCDCDC',
    progressBarTrack: '#E9ECEF',
    streakBronze: '#CD7F32',
    streakSilver: '#C0C0C0',
    streakGold: '#FFD700',
    coldStreakIcon: '#5CACEE',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    redeemButtonDefault: tintColorLight,
    redeemButtonDisabled: '#6c757d',
    coldStreakBackground: '#e0f7fa', // A light cyan/blue
    textOnColdStreakBackground: '#00796b', // A darker teal for text
  },
  dark: {
    text: '#FFFFFF',
    background: '#121212', // App's main background for dark mode
    tint: tintColorDark,
    icon: '#A0A0A0',
    tabIconDefault: '#555',
    tabIconSelected: tintColorDark,
    // Application-specific colors within the dark theme
    primary: tintColorLight, // Or a different blue for dark mode, e.g., a lighter shade
    accent: '#34C759',
    textSecondary: '#A0A0A0',
    cardBackground: '#1E1E1E', // Specific background for cards in dark mode
    warning: '#FF9500',
    pending: '#FFCC00',
    error: '#FF6B6B',
    disabledText: '#555555',
    disabledBackground: '#333333',
    borderLight: '#444444',
    progressBarTrack: '#333333',
    streakBronze: '#CD7F32',
    streakSilver: '#C0C0C0',
    streakGold: '#FFD700',
    coldStreakIcon: '#5CACEE',
    textOnPrimary: '#FFFFFF',
    textOnAccent: '#FFFFFF',
    redeemButtonDefault: tintColorLight,
    redeemButtonDisabled: '#4D4D4D',
  },
}; 