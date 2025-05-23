import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

// --- Basic Notification Configuration ---

// Tell Expo exactly how to display notifications in the foreground.
Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,    // new in recent versions
    shouldShowList: true,      // new in recent versions
  }),
});

// --- Permission Handling ---

/**
 * Requests permission from the user to send notifications.
 * @returns {Promise<boolean>} True if permission granted, false otherwise.
 */
export const requestPermissionsAsync = async (): Promise<boolean> => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status } = await Notifications.requestPermissionsAsync();
  return status === 'granted';
};

// --- Scheduling and Canceling ---

/**
 * Schedules a local notification.
 * @param title The title of the notification.
 * @param body The body/message of the notification.
 * @param date The Date object when the notification should trigger.
 * @returns {Promise<string>} The ID of the scheduled notification.
 */
export const scheduleNotificationAsync = async (
  title: string,
  body: string,
  date: Date,
): Promise<string> => {
  // Build a trigger that Expo expects exactly
  const trigger: Notifications.NotificationTriggerInput = {
    type: Notifications.SchedulableTriggerInputTypes.DATE,
    date,                           // when to fire
    ...(Platform.OS === 'android'
      ? { channelId: 'default' }    // ensure Android channel
      : {}),
  };

  console.log(`Scheduling notification: "${title}" for ${date.toLocaleString()}`);
  return Notifications.scheduleNotificationAsync({
    content: { title, body },
    trigger,
  });
};

/**
 * Cancels all previously scheduled local notifications for the app.
 */
export const cancelAllScheduledNotificationsAsync = async (): Promise<void> => {
  console.log('Cancelling all scheduled notifications.');
  await Notifications.cancelAllScheduledNotificationsAsync();
};

// --- App-Specific Notification Helpers ---

/**
 * Schedules a renewal reminder notification for a specific card.
 * @param cardName The name of the card.
 * @param renewalDate The renewal date of the card.
 * @param daysBefore The number of days before renewal to send the reminder.
 */
export const scheduleCardRenewalReminder = async (
  cardName: string,
  renewalDate: Date,
  daysBefore = 7,
): Promise<string | null> => {
  const reminderDate = new Date(renewalDate);
  reminderDate.setDate(renewalDate.getDate() - daysBefore);
  reminderDate.setHours(23, 59, 50, 0); // Set to 11:59:50 PM

  if (reminderDate > new Date()) {
    return scheduleNotificationAsync(
      `💳 Card Renewal Reminder`,
      `${cardName} renews in ${daysBefore} days on ${renewalDate.toLocaleDateString()}.`,
      reminderDate,
    );
  }
  return null;
};

/**
 * Schedules notifications related to monthly perk resets.
 * - 7 days before end of month
 * - 3 days before end of month
 * - On the 1st of the next month
 */
export const scheduleMonthlyPerkResetNotifications = async (): Promise<(string | null)[]> => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const endOfMonth = new Date(year, month + 1, 0);
  const startOfNext = new Date(year, month + 1, 1);
  startOfNext.setHours(23, 59, 50, 0); // Set to 11:59:50 PM

  const tasks: Promise<string | null>[] = [];

  // 7 days before month end
  const sevenBefore = new Date(endOfMonth);
  sevenBefore.setDate(sevenBefore.getDate() - 7);
  sevenBefore.setHours(23, 59, 50, 0); // Set to 11:59:50 PM
  if (sevenBefore > now) {
    tasks.push(
      scheduleNotificationAsync(
        '✨ Perks Expiring Soon!',
        `~7 days left to use your monthly credits.`,
        sevenBefore,
      ),
    );
  }

  // 3 days before month end
  const threeBefore = new Date(endOfMonth);
  threeBefore.setDate(threeBefore.getDate() - 3);
  threeBefore.setHours(23, 59, 50, 0); // Set to 11:59:50 PM
  if (threeBefore > now) {
    tasks.push(
      scheduleNotificationAsync(
        '⏳ Perks Expiring Very Soon!',
        `~3 days left to use your monthly credits.`,
        threeBefore,
      ),
    );
  }

  // 1st of next month
  if (startOfNext > now) {
    tasks.push(
      scheduleNotificationAsync(
        '🎉 New Month, New Perks!',
        `Your monthly credits have reset.`,
        startOfNext,
      ),
    );
  }

  return Promise.all(tasks);
}; 