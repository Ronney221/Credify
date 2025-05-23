import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  Platform,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { Card, allCards } from '../src/data/card-data'; // Updated import path

// TODO: Replace with actual card data and types
// interface Card {
//   id: string;
//   name: string;
//   image: any; // React Native's ImageSourcePropType for require
// }

// This data will be moved to a separate file for scalability
// const initialCards: Card[] = [
//   { id: 'amex_gold', name: 'Amex Gold', image: require('../assets/images/amex_gold.avif') },
//   { id: 'chase_sapphire_preferred', name: 'Chase Sapphire Preferred', image: require('../assets/images/chase_sapphire_preferred.png') },
//   // Add more cards here in the future
// ];

export default function CardSelectionScreen() {
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState(''); // State for search query
  const [renewalDates, setRenewalDates] = useState<Record<string, Date>>({}); // Store as Date objects

  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [currentEditingCardId, setCurrentEditingCardId] = useState<string | null>(null);

  const showDatePicker = (cardId: string) => {
    setCurrentEditingCardId(cardId);
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
    setCurrentEditingCardId(null);
  };

  const handleConfirmDate = (date: Date) => {
    if (currentEditingCardId) {
      setRenewalDates((prevDates) => ({
        ...prevDates,
        [currentEditingCardId]: date,
      }));
    }
    hideDatePicker();
  };

  const toggleCardSelection = (cardId: string) => {
    setSelectedCards((prevSelectedCards) =>
      prevSelectedCards.includes(cardId)
        ? prevSelectedCards.filter((id) => id !== cardId)
        : [...prevSelectedCards, cardId]
    );
    // If card is deselected, remove its renewal date
    if (selectedCards.includes(cardId)) {
      setRenewalDates(prevDates => {
        const newDates = {...prevDates};
        delete newDates[cardId];
        return newDates;
      });
    }
  };

  // Filter cards based on search query
  const filteredCards = useMemo(() => {
    if (!searchQuery) {
      return allCards;
    }
    return allCards.filter((card) =>
      card.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery, allCards]);

  const formatDate = (date: Date | undefined): string => {
    if (!date) return 'Set Renewal Date';
    return date.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
  };

  // TODO: Implement Add Card functionality
  // TODO: Implement navigation to OAuth Screen
  // TODO: Implement Continue button logic (disable if no card selected)

  return (
    <SafeAreaView style={styles.container} edges={[]}>
      <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent={true} />
      <Text style={styles.title}>Select Your Cards</Text>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for a card..."
          placeholderTextColor="#8e8e93"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
      >
        {filteredCards.length > 0 ? (
          filteredCards.map((card) => {
            const isSelected = selectedCards.includes(card.id);
            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.cardItem,
                  isSelected && styles.cardItemSelected,
                ]}
                onPress={() => toggleCardSelection(card.id)}
                activeOpacity={0.7}
              >
                <Image source={card.image} style={styles.cardImage} />
                <View style={styles.cardTextContainer}> {/* Wrapper for text and date input */}
                  <Text style={styles.cardName}>{card.name}</Text>
                  {isSelected && (
                    <TouchableOpacity onPress={() => showDatePicker(card.id)} style={styles.dateInputTouchable}>
                      <Text style={renewalDates[card.id] ? styles.dateTextSet : styles.dateTextPlaceholder}>
                        {formatDate(renewalDates[card.id])}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={styles.noResultsText}>No cards found matching your search.</Text>
        )}
      </ScrollView>
      <View style={styles.footer}>
        <TouchableOpacity
          style={[
            styles.continueButton,
            selectedCards.length === 0 && styles.continueButtonDisabled,
          ]}
          onPress={() => alert('Continue Clicked (Implement Navigation)')}
          disabled={selectedCards.length === 0}
          activeOpacity={0.8}
        >
          <Text style={styles.continueButtonText}>Continue</Text>
        </TouchableOpacity>
      </View>
      {currentEditingCardId && (
        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          date={renewalDates[currentEditingCardId] || new Date()} // Default to today or existing date
          // minimumDate={new Date()} // Optional: prevent past dates
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  searchInput: {
    height: 45,
    borderColor: '#d1d1d6',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: '#f0f0f0',
    fontSize: 16,
    marginBottom: 10,
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  scrollViewContent: {
    paddingTop: 10,
    paddingBottom: 10,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginTop: Platform.OS === 'android' ? 15 : 5,
    marginBottom: 15,
    textAlign: 'center',
    color: '#1c1c1e',
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 2,
    borderColor: 'transparent',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTextContainer: { // New style for text and date input grouping
    flex: 1, // Takes remaining space
    marginLeft: 10, // Space between image and text content
  },
  cardItemSelected: {
    borderColor: '#007aff',
    backgroundColor: '#eff7ff',
  },
  cardImage: {
    width: 80,
    height: 50,
    resizeMode: 'contain',
    marginRight: 15,
    borderRadius: 4,
  },
  cardName: {
    fontSize: 17,
    fontWeight: '500',
    flexShrink: 1,
    color: '#1c1c1e',
    marginBottom: 5, // Space between card name and date input
  },
  dateInputTouchable: { // Replaces dateInput style
    height: 35,
    borderColor: '#c0c0c0',
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 8,
    marginTop: 5,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  dateTextSet: {
    fontSize: 14,
    color: '#1c1c1e',
  },
  dateTextPlaceholder: {
    fontSize: 14,
    color: '#a0a0a0', // Placeholder color
  },
  noResultsText: {
    textAlign: 'center',
    marginTop: 30,
    fontSize: 16,
    color: '#666666',
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 10 : 5,
    paddingBottom: Platform.OS === 'ios' ? 20 : 16,
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    backgroundColor: '#ffffff',
  },
  continueButton: {
    backgroundColor: '#007aff',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  continueButtonDisabled: {
    backgroundColor: '#c7c7cc',
    shadowOpacity: 0,
    elevation: 0,
  },
  continueButtonText: {
    color: '#ffffff',
    fontSize: 17,
    fontWeight: '600',
  },
}); 