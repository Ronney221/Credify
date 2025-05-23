import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CardPerk } from '../../home'; // Adjust if CardPerk types are elsewhere
import { Card } from '../../../src/data/card-data'; // Corrected path for Card type
import PerkItem from './PerkItem';

interface UserCardItemProps {
  card: Card;
  perks: CardPerk[];
  onTapPerk: (cardId: string, perkId: string, perk: CardPerk) => void;
  onLongPressPerk: (cardId: string, perkId: string, perk: CardPerk) => void;
  // Styles that were originally in home.tsx for card items
  cardDetailItemStyle: object;
  cardHeaderContainerStyle: object;
  cardNameStyle: object;
  valueSavedTextStyle: object;
}

const UserCardItem: React.FC<UserCardItemProps> = ({
  card,
  perks,
  onTapPerk,
  onLongPressPerk,
  cardDetailItemStyle,
  cardHeaderContainerStyle,
  cardNameStyle,
  valueSavedTextStyle,
}) => {
  const totalValueSavedForCard = perks.reduce((sum, perk) => {
    return perk.status === 'redeemed' ? sum + perk.value : sum;
  }, 0);

  return (
    <View style={cardDetailItemStyle}>
      <View style={cardHeaderContainerStyle}>
        <Text style={cardNameStyle}>{card.name}</Text>
        <Text style={valueSavedTextStyle}>Value Saved: ${totalValueSavedForCard}</Text>
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

export default UserCardItem; 