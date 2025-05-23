import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface SummaryDashboardProps {
  monthlyCreditsRedeemed: number;
  monthlyCreditsPossible: number;
  yearlyCreditsRedeemed: number;
  yearlyCreditsPossible: number;
  // Styles from home.tsx
  summaryContainerStyle: object;
  summaryCardStyle: object;
  summaryValueStyle: object;
  summaryLabelStyle: object;
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
    <View style={summaryContainerStyle}>
      <View style={summaryCardStyle}>
        <Text style={summaryValueStyle}>
          ${monthlyCreditsRedeemed} / ${monthlyCreditsPossible}
        </Text>
        <Text style={summaryLabelStyle}>Monthly Credits Used</Text>
        {/* TODO: Add Progress Bar Here later if desired */}
      </View>
      <View style={summaryCardStyle}>
        <Text style={summaryValueStyle}>
          ${yearlyCreditsRedeemed} / ${yearlyCreditsPossible}
        </Text>
        <Text style={summaryLabelStyle}>Yearly Credits Used</Text>
        {/* TODO: Add Progress Bar Here later if desired */}
      </View>
    </View>
  );
};

export default SummaryDashboard; 