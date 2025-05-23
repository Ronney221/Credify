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
  "Uber Credits": { // Example: For a generic Uber credit perk
    appScheme: 'uber://',
    websiteUrl: 'https://www.uber.com/ride/',
    appName: 'Uber',
  },
  // Add more perk name mappings here
  // e.g., "Monthly Dining Credit": { appScheme: 'resy://', websiteUrl: 'https://resy.com', appName: 'Resy' }
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
    const canOpenApp = await Linking.canOpenURL(appScheme);
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