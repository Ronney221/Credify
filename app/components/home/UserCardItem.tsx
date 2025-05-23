import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardPerk } from '../../home'; // Adjust if CardPerk types are elsewhere
import { Card } from '../../../src/data/card-data'; // Corrected path for Card type
import PerkItem from './PerkItem';
import { Colors } from '../../constants/Colors'; // Uppercase filename

interface UserCardItemProps {
  card: Card;
  perks: CardPerk[];
  cumulativeSavedValue: number;
  onTapPerk: (cardId: string, perkId: string, perk: CardPerk) => void;
  onLongPressPerk: (cardId: string, perkId: string, perk: CardPerk) => void;
  // Styles that were originally in home.tsx for card items
  cardDetailItemStyle?: object; // Made props optional as we have defaults
  cardHeaderContainerStyle?: object;
  cardNameStyle?: object;
  valueSavedTextStyle?: object;
}

const UserCardItem: React.FC<UserCardItemProps> = ({
  card,
  perks,
  cumulativeSavedValue,
  onTapPerk,
  onLongPressPerk,
  cardDetailItemStyle,
  cardHeaderContainerStyle,
  cardNameStyle,
  valueSavedTextStyle,
}) => {
  return (
    <View style={[styles.cardDetailItem, cardDetailItemStyle]}>
      <View style={[styles.cardHeaderContainer, cardHeaderContainerStyle]}>
        <Text style={[styles.cardName, cardNameStyle]}>{card.name}</Text>
        <Text style={[styles.valueSavedText, valueSavedTextStyle]}>Value Saved: ${cumulativeSavedValue}</Text>
      </View>
      {perks.map((perk) => (
        <PerkItem
          key={perk.id}
          perk={perk}
          cardId={card.id}
          onTapPerk={onTapPerk}
          onLongPressPerk={onLongPressPerk}
        />
      ))}
    </View>
  );
};

// Default styles for UserCardItem
const styles = StyleSheet.create({
  cardDetailItem: {
    backgroundColor: Colors.light.cardBackground, // Use uppercase Colors
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: Colors.light.text, // Use uppercase Colors
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardHeaderContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.light.text, // Use uppercase Colors
    flexShrink: 1, // Allow card name to shrink
    marginRight: 8, // Add some space between card name and value saved
  },
  valueSavedText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.light.accent, // Use uppercase Colors
  },
});

export default UserCardItem; 