import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface StreakBadgeProps {
  streakCount: number;
}

const styles = StyleSheet.create({
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6, // Space between perk name and badge
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
    backgroundColor: '#f0f0f0', // A light background for the badge itself
  },
  emojiText: {
    fontSize: 12,
    marginRight: 3,
  },
  streakCountText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  // Specific styles for milestone colors if needed, e.g., gold for 12 months
  milestone12Badge: {
    backgroundColor: '#ffd700', // Gold-ish for 12 months
  },
  milestone6Badge: {
    backgroundColor: '#c0c0c0', // Silver-ish for 6 months
  },
  milestone3Badge: {
    backgroundColor: '#cd7f32', // Bronze-ish for 3 months
  },
});

const StreakBadge: React.FC<StreakBadgeProps> = ({ streakCount }) => {
  if (streakCount <= 0) {
    return null; // Don't render anything if no streak
  }

  let emoji = '🔥'; // Default fire emoji
  let badgeStyle = styles.badgeContainer;

  if (streakCount >= 12) {
    emoji = '🏆'; // Gold Trophy for 12+ months
    // badgeStyle = [styles.badgeContainer, styles.milestone12Badge]; // Optional: different background for milestones
  } else if (streakCount >= 6) {
    emoji = '🥈'; // Silver Medal/Trophy for 6-11 months (Using a silver medal emoji as a placeholder)
    // badgeStyle = [styles.badgeContainer, styles.milestone6Badge];
  } else if (streakCount >= 3) {
    emoji = '🥉'; // Bronze Medal/Trophy for 3-5 months
    // badgeStyle = [styles.badgeContainer, styles.milestone3Badge];
  }
  // To use different background colors per milestone, uncomment the badgeStyle assignments above
  // and ensure they are applied to the <View> below.

  return (
    <View style={badgeStyle}>
      <Text style={styles.emojiText}>{emoji}</Text>
      <Text style={styles.streakCountText}>{streakCount}</Text>
    </View>
  );
};

export default StreakBadge; 