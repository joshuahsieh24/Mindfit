import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import LoginScreen from './components/LoginScreen';
import WorkoutLogScreen from './components/WorkoutLogScreen';
import DailyBoostCard from './components/DailyBoostCard';
import NutritionGoalsCard from './components/NutritionGoalsCard';
import NotificationSettings from './components/NotificationSettings';
import { setupAllNotifications, setNotificationHandler } from './lib/pushNotifications';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'main' | 'workout'>('main');
  const [showSettings, setShowSettings] = useState(false);

  useEffect(() => {
    // Initialize notifications when app starts
    initializeNotifications();
  }, []);

  const initializeNotifications = async () => {
    try {
      // Set up notification handler
      setNotificationHandler((notification) => {
        console.log('Notification received:', notification);
        
        // Handle different notification types
        const data = notification.request.content.data;
        if (data?.type === 'nutrition_reminder') {
          Alert.alert(
            '🌱 Nutrition Check-in',
            'How did you do on nutrition today? Quick tap to record your progress.',
            [
              { text: 'Later', style: 'cancel' },
              { text: 'Record Now', onPress: () => console.log('Navigate to nutrition') }
            ]
          );
        } else if (data?.type === 'daily_boost') {
          Alert.alert(
            '💪 Daily Boost',
            'Start your day with motivation and faith!',
            [
              { text: 'Later', style: 'cancel' },
              { text: 'View Boost', onPress: () => console.log('Show daily boost') }
            ]
          );
        } else if (data?.type === 'workout_reminder') {
          Alert.alert(
            '💪 Workout Time',
            'Ready to log your workout? Keep up the great work!',
            [
              { text: 'Later', style: 'cancel' },
              { text: 'Log Workout', onPress: () => setCurrentScreen('workout') }
            ]
          );
        }
      });

      // Set up all notifications
      await setupAllNotifications();
    } catch (error) {
      console.error('Error initializing notifications:', error);
    }
  };

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  if (currentScreen === 'workout') {
    return <WorkoutLogScreen onBack={() => setCurrentScreen('main')} />;
  }

  if (showSettings) {
    return (
      <View style={styles.container}>
        <NotificationSettings onClose={() => setShowSettings(false)} />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Settings Button */}
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={() => setShowSettings(true)}
        accessible={true}
        accessibilityLabel="Open notification settings"
        accessibilityRole="button"
      >
        <Text style={styles.settingsButtonText}>⚙️</Text>
      </TouchableOpacity>

      <Text style={styles.title}>MindFit</Text>
      <Text style={styles.subtitle}>Your Personal Fitness & Faith Journey</Text>
      
      {/* Daily Boost Card - positioned at the top */}
      <DailyBoostCard />
      
      {/* Nutrition Goals Card */}
      <NutritionGoalsCard />
      
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Welcome Back!</Text>
        <Text style={styles.cardText}>
          Ready to log your workout and receive your daily boost?
        </Text>
        
        <TouchableOpacity 
          style={styles.button}
          onPress={() => setCurrentScreen('workout')}
        >
          <Text style={styles.buttonText}>Log Workout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  contentContainer: {
    padding: 24,
    paddingTop: 60, // Extra padding for status bar
  },
  settingsButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  settingsButtonText: {
    fontSize: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
    marginBottom: 48,
  },
  card: {
    backgroundColor: '#1C1C1E',
    padding: 20,
    borderRadius: 12,
    marginTop: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  cardText: {
    fontSize: 16,
    color: '#EBEBF5',
    lineHeight: 24,
    marginBottom: 20,
  },
  button: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
