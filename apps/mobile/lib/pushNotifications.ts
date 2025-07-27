import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

declare const console: {
  log: (...args: any[]) => void;
  error: (...args: any[]) => void;
};

// Configure notification behavior
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export interface NotificationData {
  type: 'nutrition_reminder' | 'daily_boost' | 'workout_reminder';
  title: string;
  body: string;
  data?: Record<string, any>;
}

const NOTIFICATION_IDS = {
  NUTRITION_REMINDER: 'nutrition_reminder',
  DAILY_BOOST: 'daily_boost',
  WORKOUT_REMINDER: 'workout_reminder',
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    
    if (finalStatus !== 'granted') {
      console.log('Notification permissions not granted');
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return false;
  }
};

export const scheduleNutritionReminder = async (): Promise<void> => {
  try {
    // Cancel existing nutrition reminder
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.NUTRITION_REMINDER);
    
    // Schedule for 6 PM daily
    const trigger = new Date();
    trigger.setHours(18, 0, 0, 0); // 6 PM
    
    // If it's already past 6 PM today, schedule for tomorrow
    if (trigger.getTime() <= Date.now()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.NUTRITION_REMINDER,
      content: {
        title: '🌱 Nutrition Check-in',
        body: 'How did you do on nutrition today? Quick tap to record your progress.',
        data: { type: 'nutrition_reminder' },
      },
              trigger: {
          hour: 18,
          minute: 0,
          repeats: true,
        },
    });

    console.log('Nutrition reminder scheduled for:', trigger.toISOString());
  } catch (error) {
    console.error('Error scheduling nutrition reminder:', error);
  }
};

export const scheduleDailyBoost = async (): Promise<void> => {
  try {
    // Cancel existing daily boost
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.DAILY_BOOST);
    
    // Schedule for 8 AM daily
    const trigger = new Date();
    trigger.setHours(8, 0, 0, 0); // 8 AM
    
    // If it's already past 8 AM today, schedule for tomorrow
    if (trigger.getTime() <= Date.now()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.DAILY_BOOST,
      content: {
        title: '💪 Daily Boost',
        body: 'Start your day with motivation and faith!',
        data: { type: 'daily_boost' },
      },
              trigger: {
          type: 'calendar',
          hour: 8,
          minute: 0,
          repeats: true,
        },
    });

    console.log('Daily boost scheduled for:', trigger.toISOString());
  } catch (error) {
    console.error('Error scheduling daily boost:', error);
  }
};

export const scheduleWorkoutReminder = async (): Promise<void> => {
  try {
    // Cancel existing workout reminder
    await Notifications.cancelScheduledNotificationAsync(NOTIFICATION_IDS.WORKOUT_REMINDER);
    
    // Schedule for 5 PM daily
    const trigger = new Date();
    trigger.setHours(17, 0, 0, 0); // 5 PM
    
    // If it's already past 5 PM today, schedule for tomorrow
    if (trigger.getTime() <= Date.now()) {
      trigger.setDate(trigger.getDate() + 1);
    }

    await Notifications.scheduleNotificationAsync({
      identifier: NOTIFICATION_IDS.WORKOUT_REMINDER,
      content: {
        title: '💪 Workout Time',
        body: 'Ready to log your workout? Keep up the great work!',
        data: { type: 'workout_reminder' },
      },
              trigger: {
          type: 'calendar',
          hour: 17,
          minute: 0,
          repeats: true,
        },
    });

    console.log('Workout reminder scheduled for:', trigger.toISOString());
  } catch (error) {
    console.error('Error scheduling workout reminder:', error);
  }
};

export const setupAllNotifications = async (): Promise<void> => {
  try {
    // Request permissions
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') {
      console.log('Notification permissions not granted');
      return;
    }

    // Get current settings
    const settings = await getNotificationSettings();
    
    // Schedule only enabled notifications
    if (settings.nutritionReminder) {
      await scheduleNutritionReminder();
    }
    
    if (settings.dailyBoost) {
      await scheduleDailyBoost();
    }
    
    if (settings.workoutReminder) {
      await scheduleWorkoutReminder();
    }

    console.log('All notifications scheduled successfully');
  } catch (error) {
    console.error('Error setting up notifications:', error);
  }
};

export const cancelAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
    console.log('All notifications cancelled');
  } catch (error) {
    console.error('Error cancelling notifications:', error);
  }
};

export const getNotificationSettings = async (): Promise<{
  nutritionReminder: boolean;
  dailyBoost: boolean;
  workoutReminder: boolean;
}> => {
  try {
    const stored = await AsyncStorage.getItem('notification_settings');
    if (stored) {
      return JSON.parse(stored);
    }
    
    // Default settings - all disabled
    return {
      nutritionReminder: false,
      dailyBoost: false,
      workoutReminder: false,
    };
  } catch (error) {
    console.error('Error loading notification settings:', error);
    return {
      nutritionReminder: false,
      dailyBoost: false,
      workoutReminder: false,
    };
  }
};

export const saveNotificationSettings = async (settings: {
  nutritionReminder: boolean;
  dailyBoost: boolean;
  workoutReminder: boolean;
}) => {
  try {
    await AsyncStorage.setItem('notification_settings', JSON.stringify(settings));
  } catch (error) {
    console.error('Error saving notification settings:', error);
  }
};

// Handle notification responses
export const setNotificationHandler = (handler: (notification: Notifications.Notification) => void) => {
  Notifications.setNotificationHandler({
    handleNotification: async (notification) => {
      handler(notification);
      return {
        shouldShowBanner: true,
        shouldShowList: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
      };
    },
  });
}; 