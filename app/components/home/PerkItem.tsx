import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CardPerk } from '../../home'; // Adjust path as needed, assuming home.tsx exports CardPerk
import StreakBadge from './StreakBadge'; // Import StreakBadge
import { Colors } from '../../constants/Colors'; // Reverted to uppercase filename

interface PerkItemProps {
  perk: CardPerk;
  cardId: string;
  onTapPerk: (cardId: string, perkId: string, perk: CardPerk) => void;
  onLongPressPerk: (cardId: string, perkId: string, perk: CardPerk) => void;
  // Add any other styles from the original home.tsx that are specific to PerkItem visuals
  // For simplicity, we'll assume styles are passed down or defined here if specific enough
  // Alternatively, pass the required pre-calculated booleans like isRedeemed, isPending
}

// You might need to move relevant style definitions from home.tsx to here or a shared style file
// For this example, I'll stub some common styles that would be needed.
const styles = StyleSheet.create({
  perkItemContainer: {
    borderRadius: 8,
    marginBottom: 10,
    padding: 12,
    backgroundColor: Colors.light.cardBackground, // Use themed card background
  },
  perkInteractionZone: {},
  perkContentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  perkInfo: {
    flex: 1,
    marginRight: 8,
  },
  perkNameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  perkName: {
    fontSize: 15,
    fontWeight: '600',
    color: Colors.light.text, // Use themed text color
    flexShrink: 1, // Allow perk name to shrink to prevent overlap
  },
  perkNameRedeemed: {
    color: Colors.light.accent, 
    textDecorationLine: 'line-through',
  },
  perkNamePending: {
    color: Colors.light.warning, 
    fontStyle: 'italic',
  },
  streakText: {
    // This style might be deprecated if StreakBadge handles all its own styling
    // fontSize: 13,
    // color: '#ff9800',
    // marginLeft: 5,
  },
  perkValue: {
    fontSize: 13,
    color: Colors.light.textSecondary, 
  },
  perkValueRedeemed: {
    color: Colors.light.accent, 
    textDecorationLine: 'line-through',
  },
  perkValuePending: {
    color: Colors.light.warning, 
    fontStyle: 'italic',
  },
  redeemButton: {
    backgroundColor: Colors.light.redeemButtonDefault, 
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  redeemButtonDisabled: {
    backgroundColor: Colors.light.redeemButtonDisabled, 
  },
  redeemButtonText: {
    color: Colors.light.textOnPrimary, 
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.light.progressBarTrack, 
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressBarFillPending: {
    // This specific style object for pending fill might not be needed if we pass backgroundColor directly
    // backgroundColor: '#ffc107', // Yellow for pending - handled in-line now
  },
  badgeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6, // Space between perk name and badge
  },
  emojiText: {
    fontSize: 12,
    marginRight: 3,
  },
  coldStreakEmojiText: { // For the cold streak emoji
    fontSize: 12, 
    color: Colors.light.coldStreakIcon, 
  },
  streakCountText: {
    fontSize: 12,
    color: Colors.light.textSecondary, // Using textSecondary for streak count
  },
});

const PerkItem: React.FC<PerkItemProps> = ({ perk, cardId, onTapPerk, onLongPressPerk }) => {
  const isRedeemed = perk.status === 'redeemed';
  const isPending = perk.status === 'pending';

  let progressBarBackgroundColor = Colors.light.progressBarTrack; 
  if (isRedeemed) {
    progressBarBackgroundColor = Colors.light.accent;
  } else if (isPending) {
    progressBarBackgroundColor = Colors.light.pending;
  }

  return (
    <View style={styles.perkItemContainer}>
      <TouchableOpacity
        onPress={() => onTapPerk(cardId, perk.id, perk)}
        onLongPress={() => onLongPressPerk(cardId, perk.id, perk)}
        delayLongPress={300}
        style={styles.perkInteractionZone}
      >
        <View style={styles.perkContentRow}>
          <View style={styles.perkInfo}>
            <View style={styles.perkNameContainer}>
              <Text style={[styles.perkName, isRedeemed && styles.perkNameRedeemed, isPending && styles.perkNamePending]}>
                {perk.name}
              </Text>
              <StreakBadge streakCount={perk.streakCount} coldStreakCount={perk.coldStreakCount} />
            </View>
            <Text style={[styles.perkValue, isRedeemed && styles.perkValueRedeemed, isPending && styles.perkValuePending]}>
              (${perk.value} / {perk.period})
            </Text>
          </View>
          <TouchableOpacity
            style={[
              styles.redeemButton,
              (isRedeemed || isPending) && styles.redeemButtonDisabled,
            ]}
            onPress={() => onTapPerk(cardId, perk.id, perk)} // Keep for specific button tap if desired
            onLongPress={() => onLongPressPerk(cardId, perk.id, perk)} // Keep for specific button longpress
            disabled={isRedeemed || isPending}
          >
            <Text style={styles.redeemButtonText}>
              {isRedeemed ? 'View' : (isPending ? 'Pending' : 'Redeem')}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.progressBarTrack}>
          <View style={[
            styles.progressBarFill,
            { 
              backgroundColor: progressBarBackgroundColor, 
              width: isRedeemed ? '100%' : isPending ? '50%' : '0%'
            }
          ]} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PerkItem; 