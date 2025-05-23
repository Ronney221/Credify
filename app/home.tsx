import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import { Card, Benefit, allCards } from '../src/data/card-data'; // Assuming selected card IDs might be passed
import { openPerkTarget } from './utils/linking'; // Import the new utility
import UserCardItem from './components/home/UserCardItem';
import SummaryDashboard from './components/home/SummaryDashboard';
import LottieView from 'lottie-react-native'; // Import LottieView

// Define PerkStatus type
type PerkStatus = 'available' | 'pending' | 'redeemed';

// Define CardPerk interface based on todo.md and Benefit interface
export interface CardPerk extends Benefit {
  cardId: string;
  status: PerkStatus;
  streakCount: number; // Added for streak tracking
  coldStreakCount: number; // Added for cold streak tracking
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
        streakCount: 0, // Initialize streak count
        coldStreakCount: 0, // Initialize cold streak count
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
  const [monthlyCreditsPossible, setMonthlyCreditsPossible] = useState(0);
  const [monthlyCreditsRedeemed, setMonthlyCreditsRedeemed] = useState(0);
  const [yearlyCreditsPossible, setYearlyCreditsPossible] = useState(0);
  const [yearlyCreditsRedeemed, setYearlyCreditsRedeemed] = useState(0);
  // const [totalValueUsed, setTotalValueUsed] = useState(0); // We can perhaps derive this or keep it if it means something different

  // State for managing the current cycle for streaks/reset
  // Represents month and year, e.g., "2023-10" (October 2023)
  const [currentCycleIdentifier, setCurrentCycleIdentifier] = useState<string>(
    `${new Date().getFullYear()}-${new Date().getMonth()}`
  );
  // Stores which monthly perks have been redeemed *within the current cycle* to avoid double-counting streaks
  const [redeemedInCurrentCycle, setRedeemedInCurrentCycle] = useState<Record<string, boolean>>({});
  // New state to track cumulative value saved per card (for the session)
  const [cumulativeValueSavedPerCard, setCumulativeValueSavedPerCard] = useState<Record<string, number>>({});

  // State for celebration animation
  const [showCelebration, setShowCelebration] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setBarStyle('dark-content');
      if (Platform.OS === 'android') {
        StatusBar.setBackgroundColor('transparent');
        StatusBar.setTranslucent(true);
      }
    }, [])
  );

  // Effect to update userCardsWithPerks based on route params
  useEffect(() => {
    console.log("HomeScreen params for cards:", params.selectedCardIds);
    const data = getSelectedUserCardsWithPerks(params.selectedCardIds);
    setUserCardsWithPerks(data);
  }, [params.selectedCardIds]); // Only re-run if selectedCardIds change

  // Effect to update summary credit data when userCardsWithPerks changes (e.g., after redemption)
  useEffect(() => {
    console.log("Calculating summary data because userCardsWithPerks changed");
    let mPossible = 0;
    let mRedeemed = 0;
    let yPossible = 0;
    let yRedeemed = 0;

    userCardsWithPerks.forEach(({ perks }) => { // Use userCardsWithPerks from state here
      perks.forEach(perk => {
        if (perk.period === 'monthly') {
          mPossible += perk.value;
          if (perk.status === 'redeemed') {
            mRedeemed += perk.value;
          }
        // Linter error fix: Assuming 'annually' covers 'yearly'. 
        // If card-data.ts uses 'yearly' ensure it's included or change this condition.
        } else if (perk.period === 'yearly') {
          yPossible += perk.value;
          if (perk.status === 'redeemed') {
            yRedeemed += perk.value;
          }
        }
      });
    });

    setMonthlyCreditsPossible(mPossible);
    setMonthlyCreditsRedeemed(mRedeemed);
    setYearlyCreditsPossible(yPossible);
    setYearlyCreditsRedeemed(yRedeemed);

    // Check for full monthly completion
    if (mPossible > 0 && mRedeemed === mPossible) {
      // Ensure celebration only triggers once per cycle for full redemption
      // This check might need more robust logic if mPossible can change mid-cycle
      // or if already celebrated in this cycle (e.g. by using a separate state)
      console.log("All monthly credits redeemed this cycle!");
      setShowCelebration(true); 
      // Consider a flag to prevent re-triggering in the same cycle if data changes slightly
    }

  }, [userCardsWithPerks]); // Only re-run if userCardsWithPerks change

  // Configuration for multi-choice perks
  const multiChoicePerksConfig: Record<string, Array<{ label: string; targetPerkName: string }>> = {
    // Example: Assumes you have a perk named "Flexible Food Delivery Credit" in your card-data.ts
    "Uber / Grubhub Credit": [
      { label: "Open Uber (Rides)", targetPerkName: "Uber Ride Credit" },
      { label: "Open Uber Eats", targetPerkName: "Uber Eats Credit" },
      { label: "Open GrubHub", targetPerkName: "Grubhub Credit" },
    ],
    // Add other flexible perks here if needed
  };

  const setPerkStatus = (cardId: string, perkId: string, newStatus: PerkStatus) => {
    setUserCardsWithPerks(currentCardsData =>
      currentCardsData.map(cardData => {
        if (cardData.card.id === cardId) {
          const updatedPerks = cardData.perks.map(p => {
            if (p.id === perkId) {
              // Streak logic for monthly perks when marked as redeemed
              if (p.period === 'monthly' && newStatus === 'redeemed' && p.status !== 'redeemed' && !redeemedInCurrentCycle[p.id]) {
                console.log(`Incrementing streak for ${p.name}`);
                setRedeemedInCurrentCycle(prev => ({ ...prev, [p.id]: true }));
                // Increment cumulative saved value
                setCumulativeValueSavedPerCard(prev => ({...prev, [cardId]: (prev[cardId] || 0) + p.value }));
                return { ...p, status: newStatus, streakCount: p.streakCount + 1 };
              } else if (newStatus === 'redeemed' && p.status !== 'redeemed') {
                // For non-monthly perks or monthly perks already counted for streak in this cycle
                // but changing from a non-redeemed to redeemed state
                setCumulativeValueSavedPerCard(prev => ({...prev, [cardId]: (prev[cardId] || 0) + p.value }));
              }
              return { ...p, status: newStatus };
            }
            return p;
          });
          return { ...cardData, perks: updatedPerks };
        }
        return cardData;
      })
    );
  };

  const handleTapPerk = async (cardId: string, perkId: string, perkToOpen: CardPerk) => {
    // This function will now primarily handle the "opening" or "choice" logic
    const choices = multiChoicePerksConfig[perkToOpen.name];

    let successfullyOpened = false;
    let actualPerkNameForLinking = perkToOpen.name; // Default to the original perk name

    if (choices) {
      // This is a multi-choice perk
      await new Promise<void>(resolve => {
        Alert.alert(
          `Redeem ${perkToOpen.name}`,
          "Choose an app to open:",
          [
            ...choices.map(choice => ({
              text: choice.label,
              onPress: async () => {
                // Create a temporary perk object with the chosen target name for linking
                const tempPerkForLinking: CardPerk = { ...perkToOpen, name: choice.targetPerkName };
                successfullyOpened = await openPerkTarget(tempPerkForLinking);
                actualPerkNameForLinking = choice.targetPerkName; // For logging, not strictly needed for redemption status logic
                resolve();
              },
            })),
            { text: "Cancel", style: "cancel", onPress: () => resolve() },
          ],
          { cancelable: true, onDismiss: () => resolve() }
        );
      });
    } else {
      // Single-target perk
      successfullyOpened = await openPerkTarget(perkToOpen);
    }

    if (successfullyOpened) {
      // Instead of directly setting here, let the main effect handle it if openPerkTarget implies redemption.
      // For now, openPerkTarget itself sets it to redeemed upon successful linking. If that changes, revisit.
      // The todo.md says: "On successful Linking.openURL, set perk.status = 'redeemed'"
      // This is currently handled if `successfullyOpened` is true and the logic inside the if block runs.
      // Let's explicitly call setPerkStatus if the action was to redeem via opening a link.
      setPerkStatus(cardId, perkId, 'redeemed'); 

      console.log(`Perk ${perkId} (${actualPerkNameForLinking}) for card ${cardId} marked as redeemed after successful link opening.`);
    } else {
      if (choices && !successfullyOpened) { // only log if it was a multi-choice and nothing was chosen/opened
         console.log(`Multi-choice perk ${perkToOpen.name} - no action taken or linking failed.`);
      } else if (!choices) { // original logging for single perks
        console.log(`Attempted to open perk ${perkId} (${perkToOpen.name}) for card ${cardId}, but it was not successful (app not installed or error).`);
      }
    }
  };

  const handleLongPressPerk = (cardId: string, perkId: string, currentPerk: CardPerk) => {
    Alert.alert(
      `Manage Perk: ${currentPerk.name}`,
      "Set perk status:",
      [
        {
          text: "Mark as Redeemed",
          onPress: () => setPerkStatus(cardId, perkId, 'redeemed'),
          // Optional: Add style if currentPerk.status === 'redeemed'
        },
        {
          text: "Mark as Pending",
          onPress: () => setPerkStatus(cardId, perkId, 'pending'),
          // Optional: Add style if currentPerk.status === 'pending'
        },
        {
          text: "Clear Status (Set to Available)",
          onPress: () => setPerkStatus(cardId, perkId, 'available'),
          // Optional: Add style if currentPerk.status === 'available'
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ],
      { cancelable: true }
    );
  };

  // Placeholder for a function that would be called at the start of a new month
  const processNewMonth = (forceNextMonthForTesting = false) => {
    let newCycleIdentifier_Year = new Date().getFullYear();
    let newCycleIdentifier_Month = new Date().getMonth();

    if (forceNextMonthForTesting) {
      // Parse currentCycleIdentifier to advance it
      const [yearStr, monthStr] = currentCycleIdentifier.split('-');
      let year = parseInt(yearStr, 10);
      let month = parseInt(monthStr, 10); // 0-11 for months

      month += 1;
      if (month > 11) { // Month is 0-indexed (0 for Jan, 11 for Dec)
        month = 0;
        year += 1;
      }
      newCycleIdentifier_Year = year;
      newCycleIdentifier_Month = month;
      console.log(`DEV: Forcing next month to: ${year}-${month}`);
    }
    
    const newCycleIdentifier = `${newCycleIdentifier_Year}-${newCycleIdentifier_Month}`;

    if (newCycleIdentifier !== currentCycleIdentifier || forceNextMonthForTesting) {
      console.log(`Processing month change! Old cycle: ${currentCycleIdentifier}, New cycle: ${newCycleIdentifier}`);
      
      const [prevYearStr, prevMonthStr] = currentCycleIdentifier.split('-');
      const prevYear = parseInt(prevYearStr, 10);
      const prevMonth = parseInt(prevMonthStr, 10);

      const hasAYearPassed = (newCycleIdentifier_Year * 12 + newCycleIdentifier_Month) >= (prevYear * 12 + prevMonth + 12);
      if (forceNextMonthForTesting && hasAYearPassed) {
        console.log("DEV: A conceptual year has passed due to forced month changes.");
      }

      setUserCardsWithPerks(currentData => 
        currentData.map(cardData => ({
          ...cardData,
          perks: cardData.perks.map(p => {
            let newStreakCount = p.streakCount;
            let newColdStreakCount = p.coldStreakCount;
            let newStatus = p.status;

            if (p.period === 'monthly') {
              if (!redeemedInCurrentCycle[p.id]) {
                newStreakCount = 0;
                newColdStreakCount += 1; // Increment cold streak
                console.log(`Cold streak for ${p.name} now ${newColdStreakCount}`);
              } else {
                newColdStreakCount = 0; // Reset cold streak if redeemed
              }
              newStatus = 'available';
            } else if (p.period === 'yearly' && forceNextMonthForTesting && hasAYearPassed) {
              console.log(`DEV: Resetting yearly perk ${p.name} due to forced year passage.`);
              newStatus = 'available';
              newStreakCount = 0; 
              newColdStreakCount = 0; // Reset cold streak for yearly too on its reset
            }
            return { ...p, status: newStatus as PerkStatus, streakCount: newStreakCount, coldStreakCount: newColdStreakCount };
          })
        }))
      );
      setCurrentCycleIdentifier(newCycleIdentifier);
      setRedeemedInCurrentCycle({}); // Reset the tracker for the new cycle
      Alert.alert("New Month!", "Monthly perks have been reset.");
    } else {
      Alert.alert("Still Same Month", "Monthly reset can only occur once a new calendar month begins.");
    }
  };

  // TODO: Implement functions to calculate summary data (monthly, yearly credits, value used)

  return (
    <SafeAreaView style={styles.container} edges={['top', 'left', 'right', 'bottom']}>
      {/* <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} /> */}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.headerTitle}>Dashboard</Text>

        {/* Temporary button to simulate month end - FOR DEV ONLY */}
        <TouchableOpacity onPress={() => processNewMonth(true)} style={{backgroundColor: '#ddd', padding: 10, marginVertical:10, alignItems: 'center'}}>
          <Text>DEV: Force Next Month & Reset</Text>
        </TouchableOpacity>

        <SummaryDashboard 
          monthlyCreditsRedeemed={monthlyCreditsRedeemed}
          monthlyCreditsPossible={monthlyCreditsPossible}
          yearlyCreditsRedeemed={yearlyCreditsRedeemed}
          yearlyCreditsPossible={yearlyCreditsPossible}
          summaryContainerStyle={styles.summaryContainer}
          summaryCardStyle={styles.summaryCard}
          summaryValueStyle={styles.summaryValue}
          summaryLabelStyle={styles.summaryLabel}
        />

        {/* List of Cards and Perks */}
        <View style={styles.cardsPerksContainer}>
          <Text style={styles.sectionTitle}>Your Cards & Perks</Text>
          {userCardsWithPerks.length > 0 ? (
            userCardsWithPerks.map(({ card, perks }) => (
              <UserCardItem
                key={card.id}
                card={card}
                perks={perks}
                cumulativeSavedValue={cumulativeValueSavedPerCard[card.id] || 0}
                onTapPerk={handleTapPerk}
                onLongPressPerk={handleLongPressPerk}
                cardDetailItemStyle={styles.cardDetailItem}
                cardHeaderContainerStyle={styles.cardHeaderContainer}
                cardNameStyle={styles.cardName}
                valueSavedTextStyle={styles.valueSavedText}
              />
            ))
          ) : (
            <Text style={styles.noCardsSelectedText}>No cards selected or data not available.</Text>
          )}
        </View>
      </ScrollView>

      {showCelebration && (
        <LottieView 
          source={require('../assets/animations/celebration.json')} // Adjust path if needed
          autoPlay 
          loop={false} 
          onAnimationFinish={() => {
            console.log("Celebration animation finished.");
            setShowCelebration(false);
          }} 
          style={styles.lottieCelebration} // Added a style for positioning
        />
      )}
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
  },
  cardHeaderContainer: { 
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  valueSavedText: { 
    fontSize: 14,
    fontWeight: '600',
    color: '#28a745', 
  },
  noCardsSelectedText: { 
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#666666',
  },
  lottieCelebration: { // Style for the Lottie animation overlay
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000, // Ensure it's on top
    pointerEvents: 'none', // Allow taps to go through to elements behind it
  },
}); 