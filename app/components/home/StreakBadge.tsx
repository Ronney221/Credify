import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors'; // Uppercase filename

interface StreakBadgeProps {
  streakCount: number;
}

const StreakBadge: React.FC<StreakBadgeProps> = ({ streakCount }) => {
  if (streakCount <= 0) {
    return null;
  }

  let emoji = '🔥';
  let badgeStyle = styles.badgeDefault;
  let textStyle = styles.streakCountTextDefault;

  if (streakCount >= 12) {
    emoji = '🏆'; // Gold
    badgeStyle = styles.badgeGold;
    textStyle = styles.streakCountTextGold; // Use specific text style for gold if needed
  } else if (streakCount >= 6) {
    emoji = '🥈'; // Silver
    badgeStyle = styles.badgeSilver;
  } else if (streakCount >= 3) {
    emoji = '🥉'; // Bronze
    badgeStyle = styles.badgeBronze;
  }
  // For streaks 1-2, it will use default fire emoji and default badge styles

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
  emojiText: {
    fontSize: 12,
    marginRight: 3,
    // Consider if emoji color needs to contrast with badge background
    // e.g. for dark badges, emoji might need to be light
  },
  streakCountTextBase: { // Base style for all streak counts
    fontSize: 12,
    fontWeight: 'bold',
  },
  streakCountTextDefault: { // For fire emoji text
    color: Colors.light.textOnPrimary, // Assuming warning bg is dark enough for white text
  },
  streakCountTextGold: { // Example: if gold badge needs different text color
    color: Colors.light.text, // Darker text for light gold background
  },
  // Bronze and Silver will implicity use streakCountTextDefault unless overridden
  // Or we can define specific ones: streakCountTextBronze, streakCountTextSilver
});

export default StreakBadge; 