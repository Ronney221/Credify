import { Linking, Alert, Platform } from 'react-native';
import { CardPerk } from '../home'; // Assuming CardPerk is exported from home.tsx

interface PerkTargetConfig {
  appScheme: string;
  websiteUrl: string;
  appName?: string; // Optional: for more descriptive alerts
  appStoreUrlIOS?: string; // Optional: URL for iOS App Store
  appStoreUrlAndroid?: string; // Optional: URL for Google Play Store
}

// IMPORTANT: The keys in this map (e.g., "Dunkin\' Donuts Credit")
// MUST EXACTLY MATCH the 'name' property of the perks from your card-data.ts.
// Please verify and update these names as needed.
const perkNameMappings: Record<string, PerkTargetConfig> = {
  "Dunkin' Donuts Credit": { // Example: For Amex Gold Dunkin' perk
    appScheme: 'dunkindonuts://',
    websiteUrl: 'https://www.dunkindonuts.com/',
    appName: "Dunkin' Donuts",
    appStoreUrlIOS: 'https://apps.apple.com/app/id1056813463',
    appStoreUrlAndroid: 'https://play.google.com/store/apps/details?id=com.dunkinbrands.otgo',
  },
  "Uber Ride Credit": { // Renamed from "Uber Credits" for clarity
    appScheme: 'uber://',
    websiteUrl: 'https://www.uber.com/ride/',
    appName: 'Uber',
    appStoreUrlIOS: 'https://apps.apple.com/app/uber/id368677368',
    appStoreUrlAndroid: 'https://play.google.com/store/apps/details?id=com.ubercab',
  },
  "Uber Eats Credit": {
    appScheme: 'ubereats://', // Basic scheme to open the app. Specific paths like /store/browse can be added if needed.
    websiteUrl: 'https://www.ubereats.com/',
    appName: 'Uber Eats',
    appStoreUrlIOS: 'https://apps.apple.com/app/uber-eats-food-delivery/id1058959277',
    appStoreUrlAndroid: 'https://play.google.com/store/apps/details?id=com.ubercab.eats',
  },
  "DoorDash Grocery Credit": {
    appScheme: 'doordash://',
    websiteUrl: 'https://www.doordash.com/',
    appName: 'DoorDash',
    appStoreUrlIOS: 'https://apps.apple.com/app/doordash-food-delivery/id719972451',
    appStoreUrlAndroid: 'https://play.google.com/store/apps/details?id=com.dd.doordash',
  },
  "Grubhub Credit": { // Scheme is likely, may need verification
    appScheme: 'grubhub://',
    websiteUrl: 'https://www.grubhub.com/',
    appName: 'Grubhub',
    appStoreUrlIOS: 'https://apps.apple.com/app/grubhub-local-food-delivery/id302920553',
    appStoreUrlAndroid: 'https://play.google.com/store/apps/details?id=com.grubhub.android',
  },
  "Resy Credit": { // Scheme is likely, may need verification
    appScheme: 'resy://',
    websiteUrl: 'https://resy.com/',
    appName: 'Resy',
    appStoreUrlIOS: 'https://apps.apple.com/app/resy/id799274035',
    appStoreUrlAndroid: 'https://play.google.com/store/apps/details?id=com.resy.android',
  },
  /* ────── Amex Platinum "Digital Entertainment Credit" choices ────── */
  "Disney+ Credit": {
    appScheme: "disneyplus://",
    websiteUrl: "https://www.disneyplus.com/",
    appName: "Disney+",
    appStoreUrlIOS: "https://apps.apple.com/app/id1446075923",
    appStoreUrlAndroid: "https://play.google.com/store/apps/details?id=com.disney.disneyplus",
  },
  "Hulu Credit": {
    appScheme: "hulu://",
    websiteUrl: "https://www.hulu.com/",
    appName: "Hulu",
    appStoreUrlIOS: "https://apps.apple.com/app/id376510438",
    appStoreUrlAndroid: "https://play.google.com/store/apps/details?id=com.hulu.plus",
  },
  "ESPN+ Credit": {
    appScheme: "sportscenter://",          // ESPN's registered scheme
    websiteUrl: "https://www.espn.com/espnplus/",
    appName: "ESPN",
    appStoreUrlIOS: "https://apps.apple.com/app/id317469184",
    appStoreUrlAndroid: "https://play.google.com/store/apps/details?id=com.espn.score_center",
  },
  "Peacock Credit": {
    appScheme: "peacock://",
    websiteUrl: "https://www.peacocktv.com/",
    appName: "Peacock",
    appStoreUrlIOS: "https://apps.apple.com/app/id1508186374",
    appStoreUrlAndroid: "https://play.google.com/store/apps/details?id=com.peacocktv.peacockandroid",
  },
  "NYTimes Credit": {
    appScheme: "nytimes://",
    websiteUrl: "https://www.nytimes.com/",
    appName: "The New York Times",
    appStoreUrlIOS: "https://apps.apple.com/app/id284862083",
    appStoreUrlAndroid: "https://play.google.com/store/apps/details?id=com.nytimes.android",
  },

  /* ────── Walmart+ rebate (Amex Platinum) ────── */
  "Walmart+ Membership Rebate": {
    appScheme: "walmart://",
    websiteUrl: "https://www.walmart.com/plus",
    appName: "Walmart",
    appStoreUrlIOS: "https://apps.apple.com/app/id338137227",
    appStoreUrlAndroid: "https://play.google.com/store/apps/details?id=com.walmart.android",
  },

  /* ────── DoorDash restaurant credit (CSR) ────── */
  "DoorDash Restaurant Credit": {          // distinct from Grocery credit
    appScheme: "doordash://",
    websiteUrl: "https://www.doordash.com/",
    appName: "DoorDash",
    appStoreUrlIOS: "https://apps.apple.com/app/id719972451",
    appStoreUrlAndroid: "https://play.google.com/store/apps/details?id=com.dd.doordash",
  },

  /* ────── Instacart credit (CSR/CSP) ────── */
  "Instacart Credit": {
    appScheme: "instacart://",
    websiteUrl: "https://www.instacart.com/",
    appName: "Instacart",
    appStoreUrlIOS: "https://apps.apple.com/app/id545599256",
    appStoreUrlAndroid: "https://play.google.com/store/apps/details?id=com.instacart.client",
  },

  /* ────── Capital One Venture X travel portal ────── */
  "Capital One Travel Credit": {
    appScheme: "capitalone://",
    websiteUrl: "https://travel.capitalone.com/",
    appName: "Capital One",
    appStoreUrlIOS: "https://apps.apple.com/app/id407558537",
    appStoreUrlAndroid: "https://play.google.com/store/apps/details?id=com.capitalone.mobile",
  },

  /* ────── CLEAR Plus credit (Amex Green) ────── */
  "CLEAR Plus Credit": {
    appScheme: "",                         // no documented scheme
    websiteUrl: "https://www.clearme.com/",
    appName: "CLEAR",
    appStoreUrlIOS: "https://apps.apple.com/app/id1436333504",
    appStoreUrlAndroid: "https://play.google.com/store/apps/details?id=com.clearme.clearapp",
  },
};

export const openPerkTarget = async (perk: CardPerk): Promise<boolean> => {
  const targetConfig = perkNameMappings[perk.name];

  if (!targetConfig) {
    Alert.alert(
      "Unsupported Perk",
      `Deep linking for "${perk.name}" is not configured yet. Would you like to search for it online?`,
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Search Online", 
          onPress: () => Linking.openURL(`https://www.google.com/search?q=${encodeURIComponent(perk.name)}`).catch(err => console.error("Failed to open search:", err))
        }
      ]
    );
    console.warn(`No target configured for perk name: ${perk.name} (ID: ${perk.id})`);
    return false;
  }

  const { appScheme, websiteUrl, appName, appStoreUrlIOS, appStoreUrlAndroid } = targetConfig;
  const friendlyAppName = appName || perk.name.split(' ')[0]; // Default to first word of perk name if appName not specified

  try {
    console.log(`[linking.ts] Checking if app can be opened with scheme: ${appScheme} for perk: ${perk.name}`);
    const canOpenApp = await Linking.canOpenURL(appScheme).catch(err => {
      console.error(`[linking.ts] Error calling canOpenURL for ${appScheme}:`, err);
      return false;
    });
    console.log(`[linking.ts] canOpenURL for ${appScheme} returned: ${canOpenApp}`);

    if (canOpenApp) {
      await Linking.openURL(appScheme);
      return true; // App scheme successfully launched
    } else {
      const storeURL = Platform.OS === 'ios' ? appStoreUrlIOS : appStoreUrlAndroid;

      if (storeURL) {
        Alert.alert(
          `${friendlyAppName} App Not Installed`,
          `The ${friendlyAppName} app is not installed. Would you like to install it from the app store?`,
          [
            { text: "Cancel", style: "cancel" },
            { 
              text: "Install App", 
              onPress: () => Linking.openURL(storeURL).catch(err => {
                console.error(`Failed to open app store link for ${friendlyAppName}:`, err);
                // Fallback to website if store link fails
                Alert.alert(
                  "Could Not Open Store",
                  `We couldn't open the app store. Would you like to visit the ${friendlyAppName} website instead?`,
                  [
                    { text: "Cancel", style: "cancel" },
                    { text: "Open Website", onPress: () => Linking.openURL(websiteUrl).catch(webErr => console.error("Failed to open website:", webErr)) }
                  ]
                );
              }) 
            }
          ]
        );
      } else { // Original fallback: no specific store URL configured
        Alert.alert(
          "App Not Installed",
          `The ${friendlyAppName} app is not installed. Would you like to visit their website instead?`,
          [
            { text: "Cancel", style: "cancel" },
            { text: "Open Website", onPress: () => Linking.openURL(websiteUrl).catch(err => console.error("Failed to open website:", err)) }
          ]
        );
      }
      return false; // App not installed or store link chosen
    }
  } catch (error) {
    console.error(`Failed to process deep link for perk "${perk.name}":`, error);
    Alert.alert(
      "Error Opening Link",
      "An unexpected error occurred while trying to open the link. Please try again later.",
      [{ text: "OK" }]
    );
    // Optionally, try to open the website as a last resort if the error was specific to the app scheme attempt
    // Alert.alert(
    //   "Error",
    //   `Could not open the ${friendlyAppName} app. Would you like to try their website?`,
    //   [
    //     { text: "Cancel", style: "cancel" },
    //     { text: "Open Website", onPress: () => Linking.openURL(websiteUrl).catch(err => console.error("Failed to open website as fallback:", err)) }
    //   ]
    // );
    return false; // Error occurred
  }
}; 