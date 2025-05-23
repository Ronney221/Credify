import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Card, Benefit, allCards } from '../src/data/card-data'; // Assuming selected card IDs might be passed
import { openPerkTarget } from './utils/linking'; // Import the new utility

// Define PerkStatus type
type PerkStatus = 'available' | 'pending' | 'redeemed';

// Define CardPerk interface based on todo.md and Benefit interface
export interface CardPerk extends Benefit {
  cardId: string;
  status: PerkStatus;
}

// Placeholder for fetching/calculating user's selected cards and their perks
const getSelectedUserCardsWithPerks = (
  selectedCardIdsString?: string,
  // renewalDatesString?: string // We can use this later if needed
): { card: Card; perks: CardPerk[] }[] => {
  const selectedIds = selectedCardIdsString ? selectedCardIdsString.split(',') : [];
  // const renewalDates = renewalDatesString ? JSON.parse(renewalDatesString) : {};
  
  if (selectedIds.length === 0) {
    // If no IDs passed (e.g., direct navigation or error), return empty or default
    // For now, let's show a message or a default state on the screen itself.
    return []; 
  }

  return allCards
    .filter(card => selectedIds.includes(card.id))
    .map(card => ({
      card,
      perks: card.benefits.map(benefit => ({
        ...benefit,
        cardId: card.id,
        status: 'available' as PerkStatus,
      })),
    }));
};

export default function HomeScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ selectedCardIds?: string; renewalDates?: string }>();

  const [userCardsWithPerks, setUserCardsWithPerks] = useState<
    { card: Card; perks: CardPerk[] }[]
  >([]);

  // TODO: State for summary data
  const [monthlyCredits, setMonthlyCredits] = useState(0);
  const [yearlyCredits, setYearlyCredits] = useState(0);
  const [totalValueUsed, setTotalValueUsed] = useState(0);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
    }, [])
  );

  useEffect(() => {
    console.log("HomeScreen params:", params);
    const data = getSelectedUserCardsWithPerks(params.selectedCardIds);
    setUserCardsWithPerks(data);
    // TODO: Calculate summary data based on new data
  }, [params.selectedCardIds]); // Re-run if selectedCardIds change

  const handleRedeemPerk = async (cardId: string, perkId: string, perkToOpen: CardPerk) => {
    const successfullyOpened = await openPerkTarget(perkToOpen);

    if (successfullyOpened) {
      setUserCardsWithPerks(currentCards => 
        currentCards.map(cardData => {
          if (cardData.card.id === cardId) {
            return {
              ...cardData,
              perks: cardData.perks.map(perk => 
                perk.id === perkId ? { ...perk, status: 'redeemed' as PerkStatus } : perk
              ),
            };
          }
          return cardData;
        })
      );
      // TODO: Update totalValueUsed based on perkToOpen.value
      console.log(`Perk ${perkId} for card ${cardId} marked as redeemed after successful link opening.`);
    } else {
      console.log(`Attempted to open perk ${perkId} for card ${cardId}, but it was not successful (app not installed or error).`);
    }
  };

  // TODO: Implement functions to calculate summary data (monthly, yearly credits, value used)

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Dashboard</Text>

        {/* Summary Cards Placeholder */}
        <View style={styles.summaryContainer}>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>${monthlyCredits}</Text>
            <Text style={styles.summaryLabel}>Credits Available (Month)</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>${yearlyCredits}</Text>
            <Text style={styles.summaryLabel}>Credits Available (Year)</Text>
          </View>
          <View style={styles.summaryCard}>
            <Text style={styles.summaryValue}>${totalValueUsed}</Text>
            <Text style={styles.summaryLabel}>Total Value Used</Text>
          </View>
        </View>

        {/* List of Cards and Perks */}
        <View style={styles.cardsPerksContainer}>
          <Text style={styles.sectionTitle}>Your Cards & Perks</Text>
          {userCardsWithPerks.length > 0 ? (
            userCardsWithPerks.map(({ card, perks }) => (
              <View key={card.id} style={styles.cardDetailItem}>
                <Text style={styles.cardName}>{card.name}</Text>
                {perks.map((perk) => {
                  const isRedeemed = perk.status === 'redeemed';
                  return (
                    <View key={perk.id} style={styles.perkItemContainer}> 
                      {/* Content: Info + Button. Was perkContentOverlay */}
                      <View style={styles.perkContentRow}>
                        <View style={styles.perkInfo}>
                          <Text style={[styles.perkName, isRedeemed && styles.perkNameRedeemed]}>{perk.name}</Text>
                          <Text style={[styles.perkValue, isRedeemed && styles.perkValueRedeemed]}>(${perk.value} / {perk.period})</Text>
                        </View>
                        <TouchableOpacity 
                          style={[styles.redeemButton, isRedeemed && styles.redeemButtonDisabled]}
                          onPress={() => handleRedeemPerk(card.id, perk.id, perk)} // Pass the full perk object
                          disabled={isRedeemed}
                        >
                          <Text style={styles.redeemButtonText}>
                            {isRedeemed ? 'View' : 'Redeem'} {/* Changed text for redeemed state */}
                          </Text>
                        </TouchableOpacity>
                      </View>
                      
                      {/* New Progress Bar section */}
                      <View style={styles.progressBarTrack}>
                        <View style={[styles.progressBarFill, { width: isRedeemed ? '100%' : '0%' }]} />
                      </View>
                    </View>
                  );
                })}
              </View>
            ))
          ) : (
            <Text style={styles.noCardsSelectedText}>No cards selected or data not available.</Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f2f5', // Light gray background for dashboard
  },
  scrollContent: {
    padding: 16,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1c1c1e',
    marginBottom: 20,
    textAlign: 'center',
  },
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  summaryCard: {
    backgroundColor: '#ffffff',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1, // Distribute space equally
    marginHorizontal: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#007aff',
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#666666',
    textAlign: 'center',
  },
  cardsPerksContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1c1c1e',
    marginBottom: 15,
  },
  cardDetailItem: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },
  cardName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
    marginBottom: 10,
  },
  perkItemContainer: { 
    borderRadius: 8,
    marginBottom: 10,
    padding: 12, // Added: Padding around content and new progress bar
  },
  perkItemRedeemedContainer: {
    backgroundColor: '#c3e6cb', // Background when redeemed (can be same as progressBarFilled or slightly different)
  },
  progressBarBackground: { // Visual for empty part - could have patterns
    // This is now handled by perkItemContainer backgroundColor
    // If you want a distinct visual like stripes, style this view explicitly.
    // For example: backgroundColor: 'repeating-linear-gradient(45deg, #d0d0d0, #d0d0d0 5px, #e0e0e0 5px, #e0e0e0 10px)'
    // Note: linear-gradient is not directly supported, would need an ImageBackground or a library for complex patterns.
    // For simplicity, we're using the perkItemContainer's background.
  },
  progressBarFilled: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: '100%', // Fills container
    backgroundColor: '#28a745', // Green filled color
    borderRadius: 8, // Match container
  },
  perkContentRow: { // Renamed from perkContentOverlay and modified
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8, // Added: Space before the new progress bar
  },
  perkInfo: {
    flex: 1,
    marginRight: 8, // Space before button
  },
  perkName: {
    fontSize: 15,
    fontWeight: '600', // Slightly bolder
    color: '#343a40', // Darker for better contrast on light gray
    marginBottom: 2,
  },
  perkNameRedeemed: {
    color: '#155724', // Dark green text for redeemed state
  },
  perkValue: { // New style for value/period text
    fontSize: 13,
    color: '#495057',
  },
  perkValueRedeemed: {
    color: '#155724',
  },
  redeemButton: {
    backgroundColor: '#007bff', // Blue for redeem action button
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 6,
    marginLeft: 10,
  },
  redeemButtonDisabled: { // Style for when perk is redeemed
    backgroundColor: '#6c757d', // Gray when disabled/redeemed
  },
  redeemButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '500',
  },
  noCardsSelectedText: { // New style for message
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666666',
  },
  // New styles for the progress bar
  progressBarTrack: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#e9ecef', // Color of the empty part of the bar
    overflow: 'hidden', // Ensures the fill is clipped to rounded corners
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: '#28a745', // Color of the filled part of the bar
    borderRadius: 4, // Match track's border radius
  },
}); 