export interface Benefit {
  id: string;
  name: string;
  value: number; // Can be monetary value or other unit
  period: 'monthly' | 'quarterly' | 'annually' | 'one-time';
  description?: string; // Optional detailed description
  redemptionInstructions?: string; // How to redeem, e.g., link, in-app action
  // Add other relevant fields like category (e.g., travel, dining, shopping)
}

export interface Card {
  id: string;
  name: string;
  image: any; // React Native's ImageSourcePropType for require
  annualFee?: number; // Optional: good to track for value calculations
  benefits: Benefit[];
}

export const allCards: Card[] = [
  {
    id: 'amex_gold',
    name: 'American Express Gold',
    image: require('../../assets/images/amex_gold.avif'), // Corrected path
    annualFee: 250, // Example
    benefits: [
      {
        id: 'amex_gold_dunkin',
        name: 'Dunkin\' Donuts Credit',
        value: 7,
        period: 'monthly',
        description: 'Up to $7 in statement credits each month for Dunkin Donuts purchases.',
      },
      {
        id: 'amex_gold_uber_grubhub',
        name: 'Uber/Grubhub Credit',
        value: 10,
        period: 'monthly',
        description: 'Up to $10 in statement credits each month for Uber or Grubhub.',
      },
      {
        id: 'amex_gold_resy',
        name: 'Resy Credit',
        value: 50,
        period: 'annually',
        description: 'Up to $50 in statement credits each year for Resy purchases.',
      },
    ],
  },
  {
    id: 'chase_sapphire_preferred',
    name: 'Chase Sapphire Preferred',
    image: require('../../assets/images/chase_sapphire_preferred.png'), // Corrected path
    annualFee: 95, // Example
    benefits: [
      {
        id: 'csp_doordash_grocery',
        name: 'DoorDash Grocery Credit',
        value: 10,
        period: 'monthly',
        description: 'Up to $10 in statement credits each month for DoorDash grocery orders.',
      },
      // Add other Chase Sapphire Preferred benefits here
    ],
  },
  // Future cards will be added here
  // Example:
  // { id: 'citi_double_cash', name: 'Citi Double Cash', image: require('../../assets/images/citi_double_cash.png') },
  // { id: 'capital_one_venture_x', name: 'Capital One Venture X', image: require('../../assets/images/capital_one_venture_x.png') },
]; 