import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, Dimensions } from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface DailyBoost {
  theme: string;
  message: string;
  verse: string;
  verseReference: string;
}

const DAILY_BOOSTS: DailyBoost[] = [
  {
    theme: '💪 Confidence Boost',
    message: 'You are fearfully and wonderfully made. Today, walk with the confidence that comes from knowing you are loved by the Creator of the universe.',
    verse: 'For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.',
    verseReference: 'Jeremiah 29:11'
  },
  {
    theme: '😊 Joy Boost',
    message: 'Joy is not dependent on circumstances. It flows from the deep well of God\'s presence within you. Let your light shine today!',
    verse: 'The joy of the Lord is your strength.',
    verseReference: 'Nehemiah 8:10'
  },
  {
    theme: '🤝 Relationship Boost',
    message: 'Love others as Christ has loved you. Every interaction is an opportunity to reflect God\'s grace and kindness.',
    verse: 'Above all, love each other deeply, because love covers over a multitude of sins.',
    verseReference: '1 Peter 4:8'
  },
  {
    theme: '🌟 Purpose Boost',
    message: 'You were created for a purpose. Every step you take today is part of God\'s beautiful plan for your life.',
    verse: 'For we are God\'s handiwork, created in Christ Jesus to do good works, which God prepared in advance for us to do.',
    verseReference: 'Ephesians 2:10'
  },
  {
    theme: '💫 Peace Boost',
    message: 'In the midst of life\'s storms, find peace in knowing that God is in control. His peace surpasses all understanding.',
    verse: 'Peace I leave with you; my peace I give you. I do not give to you as the world gives. Do not let your hearts be troubled and do not be afraid.',
    verseReference: 'John 14:27'
  }
];

const DailyBoostCard: React.FC = () => {
  const [currentBoost, setCurrentBoost] = useState<DailyBoost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullScreen, setShowFullScreen] = useState(false);

  useEffect(() => {
    loadDailyBoost();
  }, []);

  const loadDailyBoost = async () => {
    try {
      const today = new Date().toDateString();
      const stored = await AsyncStorage.getItem('dailyBoostDate');
      
      if (stored === today) {
        // Use today's boost
        const boostIndex = await AsyncStorage.getItem('dailyBoostIndex');
        const index = boostIndex ? parseInt(boostIndex) : 0;
        setCurrentBoost(DAILY_BOOSTS[index]);
      } else {
        // Get new boost for today
        const randomIndex = Math.floor(Math.random() * DAILY_BOOSTS.length);
        setCurrentBoost(DAILY_BOOSTS[randomIndex]);
        await AsyncStorage.setItem('dailyBoostDate', today);
        await AsyncStorage.setItem('dailyBoostIndex', randomIndex.toString());
      }
    } catch (error) {
      console.error('Error loading daily boost:', error);
      setCurrentBoost(DAILY_BOOSTS[0]); // Fallback
    } finally {
      setIsLoading(false);
    }
  };

  const handleCardPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowFullScreen(true);
  };

  const handleCloseFullScreen = () => {
    setShowFullScreen(false);
  };

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.loadingText}>Your boost is on the way...</Text>
        </View>
      </View>
    );
  }

  if (!currentBoost) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.loadingText}>Your boost is on the way...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <TouchableOpacity 
          style={styles.card}
          onPress={handleCardPress}
          activeOpacity={0.8}
          accessible={true}
          accessibilityLabel="Daily boost card, tap to view full message"
          accessibilityRole="button"
        >
          <Text style={styles.theme}>{currentBoost.theme}</Text>
          <Text style={styles.versePreview} numberOfLines={3} ellipsizeMode="tail">
            "{currentBoost.verse}"
          </Text>
          <Text style={styles.verseReference}>{currentBoost.verseReference}</Text>
          <Text style={styles.tapHint}>Tap for more</Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={showFullScreen}
        animationType="fade"
        presentationStyle="fullScreen"
      >
        <View style={styles.fullScreenContainer}>
          {/* Peaceful gradient background */}
          <View style={styles.backgroundGradient}>
            <View style={styles.backgroundPattern} />
          </View>
          
          {/* Close button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseFullScreen}
            accessible={true}
            accessibilityLabel="Close daily boost"
            accessibilityRole="button"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>

          {/* Content */}
          <View style={styles.fullScreenContent}>
            <Text style={styles.fullScreenTheme}>{currentBoost.theme}</Text>
            <Text style={styles.fullScreenMessage}>{currentBoost.message}</Text>
            <View style={styles.verseContainer}>
              <Text style={styles.fullScreenVerse}>"{currentBoost.verse}"</Text>
              <Text style={styles.fullScreenVerseReference}>— {currentBoost.verseReference}</Text>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
};

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
    minHeight: 140,
  },
  theme: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  versePreview: {
    fontSize: 16,
    color: '#EBEBF5',
    lineHeight: 24,
    marginBottom: 8,
    fontStyle: 'italic',
  },
  verseReference: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
    marginBottom: 8,
  },
  tapHint: {
    fontSize: 12,
    color: '#8E8E93',
    textAlign: 'right',
    fontStyle: 'italic',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
  fullScreenContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  backgroundGradient: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#1a1a2e',
  },
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'transparent',
    opacity: 0.1,
    // Create a subtle pattern effect
    backgroundImage: 'radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(255,255,255,0.05) 0%, transparent 50%)',
  },
  closeButton: {
    position: 'absolute',
    top: 60,
    left: 20,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  fullScreenContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
    paddingTop: 120,
    paddingBottom: 60,
  },
  fullScreenTheme: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.5)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  fullScreenMessage: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 32,
    marginBottom: 40,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  verseContainer: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    maxWidth: width * 0.8,
  },
  fullScreenVerse: {
    fontSize: 18,
    fontWeight: '500',
    color: '#FFFFFF',
    textAlign: 'center',
    lineHeight: 28,
    marginBottom: 12,
    fontStyle: 'italic',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  fullScreenVerseReference: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.9,
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default DailyBoostCard; 