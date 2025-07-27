import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import LoginScreen from './components/LoginScreen';
import WorkoutLogScreen from './components/WorkoutLogScreen';
import DailyBoostCard from './components/DailyBoostCard';

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState<'main' | 'workout'>('main');

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  if (currentScreen === 'workout') {
    return <WorkoutLogScreen onBack={() => setCurrentScreen('main')} />;
  }

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>MindFit</Text>
      <Text style={styles.subtitle}>Your Personal Fitness & Faith Journey</Text>
      
      {/* Daily Boost Card - positioned at the top */}
      <DailyBoostCard />
      
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
