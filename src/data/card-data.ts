export interface Benefit {
  id: string;
  name: string;
  value: number; // Can be monetary value or other unit
  period: 'monthly' | 'quarterly' | 'yearly' | 'one-time';
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
  /* 1. ——— AMEX PLATINUM ——— */
  {
    id: 'amex_platinum',
    name: 'American Express Platinum',
    image: require('../../assets/images/amex_plat.avif'),
    annualFee: 695,
    benefits: [
      {
        id: 'platinum_uber_cash',
        name: 'Uber Cash',
        value: 15,          // $15 (plus an extra $20 every Dec.)
        period: 'monthly',
        description: 'Up to $15 in Uber Cash each month for rides or Uber Eats orders (extra $20 in December).',
        redemptionInstructions: 'Add your Platinum Card to the Uber wallet and the credit auto-appears as Uber Cash.',
      },
      {
        id: 'platinum_digital_ent',
        name: 'Digital Entertainment Credit',
        value: 20,
        period: 'monthly',
        description: '$20 in statement credits for Disney+, Hulu, ESPN+, Peacock or NYT subscriptions.',
      },
      {
        id: 'platinum_walmart_plus',
        name: 'Walmart+ Membership Rebate',
        value: 12.95,
        period: 'monthly',
        description: 'Reimburses one Walmart+ monthly membership (up to $12.95 + tax).',
      },
    ],
  },

  /* 2. ——— AMEX GOLD (sample expanded) ——— */
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
        name: 'Uber / Grubhub Credit',
        value: 10,
        period: 'monthly',
        description: '$10 Uber Cash each month for U.S. rides, Uber Eats, or Grubhub.',
      },
    ],
  },

  /* 3. ——— CHASE SAPPHIRE RESERVE ——— */
  {
    id: 'chase_sapphire_reserve',
    name: 'Chase Sapphire Reserve',
    image: require('../../assets/images/chase_sapphire_reserve.png'),
    annualFee: 550,
    benefits: [
      {
        id: 'csr_doordash_grocery',
        name: 'DoorDash Grocery Credits',
        value: 20,        // two $10 credits / month
        period: 'monthly',
        description: '$20 in DoorDash credits for grocery & convenience orders (2 × $10 promos).',
      },
      {
        id: 'csr_doordash_restaurant',
        name: 'DoorDash Restaurant Credit',
        value: 5,
        period: 'monthly',
        description: '$5 DoorDash credit for restaurant orders while enrolled in DashPass.',
      },
      {
        id: 'csr_instacart',
        name: 'Instacart Credit',
        value: 15,
        period: 'monthly',
        description: 'Up to $15 in Instacart statement credits after enrolling in the complimentary Instacart+ membership.',
      },
      {
        id: 'csr_travel',
        name: 'Annual Travel Credit',
        value: 300,
        period: 'yearly',
        description: '$300 automatic credit toward travel purchases each cardmember year.',
      },
    ],
  },

  /* 4. ——— CHASE SAPPHIRE PREFERRED (sample existed) ——— */
  {
    id: 'chase_sapphire_preferred',
    name: 'Chase Sapphire Preferred',
    image: require('../../assets/images/chase_sapphire_preferred.png'),
    annualFee: 95,
    benefits: [
      {
        id: 'csp_doordash_grocery',
        name: 'DoorDash Grocery Credit',
        value: 10,
        period: 'monthly',
        description: '$10 DoorDash credit for grocery / non-restaurant orders while enrolled in DashPass.',
      },
      {
        id: 'csp_instacart',
        name: 'Instacart Credit',
        value: 15,
        period: 'quarterly',
        description: 'Up to $15 in Instacart statement credits each quarter after activating Instacart+ membership.',
      },
    ],
  },

  /* 5. ——— MARRIOTT BONVOY BRILLIANT ——— */
  {
    id: 'marriott_bonvoy_brilliant',
    name: 'Marriott Bonvoy Brilliant',
    image: require('../../assets/images/marriott_bonvoy_brilliant.avif'),
    annualFee: 650,
    benefits: [
      {
        id: 'brilliant_dining',
        name: 'Dining Credit',
        value: 25,
        period: 'monthly',
        description: '$25 dining statement credit each month (up to $300 per year) at restaurants worldwide.',
      },
    ],
  },

  /* 6. ——— HILTON HONORS ASPIRE ——— */
  {
    id: 'hilton_aspire',
    name: 'Hilton Honors Aspire',
    image: require('../../assets/images/hilton_aspire.avif'),
    annualFee: 550,
    benefits: [
      {
        id: 'aspire_flight_credit',
        name: 'Airline Flight Credit',
        value: 50,
        period: 'quarterly',
        description: 'Up to $50 back in statement credits each quarter on eligible flight purchases (total $200 yr).',
      },
    ],
  },

  /* 7. ——— CAPITAL ONE VENTURE X ——— */
  {
    id: 'capital_one_venture_x',
    name: 'Capital One Venture X',
    image: require('../../assets/images/venture_x.avif'),
    annualFee: 395,
    benefits: [
      {
        id: 'venturex_travel_credit',
        name: 'Capital One Travel Credit',
        value: 300,
        period: 'yearly',
        description: '$300 credit each cardmember year for bookings made through the Capital One Travel portal.',
      },
    ],
  },

  /* 8. ——— BLUE CASH PREFERRED ——— */
  {
    id: 'blue_cash_preferred',
    name: 'Blue Cash Preferred (AmEx)',
    image: require('../../assets/images/blue_cash_preferred.avif'),
    annualFee: 95,
    benefits: [
      {
        id: 'bcp_disney_bundle',
        name: 'Disney Bundle Credit',
        value: 7,
        period: 'monthly',
        description: '$7 statement credit after spending ≥ $9.99 on an eligible Disney Bundle subscription.',
      },
    ],
  },

  /* 9. ——— DELTA SKYMILES RESERVE (AmEx) ——— */
  {
    id: 'delta_reserve',
    name: 'Delta SkyMiles Reserve (AmEx)',
    image: require('../../assets/images/delta_reserve.avif'),
    annualFee: 650,
    benefits: [
      {
        id: 'delta_resy',
        name: 'Resy Dining Credit',
        value: 20,
        period: 'monthly',
        description: 'Up to $20 back each month on Resy restaurant purchases.',
      },
    ],
  },

  /* 10. ——— AMEX GREEN ——— */
  {
    id: 'amex_green',
    name: 'American Express Green',
    image: require('../../assets/images/amex_green.avif'),
    annualFee: 150,
    benefits: [
      {
        id: 'green_clear',
        name: 'CLEAR Plus Credit',
        value: 189,
        period: 'yearly',
        description: 'Up to $189 in statement credits per calendar year for CLEAR Plus airport security membership.',
      },
    ],
  },
]; 