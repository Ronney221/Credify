# Credify: Credit Card Perk Optimizer & Tracker 🚀

Credify is a mobile application designed to help you unlock the full potential of your credit card rewards and benefits. Stop leaving money on the table and start maximizing your savings with intelligent perk tracking, timely reminders, and a gamified redemption experience!
![1-portrait](https://github.com/user-attachments/assets/3c13b338-c85f-43d9-856f-0c534a8f9ada)

![2-left](https://github.com/user-attachments/assets/f036e115-bde7-4aa7-8f79-3636cbf191d3)

## What is Credify? 🤔

Do you have multiple credit cards, each with a unique set of perks like monthly dining credits, travel bonuses, or subscription rebates? It can be challenging to keep track of them all, leading to missed opportunities and lost value.

Credify simplifies this by:

*   Allowing you to select your credit cards from a pre-populated list (Amex Gold, Chase Sapphire Reserve, Amex Platinum, and many more!).
*   Displaying all associated perks in an easy-to-navigate dashboard.
*   Helping you track the redemption status of each perk ('available', 'pending', 'redeemed').
*   Providing deep-linking capabilities to quickly open the relevant merchant app or website to redeem your perk.
*   Motivating you with gamification features like redemption streaks and progress tracking.
*   Sending timely notifications for monthly perk resets and upcoming card renewal dates.

## Key Features ✨

*   **Easy Card Selection:** Add your credit cards and optionally set annual renewal dates.
*   **Comprehensive Dashboard:** Get an at-a-glance view of your potential vs. redeemed value for the month and year.
*   **Perk Tracking:** See a detailed list of perks for each selected card.
*   **One-Tap Redemption:** "Redeem" button deep-links to merchant apps (e.g., Uber, Grubhub, Resy) or websites. Multi-choice alerts for flexible credits!
*   **Status Management:** Manually update perk status (Available, Pending, Redeemed) with a long-press.
*   **Visual Progress:** UI updates reflect perk status (styling changes, progress bars).
*   **Gamification Engine:**
    *   **Streak Tracking:** Build monthly redemption streaks for perks (🔥🥉🥈🏆) and see cold streaks (🥶) for missed opportunities.
    *   **Value Saved:** See cumulative value saved per card and overall.
    *   **Celebration Animations:** Enjoy a little celebration for full-month perk completions!
*   **Smart Notifications:**
    *   Reminders for monthly perk resets (7 days before, 3 days before, 1st of month).
    *   Alerts for upcoming credit card annual renewal dates.
*   **Theme Support:** Adapts to your device's light/dark mode.

## Why Use Credify? 💰

*   **Save Money:** Never miss out on valuable statement credits or discounts again.
*   **Stay Organized:** All your perks, their values, and statuses in one place.
*   **Discover Value:** Easily see how much potential value your cards offer.
*   **Effortless Redemption:** Quick links to redeem perks directly.
*   **Motivation:** Gamification helps you build good habits around using your benefits.

## Technology Stack 💻

This application showcases proficiency in a modern mobile development stack:

*   **Frontend:** React Native, Expo
*   **Language:** TypeScript
*   **Navigation:** Expo Router (file-based routing)
*   **State Management:** React Hooks (`useState`, `useEffect`, `useCallback`), Context API (implied for theme)
*   **UI & Styling:**
    *   Custom React Native components
    *   React Native StyleSheet for styling
    *   Lottie by Airbnb for animations (`lottie-react-native`)
    *   Date Time Picker (`@react-native-community/datetimepicker`)
    *   Safe Area Handling (`react-native-safe-area-context`)
*   **Push Notifications:** `expo-notifications`
*   **Deep Linking:** React Native `Linking` API, `expo-linking`
*   **Device Features:** `expo-status-bar`, `expo-haptics` (via HapticTab)
*   **Development Workflow:** Expo CLI, Development Builds, Simulators/Emulators

*(Planned Future Backend: Firebase for Authentication and Firestore database, potentially with FastAPI/Node.js for a dedicated API layer if needed).*

## Project Status 🚧

This project is currently at a Minimum Viable Product (MVP) stage, demonstrating core functionality. Future enhancements are planned as outlined in the `todo.md` file, including full backend integration for data persistence and user accounts.

## Getting Started (Development) 🧑‍💻

1.  **Install dependencies:**
    ```bash
    npm install
    ```
    (or `yarn install`)

2.  **Start the Expo development server:**
    ```bash
    npx expo start
    ```
    Follow the prompts to open the app in an iOS simulator, Android emulator, or on a physical device using the Expo Go app (for features not requiring native builds) or a development build.

3.  **To run on a specific platform with native capabilities (recommended for full feature testing):**
    ```bash
    npx expo run:ios
    # or
    npx expo run:android
    ```

## Screenshots & Demo 📸

*(Placeholder: Consider adding a GIF or a few key screenshots of the app in action here! This significantly boosts a README's appeal.)*

---

*This README is actively maintained. For a detailed list of planned features and ongoing tasks, please see the `todo.md` file in this repository.* 
