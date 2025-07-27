import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated } from 'react-native';
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
  const [isExpanded, setIsExpanded] = useState(true);
  const [currentBoost, setCurrentBoost] = useState<DailyBoost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const expandAnim = new Animated.Value(1);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    loadDailyBoost();
    loadExpandedState();
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

  const loadExpandedState = async () => {
    try {
      const stored = await AsyncStorage.getItem('dailyBoostExpanded');
      if (stored !== null) {
        const expanded = JSON.parse(stored);
        setIsExpanded(expanded);
        if (!expanded) {
          expandAnim.setValue(0.5);
        }
      }
    } catch (error) {
      console.error('Error loading expanded state:', error);
    }
  };

  const toggleExpanded = async () => {
    const newExpanded = !isExpanded;
    setIsExpanded(newExpanded);
    
    // Save state
    try {
      await AsyncStorage.setItem('dailyBoostExpanded', JSON.stringify(newExpanded));
    } catch (error) {
      console.error('Error saving expanded state:', error);
    }

    // Animate
    if (newExpanded) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      Animated.parallel([
        Animated.timing(expandAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 400,
          useNativeDriver: false,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(expandAnim, {
          toValue: 0.5,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: false,
        }),
      ]).start();
    }
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
    <View style={styles.container}>
      <Animated.View 
        style={[
          styles.card,
          {
            height: expandAnim.interpolate({
              inputRange: [0.5, 1],
              outputRange: [80, 160],
            }),
          }
        ]}
        accessible={true}
        accessibilityLabel="Daily boost card, tap to expand"
        accessibilityRole="button"
      >
        <TouchableOpacity 
          style={styles.touchable}
          onPress={toggleExpanded}
          activeOpacity={0.8}
        >
          <View style={styles.header}>
            <Text style={styles.theme}>{currentBoost.theme}</Text>
            <Text style={styles.arrow}>{isExpanded ? '▼' : '▶'}</Text>
          </View>
          
          {isExpanded && (
            <Animated.View 
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                }
              ]}
            >
              <Text style={styles.message}>{currentBoost.message}</Text>
              <Text style={styles.verse}>{currentBoost.verse}</Text>
              <Text style={styles.verseReference}>{currentBoost.verseReference}</Text>
            </Animated.View>
          )}
        </TouchableOpacity>
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#2C2C2E',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
    overflow: 'hidden',
  },
  touchable: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  theme: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  arrow: {
    fontSize: 16,
    color: '#8E8E93',
    marginLeft: 8,
  },
  content: {
    marginTop: 8,
  },
  message: {
    fontSize: 16,
    color: '#EBEBF5',
    lineHeight: 24,
    marginBottom: 12,
  },
  verse: {
    fontSize: 14,
    color: '#EBEBF5',
    fontStyle: 'italic',
    lineHeight: 20,
    marginBottom: 8,
  },
  verseReference: {
    fontSize: 12,
    color: '#8E8E93',
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
  },
});

export default DailyBoostCard; 