import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Switch, Alert, SafeAreaView } from 'react-native';
import { getNotificationSettings, setupAllNotifications, cancelAllNotifications, scheduleNutritionReminder, scheduleDailyBoost, scheduleWorkoutReminder } from '../lib/pushNotifications';

interface NotificationSettingsProps {
  onClose: () => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ onClose }) => {
  const [settings, setSettings] = useState({
    nutritionReminder: false,
    dailyBoost: false,
    workoutReminder: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      const currentSettings = await getNotificationSettings();
      setSettings(currentSettings);
    } catch (error) {
      console.error('Error loading notification settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleSetting = async (setting: keyof typeof settings) => {
    try {
      const newSettings = { ...settings, [setting]: !settings[setting] };
      setSettings(newSettings);

      // Schedule only the specific notification that was toggled
      if (setting === 'nutritionReminder') {
        if (newSettings.nutritionReminder) {
          await scheduleNutritionReminder();
        } else {
          // Cancel only nutrition reminder
          const { cancelScheduledNotificationAsync } = await import('expo-notifications');
          await cancelScheduledNotificationAsync('nutrition_reminder');
        }
      } else if (setting === 'dailyBoost') {
        if (newSettings.dailyBoost) {
          await scheduleDailyBoost();
        } else {
          // Cancel only daily boost
          const { cancelScheduledNotificationAsync } = await import('expo-notifications');
          await cancelScheduledNotificationAsync('daily_boost');
        }
      } else if (setting === 'workoutReminder') {
        if (newSettings.workoutReminder) {
          await scheduleWorkoutReminder();
        } else {
          // Cancel only workout reminder
          const { cancelScheduledNotificationAsync } = await import('expo-notifications');
          await cancelScheduledNotificationAsync('workout_reminder');
        }
      }

      // Save settings to AsyncStorage
      const { AsyncStorage } = await import('@react-native-async-storage/async-storage');
      if (newSettings.nutritionReminder || newSettings.dailyBoost || newSettings.workoutReminder) {
        await AsyncStorage.setItem('notifications_setup', new Date().toISOString());
      } else {
        await AsyncStorage.removeItem('notifications_setup');
      }

      Alert.alert(
        newSettings[setting] ? 'Notification Enabled' : 'Notification Disabled',
        newSettings[setting] 
          ? `You'll receive ${setting === 'nutritionReminder' ? 'nutrition' : setting === 'dailyBoost' ? 'daily boost' : 'workout'} reminders!`
          : 'You can re-enable this notification anytime.'
      );
    } catch (error) {
      console.error('Error updating notification settings:', error);
      Alert.alert('Error', 'Failed to update notification settings. Please try again.');
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
          <Text style={styles.loadingText}>Loading settings...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Notification Settings</Text>
          <View style={styles.headerSpacer} />
        </View>

        <Text style={styles.description}>
          Stay motivated with helpful reminders throughout your day.
        </Text>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>🌱 Nutrition Reminder</Text>
            <Text style={styles.settingDescription}>
              Daily reminder at 6 PM to record your nutrition progress
            </Text>
          </View>
          <Switch
            value={settings.nutritionReminder}
            onValueChange={() => handleToggleSetting('nutritionReminder')}
            trackColor={{ false: '#2C2C2E', true: '#007AFF' }}
            thumbColor={settings.nutritionReminder ? '#FFFFFF' : '#8E8E93'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>💪 Daily Boost</Text>
            <Text style={styles.settingDescription}>
              Morning motivation with faith-based encouragement at 8 AM
            </Text>
          </View>
          <Switch
            value={settings.dailyBoost}
            onValueChange={() => handleToggleSetting('dailyBoost')}
            trackColor={{ false: '#2C2C2E', true: '#007AFF' }}
            thumbColor={settings.dailyBoost ? '#FFFFFF' : '#8E8E93'}
          />
        </View>

        <View style={styles.settingRow}>
          <View style={styles.settingInfo}>
            <Text style={styles.settingTitle}>💪 Workout Reminder</Text>
            <Text style={styles.settingDescription}>
              Afternoon reminder at 5 PM to log your workout
            </Text>
          </View>
          <Switch
            value={settings.workoutReminder}
            onValueChange={() => handleToggleSetting('workoutReminder')}
            trackColor={{ false: '#2C2C2E', true: '#007AFF' }}
            thumbColor={settings.workoutReminder ? '#FFFFFF' : '#8E8E93'}
          />
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.infoTitle}>ℹ️ About Notifications</Text>
          <Text style={styles.infoText}>
            • Notifications help you build healthy habits{'\n'}
            • You can change these settings anytime{'\n'}
            • Notifications are sent locally on your device{'\n'}
            • No data is shared with external services
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#000',
  },
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 20, // Extra padding for status bar
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    flex: 1,
    textAlign: 'center',
  },
  headerSpacer: {
    width: 60, // Same width as back button for centering
  },
  description: {
    fontSize: 14,
    color: '#8E8E93',
    lineHeight: 20,
    marginBottom: 32,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  settingInfo: {
    flex: 1,
    marginRight: 16,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
  },
  infoSection: {
    marginTop: 32,
    padding: 16,
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 18,
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default NotificationSettings; 