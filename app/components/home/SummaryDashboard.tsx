import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors } from '../../constants/Colors'; // Uppercase filename

interface SummaryDashboardProps {
  monthlyCreditsRedeemed: number;
  monthlyCreditsPossible: number;
  yearlyCreditsRedeemed: number;
  yearlyCreditsPossible: number;
  summaryContainerStyle?: object;
  summaryCardStyle?: object;
  summaryValueStyle?: object;
  summaryLabelStyle?: object;
}

const SummaryDashboard: React.FC<SummaryDashboardProps> = ({
  monthlyCreditsRedeemed,
  monthlyCreditsPossible,
  yearlyCreditsRedeemed,
  yearlyCreditsPossible,
  summaryContainerStyle,
  summaryCardStyle,
  summaryValueStyle,
  summaryLabelStyle,
}) => {
  return (
    <View style={[styles.summaryContainer, summaryContainerStyle]}>
      <View style={[styles.summaryCard, summaryCardStyle]}>
        <Text style={[styles.summaryValue, summaryValueStyle]}>
          ${monthlyCreditsRedeemed} / ${monthlyCreditsPossible}
        </Text>
        <Text style={[styles.summaryLabel, summaryLabelStyle]}>Month</Text>
        {/* TODO: Add Progress Bar Here later if desired */}
      </View>
      <View style={[styles.summaryCard, summaryCardStyle]}>
        <Text style={[styles.summaryValue, summaryValueStyle]}>
          ${yearlyCreditsRedeemed} / ${yearlyCreditsPossible}
        </Text>
        <Text style={[styles.summaryLabel, summaryLabelStyle]}>Year</Text>
        {/* TODO: Add Progress Bar Here later if desired */}
      </View>
    </View>
  );
};

// Default styles for SummaryDashboard if not overridden by props from home.tsx
const styles = StyleSheet.create({
  summaryContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 25,
  },
  summaryCard: {
    backgroundColor: Colors.light.cardBackground, // Use uppercase Colors
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
    shadowColor: Colors.light.text, // Use uppercase Colors
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  summaryValue: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.light.primary, // Use uppercase Colors
    marginBottom: 5,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.light.textSecondary, // Use uppercase Colors
    textAlign: 'center',
  },
});

export default SummaryDashboard; 