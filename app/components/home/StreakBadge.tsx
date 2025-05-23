import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors'; // Uppercase filename

interface StreakBadgeProps {
  streakCount: number;
  coldStreakCount?: number; // Added to handle cold streaks
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streakCount, coldStreakCount }) => {
  if (coldStreakCount && coldStreakCount > 0) {
    return (
      <View style={[styles.badgeContainer, styles.badgeColdStreak]}>
        <Text style={styles.emojiText}>🥶</Text>
        <Text style={[styles.streakCountTextBase, styles.streakCountTextColdStreak]}>{coldStreakCount}</Text>
      </View>
    );
  }

  if (streakCount <= 0) {
    return null;
  }

  let emoji = '🔥';
  let badgeStyle = styles.badgeDefault;
  let textStyle = styles.streakCountTextDefault;

  if (streakCount >= 12) {
    emoji = '🏆'; // Gold
    badgeStyle = styles.badgeGold;
    textStyle = styles.streakCountTextGold;
  } else if (streakCount >= 6) {
    emoji = '🥈'; // Silver
    badgeStyle = styles.badgeSilver;
    // Assuming silver uses default text color or define streakCountTextSilver
  } else if (streakCount >= 3) {
    emoji = '🥉'; // Bronze
    badgeStyle = styles.badgeBronze;
    // Assuming bronze uses default text color or define streakCountTextBronze
  }

  return (
    <View style={[styles.badgeContainer, badgeStyle]}>
      <Text style={styles.emojiText}>{emoji}</Text>
      <Text style={[styles.streakCountTextBase, textStyle]}>{streakCount}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badgeContainer: { // Base container for all badges
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    marginLeft: 6, // Space from perk name
  },
  badgeDefault: { // For fire emoji (1-2 streaks)
    backgroundColor: Colors.light.warning, // Using warning color (orange/yellow) for fire
  },
  badgeBronze: {
    backgroundColor: Colors.light.streakBronze,
  },
  badgeSilver: {
    backgroundColor: Colors.light.streakSilver,
  },
  badgeGold: {
    backgroundColor: Colors.light.streakGold,
  },
  badgeColdStreak: { // Style for cold streak badge
    backgroundColor: Colors.light.coldStreakBackground, // Define this color in Colors.ts
  },
  emojiText: {
    fontSize: 12,
    marginRight: 3,
  },
  streakCountTextBase: { // Base style for all streak counts
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakCountTextDefault: { // For fire emoji text
    color: Colors.light.textOnPrimary, // Assuming warning bg is dark enough for white text
  },
  streakCountTextGold: {
    color: Colors.light.text, // Darker text for light gold background
  },
  streakCountTextColdStreak: { // Style for cold streak count text
    color: Colors.light.textOnColdStreakBackground, // Define this color in Colors.ts
  },
});

export default StreakBadge; 