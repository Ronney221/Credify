import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CardPerk } from '../../home'; // Adjust path as needed, assuming home.tsx exports CardPerk
import StreakBadge from './StreakBadge'; // Import StreakBadge

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
    color: '#343a40',
  },
  perkNameRedeemed: {
    color: '#155724',
    textDecorationLine: 'line-through',
  },
  perkNamePending: {
    color: '#856404',
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
    color: '#495057',
  },
  perkValueRedeemed: {
    color: '#155724',
    textDecorationLine: 'line-through',
  },
  perkValuePending: {
    color: '#856404',
    fontStyle: 'italic',
  },
  redeemButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  redeemButtonDisabled: {
    backgroundColor: '#6c757d',
  },
  redeemButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e9ecef',
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#28a745', // Green for redeemed
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
    // marginRight: 3, // Can share margin with emojiText or have its own
  },
  streakCountText: {
    fontSize: 12,
  },
});

const PerkItem: React.FC<PerkItemProps> = ({ perk, cardId, onTapPerk, onLongPressPerk }) => {
  const isRedeemed = perk.status === 'redeemed';
  const isPending = perk.status === 'pending';

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
              <StreakBadge streakCount={perk.streakCount} />
              {perk.coldStreakCount > 0 && (
                <View style={styles.badgeContainer}> {/* Re-use badge container style or make a new one */}
                  <Text style={styles.coldStreakEmojiText}>🥶</Text>
                  <Text style={styles.streakCountText}>{perk.coldStreakCount}</Text>
                </View>
              )}
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
            styles.progressBarFill, // Base style (height, borderRadius)
            isRedeemed && { width: '100%', backgroundColor: '#28a745' }, // Green for redeemed
            isPending && { width: '50%', backgroundColor: '#ffc107' }, // Yellow for pending
            (!isRedeemed && !isPending) && { width: '0%' } // Explicitly 0% if available
          ]} />
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default PerkItem; 