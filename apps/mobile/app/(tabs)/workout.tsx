import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { theme } from '../../lib/theme';
import { WorkoutService } from '../../lib/workoutService';
import { WorkoutSet, Exercise, DailyBoost } from '../../lib/types';
import { CustomBottomSheet } from '../../components/BottomSheet';
import { CollapsibleCard } from '../../components/CollapsibleCard';
import { ExerciseSelectionSheet } from '../../components/ExerciseSelectionSheet';
import { SetEntrySheet } from '../../components/SetEntrySheet';

// Mock daily boost data for now
const mockDailyBoosts: DailyBoost[] = [
  {
    id: '1',
    title: 'Confidence',
    emoji: '💪',
    message: 'You are stronger than you think.',
    verse: 'Philippians 4:13',
    details: 'I can do all things through Christ who strengthens me. Every rep, every set, every moment of pushing through discomfort builds not just physical strength, but the confidence that comes from knowing you can overcome challenges.',
    created_at: new Date().toISOString(),
  },
  {
    id: '2',
    title: 'Joy',
    emoji: '😊',
    message: 'Find joy in the journey of growth.',
    verse: 'Nehemiah 8:10',
    details: 'The joy of the Lord is your strength. Training isn\'t just about the destination - it\'s about celebrating each small victory, each improvement, and finding happiness in the process of becoming better.',
    created_at: new Date().toISOString(),
  },
  {
    id: '3',
    title: 'Relationships',
    emoji: '🤝',
    message: 'Iron sharpens iron.',
    verse: 'Proverbs 27:17',
    details: 'As iron sharpens iron, so one person sharpens another. Your fitness journey can inspire others, and their support can push you to new heights. We grow stronger together.',
    created_at: new Date().toISOString(),
  },
];

export default function WorkoutScreen() {
  const [todaySets, setTodaySets] = useState<WorkoutSet[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showExerciseSheet, setShowExerciseSheet] = useState(false);
  const [showSetEntrySheet, setShowSetEntrySheet] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [sets, exerciseList] = await Promise.all([
        WorkoutService.getTodaySets(),
        WorkoutService.getExercises(),
      ]);
      
      setTodaySets(sets);
      setExercises(exerciseList);
    } catch (error) {
      console.error('Error loading data:', error);
      Alert.alert('Error', 'Failed to load workout data');
    } finally {
      setLoading(false);
    }
  };

  const handleFabPress = () => {
    setShowExerciseSheet(true);
  };

  const handleExerciseSelect = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setShowExerciseSheet(false);
    setShowSetEntrySheet(true);
  };

  const handleSetSave = async (reps: number, weight: number) => {
    if (!selectedExercise) return;

    try {
      const newSet = await WorkoutService.addSet(selectedExercise.name, reps, weight);
      if (newSet) {
        setTodaySets([newSet, ...todaySets]);
        Alert.alert('Success', 'Set saved successfully!');
      }
    } catch (error) {
      console.error('Error saving set:', error);
      Alert.alert('Error', 'Failed to save set');
    } finally {
      setShowSetEntrySheet(false);
      setSelectedExercise(null);
    }
  };

  const renderSetItem = ({ item }: { item: WorkoutSet }) => (
    <View style={styles.setItem}>
      <Text style={styles.exerciseName}>{item.exercise}</Text>
      <Text style={styles.setDetails}>
        {item.reps} × {item.weight}kg
      </Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Today's Sets</Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Daily Boost Cards */}
        <View style={styles.boostSection}>
          {mockDailyBoosts.map((boost) => (
            <CollapsibleCard key={boost.id} boost={boost} />
          ))}
        </View>

        {/* Sets List */}
        <View style={styles.setsSection}>
          <Text style={styles.sectionTitle}>Your Sets</Text>
          {todaySets.length > 0 ? (
            <FlashList
              data={todaySets}
              renderItem={renderSetItem}
              estimatedItemSize={60}
              showsVerticalScrollIndicator={false}
            />
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No sets logged today. Tap the + button to add your first set!
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* FAB */}
      <TouchableOpacity
        style={styles.fab}
        onPress={handleFabPress}
        activeOpacity={0.8}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {/* Exercise Selection Sheet */}
      <CustomBottomSheet
        isOpen={showExerciseSheet}
        onClose={() => setShowExerciseSheet(false)}
        snapPoints={['60%']}
      >
        <ExerciseSelectionSheet
          exercises={exercises}
          onExerciseSelect={handleExerciseSelect}
        />
      </CustomBottomSheet>

      {/* Set Entry Sheet */}
      <CustomBottomSheet
        isOpen={showSetEntrySheet}
        onClose={() => setShowSetEntrySheet(false)}
        snapPoints={['50%']}
      >
        <SetEntrySheet
          exercise={selectedExercise?.name || ''}
          onSave={handleSetSave}
          lastSet={selectedExercise ? todaySets.find(s => s.exercise === selectedExercise.name) || null : null}
        />
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: theme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: theme.colors.text.primary,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  boostSection: {
    marginBottom: 24,
  },
  setsSection: {
    flex: 1,
    paddingBottom: 100, // Space for FAB
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 16,
  },
  setItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  setDetails: {
    fontSize: 18,
    color: theme.colors.text.muted,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: theme.colors.text.muted,
    textAlign: 'center',
    lineHeight: 24,
  },
  fab: {
    position: 'absolute',
    bottom: 32,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.27,
    elevation: 8,
  },
  fabText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
}); 