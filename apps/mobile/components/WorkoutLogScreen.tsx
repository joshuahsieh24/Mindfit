import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  ScrollView, 
  Alert,
  FlatList,
  ActionSheetIOS,
  Platform
} from 'react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';
import ExercisePicker from './ExercisePicker';
import QuickSetSheet from './QuickSetSheet';
import { getAllExercises, addNewExercise, searchExercises } from '../lib/exercises';
import { 
  addWorkoutSet, 
  updateExistingWorkoutSet, 
  removeWorkoutSet, 
  getAllWorkoutSets,
  getLastUsedValuesForExercise,
  getTodaysWorkoutSets
} from '../lib/workouts';
import type { Exercise, WorkoutSet } from '../lib/storage';

interface WorkoutLogScreenProps {
  onBack?: () => void;
}

export default function WorkoutLogScreen({ onBack }: WorkoutLogScreenProps) {
  const [workoutSets, setWorkoutSets] = useState<WorkoutSet[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showQuickSetSheet, setShowQuickSetSheet] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [editingSet, setEditingSet] = useState<WorkoutSet | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUsedValues, setLastUsedValues] = useState<{ reps: number; weight: number }>({ reps: 10, weight: 75 });

  // Load data on component mount
  useEffect(() => {
    loadWorkoutData();
  }, []);

  const loadWorkoutData = async () => {
    try {
      setIsLoading(true);
      const sets = await getAllWorkoutSets();
      setWorkoutSets(sets);
    } catch (error) {
      console.error('Error loading workout data:', error);
      Alert.alert('Error', 'Failed to load workout data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExerciseSelect = async (exercise: Exercise) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedExercise(exercise);
    setShowExercisePicker(false);
    
    // Load last used values for this exercise
    try {
      const values = await getLastUsedValuesForExercise(exercise.name);
      setLastUsedValues(values);
    } catch (error) {
      console.error('Error loading last used values:', error);
      setLastUsedValues({ reps: 10, weight: 75 });
    }
    
    setShowQuickSetSheet(true);
  };

  const handleAddNewExercise = async (exerciseName: string) => {
    try {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      
      // Check if exercise already exists
      const existingExercises = await searchExercises(exerciseName);
      const exists = existingExercises.some(ex => 
        ex.name.toLowerCase() === exerciseName.toLowerCase()
      );
      
      if (exists) {
        Alert.alert('Exercise Exists', 'This exercise already exists in your list.');
        return;
      }
      
      // Add new exercise
      const newExercise = await addNewExercise(exerciseName, 'Custom');
      handleExerciseSelect(newExercise);
    } catch (error) {
      console.error('Error adding new exercise:', error);
      Alert.alert('Error', 'Failed to add new exercise');
    }
  };

  const handleSaveSet = async (set: WorkoutSet) => {
    try {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      
      if (editingSet) {
        // Update existing set
        await updateExistingWorkoutSet(set);
        setWorkoutSets(prev => prev.map(s => s.id === editingSet.id ? set : s));
        setEditingSet(null);
      } else {
        // Add new set
        await addWorkoutSet(set);
        setWorkoutSets(prev => [set, ...prev]);
      }

      Alert.alert(
        editingSet ? 'Set Updated!' : 'Set Added!',
        `${set.exercise}: ${set.reps} reps @ ${set.weight} lbs`,
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Error saving set:', error);
      Alert.alert('Error', 'Failed to save workout set');
    }
  };

  const handleLongPress = (set: WorkoutSet) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancel', 'Edit', 'Delete'],
          destructiveButtonIndex: 2,
          cancelButtonIndex: 0,
        },
        async (buttonIndex) => {
          if (buttonIndex === 1) {
            // Edit
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            const exercise = await getAllExercises();
            const foundExercise = exercise.find(e => e.name === set.exercise) || {
              id: 'custom',
              name: set.exercise,
              category: 'Custom',
              createdAt: new Date(),
            };
            setSelectedExercise(foundExercise);
            setEditingSet(set);
            setLastUsedValues({ reps: set.reps, weight: set.weight });
            setShowQuickSetSheet(true);
          } else if (buttonIndex === 2) {
            // Delete
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
            Alert.alert(
              'Delete Set',
              `Are you sure you want to delete this ${set.exercise} set?`,
              [
                { text: 'Cancel', style: 'cancel' },
                { 
                  text: 'Delete', 
                  style: 'destructive',
                  onPress: async () => {
                    try {
                      await removeWorkoutSet(set.id);
                      setWorkoutSets(prev => prev.filter(s => s.id !== set.id));
                    } catch (error) {
                      console.error('Error deleting set:', error);
                      Alert.alert('Error', 'Failed to delete workout set');
                    }
                  }
                }
              ]
            );
          }
        }
      );
    } else {
      // For Android, show a simple alert with options
      Alert.alert(
        'Set Options',
        'What would you like to do?',
        [
          { text: 'Cancel', style: 'cancel' },
          { 
            text: 'Edit', 
            onPress: async () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              const exercise = await getAllExercises();
              const foundExercise = exercise.find(e => e.name === set.exercise) || {
                id: 'custom',
                name: set.exercise,
                category: 'Custom',
                createdAt: new Date(),
              };
              setSelectedExercise(foundExercise);
              setEditingSet(set);
              setLastUsedValues({ reps: set.reps, weight: set.weight });
              setShowQuickSetSheet(true);
            }
          },
          { 
            text: 'Delete', 
            style: 'destructive',
            onPress: () => {
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
              Alert.alert(
                'Delete Set',
                `Are you sure you want to delete this ${set.exercise} set?`,
                [
                  { text: 'Cancel', style: 'cancel' },
                  { 
                    text: 'Delete', 
                    style: 'destructive',
                    onPress: async () => {
                      try {
                        await removeWorkoutSet(set.id);
                        setWorkoutSets(prev => prev.filter(s => s.id !== set.id));
                      } catch (error) {
                        console.error('Error deleting set:', error);
                        Alert.alert('Error', 'Failed to delete workout set');
                      }
                    }
                  }
                ]
              );
            }
          }
        ]
      );
    }
  };

  const renderWorkoutSet = ({ item, index }: { item: WorkoutSet; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 200, delay: index * 50 }}
    >
      <TouchableOpacity
        style={styles.setItem}
        onLongPress={() => handleLongPress(item)}
        delayLongPress={500}
        accessibilityLabel={`${item.exercise} set, ${item.reps} reps at ${item.weight} pounds`}
        accessibilityHint="Long press to edit or delete this set"
      >
        <Text style={styles.setExercise}>{item.exercise}</Text>
        <Text style={styles.setDetails}>
          {item.reps} reps @ {item.weight} lbs
        </Text>
        <Text style={styles.setTime}>
          {new Date(item.timestamp).toLocaleTimeString()}
        </Text>
      </TouchableOpacity>
    </MotiView>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={onBack} 
            style={styles.backButton}
            accessibilityLabel="Go back to main screen"
          >
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>Workout Log</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity 
          onPress={onBack} 
          style={styles.backButton}
          accessibilityLabel="Go back to main screen"
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Workout Log</Text>
      </View>
      
      <ScrollView 
        style={styles.setsContainer}
        contentContainerStyle={styles.setsContentContainer}
        showsVerticalScrollIndicator={false}
      >
        {workoutSets.length === 0 ? (
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', duration: 200 }}
          >
            <Text style={styles.emptyText}>
              No sets logged yet. Tap the + button to add your first set!
            </Text>
          </MotiView>
        ) : (
          <FlatList
            data={workoutSets}
            renderItem={renderWorkoutSet}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
            contentContainerStyle={styles.flatListContentContainer}
          />
        )}
      </ScrollView>

      {/* Floating + Button */}
      <MotiView
        from={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', damping: 15 }}
      >
        <TouchableOpacity
          style={styles.floatingButton}
          onPress={() => {
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            setShowExercisePicker(true);
          }}
          accessibilityLabel="Add new workout set"
          accessibilityHint="Opens exercise picker to add a new set"
        >
          <Text style={styles.floatingButtonText}>+</Text>
        </TouchableOpacity>
      </MotiView>

      {/* Enhanced Exercise Picker */}
      <ExercisePicker
        visible={showExercisePicker}
        onClose={() => setShowExercisePicker(false)}
        onSelectExercise={handleExerciseSelect}
        onAddNewExercise={handleAddNewExercise}
      />

      {/* Quick Set Sheet */}
      <QuickSetSheet
        visible={showQuickSetSheet}
        exercise={selectedExercise}
        onClose={() => {
          setShowQuickSetSheet(false);
          setEditingSet(null);
        }}
        onSave={handleSaveSet}
        lastUsedValues={editingSet ? { reps: editingSet.reps, weight: editingSet.weight } : lastUsedValues}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: {
    marginRight: 20,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 16,
  },
  setsContainer: {
    flex: 1,
  },
  setsContentContainer: {
    padding: 20,
    paddingBottom: 200, // Much more padding to ensure last item is fully visible
  },
  flatListContentContainer: {
    paddingBottom: 0, // Remove default padding since we handle it in parent
  },
  emptyText: {
    color: '#8E8E93',
    textAlign: 'center',
    fontSize: 16,
    marginTop: 100,
  },
  setItem: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  setExercise: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 4,
  },
  setDetails: {
    color: '#EBEBF5',
    fontSize: 16,
    marginBottom: 4,
  },
  setTime: {
    color: '#8E8E93',
    fontSize: 14,
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
  floatingButtonText: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
  },
}); 