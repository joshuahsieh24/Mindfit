import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
} from 'react-native';
import { MotiView } from 'moti';
import * as Haptics from 'expo-haptics';

interface Exercise {
  id: string;
  name: string;
  category: string;
}

interface WorkoutSet {
  id: string;
  exercise: string;
  reps: number;
  weight: number;
  timestamp: Date;
}

interface QuickSetSheetProps {
  visible: boolean;
  exercise: Exercise | null;
  onClose: () => void;
  onSave: (set: WorkoutSet) => void;
  lastUsedValues?: { reps: number; weight: number };
}

export default function QuickSetSheet({
  visible,
  exercise,
  onClose,
  onSave,
  lastUsedValues = { reps: 10, weight: 75 },
}: QuickSetSheetProps) {
  const [reps, setReps] = useState(lastUsedValues.reps);
  const [weight, setWeight] = useState(lastUsedValues.weight);

  useEffect(() => {
    if (visible && lastUsedValues) {
      setReps(lastUsedValues.reps);
      setWeight(lastUsedValues.weight);
    }
  }, [visible, lastUsedValues]);

  const handleSave = () => {
    if (!exercise) return;

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      exercise: exercise.name,
      reps,
      weight,
      timestamp: new Date(),
    };

    onSave(newSet);
    onClose();
  };

  const incrementReps = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReps(prev => prev + 1);
  };
  
  const decrementReps = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setReps(prev => Math.max(1, prev - 1));
  };
  
  const incrementWeight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWeight(prev => prev + 5);
  };
  
  const decrementWeight = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setWeight(prev => Math.max(0, prev - 5));
  };

  if (!exercise) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 200 }}
          style={styles.header}
        >
          <Text style={styles.title}>Log Set</Text>
          <TouchableOpacity 
            onPress={onClose} 
            style={styles.closeButton}
            accessibilityLabel="Close set sheet"
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 200, delay: 100 }}
          style={styles.exerciseInfo}
        >
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseCategory}>{exercise.category}</Text>
        </MotiView>

        <View style={styles.controlsContainer}>
          {/* Reps Control */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 200, delay: 200 }}
            style={styles.controlGroup}
          >
            <Text style={styles.controlLabel}>Reps</Text>
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={decrementReps}
                accessibilityLabel="Decrease reps"
                accessibilityHint="Reduces the number of reps by 1"
              >
                <Text style={styles.controlButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.controlValue}>{reps}</Text>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={incrementReps}
                accessibilityLabel="Increase reps"
                accessibilityHint="Increases the number of reps by 1"
              >
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </MotiView>

          {/* Weight Control */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 200, delay: 300 }}
            style={styles.controlGroup}
          >
            <Text style={styles.controlLabel}>Weight (lbs)</Text>
            <View style={styles.controlRow}>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={decrementWeight}
                accessibilityLabel="Decrease weight"
                accessibilityHint="Reduces the weight by 5 pounds"
              >
                <Text style={styles.controlButtonText}>−</Text>
              </TouchableOpacity>
              <Text style={styles.controlValue}>{weight}</Text>
              <TouchableOpacity
                style={styles.controlButton}
                onPress={incrementWeight}
                accessibilityLabel="Increase weight"
                accessibilityHint="Increases the weight by 5 pounds"
              >
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </MotiView>
        </View>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 200, delay: 400 }}
          style={styles.footer}
        >
          <TouchableOpacity
            style={styles.saveButton}
            onPress={handleSave}
            accessibilityLabel="Save workout set"
            accessibilityHint="Saves the current reps and weight as a new set"
          >
            <Text style={styles.saveButtonText}>Save Set</Text>
          </TouchableOpacity>
        </MotiView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  title: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '600',
  },
  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
  },
  exerciseInfo: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '600',
    marginBottom: 4,
  },
  exerciseCategory: {
    color: '#8E8E93',
    fontSize: 16,
  },
  controlsContainer: {
    flex: 1,
    padding: 20,
  },
  controlGroup: {
    marginBottom: 40,
  },
  controlLabel: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 16,
    textAlign: 'center',
  },
  controlRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  controlButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
  controlButtonText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: 'bold',
  },
  controlValue: {
    color: '#FFFFFF',
    fontSize: 32,
    fontWeight: 'bold',
    minWidth: 60,
    textAlign: 'center',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#2C2C2E',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
  },
}); 