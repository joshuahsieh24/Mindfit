import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { theme } from '../lib/theme';
import { WorkoutSet } from '../lib/types';

interface SetEntrySheetProps {
  exercise: string;
  onSave: (reps: number, weight: number) => void;
  lastSet?: WorkoutSet | null;
}

interface StepperControlProps {
  label: string;
  value: number;
  onDecrease: () => void;
  onIncrease: () => void;
  unit: string;
}

function StepperControl({ label, value, onDecrease, onIncrease, unit }: StepperControlProps) {
  return (
    <View style={styles.stepperContainer}>
      <Text style={styles.stepperLabel}>{label}</Text>
      <View style={styles.stepperControls}>
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={onDecrease}
          activeOpacity={0.8}
        >
          <Text style={styles.stepperButtonText}>-</Text>
        </TouchableOpacity>
        
        <View style={styles.valueContainer}>
          <Text style={styles.valueText}>
            {value}{unit}
          </Text>
        </View>
        
        <TouchableOpacity
          style={styles.stepperButton}
          onPress={onIncrease}
          activeOpacity={0.8}
        >
          <Text style={styles.stepperButtonText}>+</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

export function SetEntrySheet({ exercise, onSave, lastSet }: SetEntrySheetProps) {
  const [reps, setReps] = useState(lastSet?.reps || 8);
  const [weight, setWeight] = useState(lastSet?.weight || 60);

  useEffect(() => {
    if (lastSet) {
      setReps(lastSet.reps);
      setWeight(lastSet.weight);
    }
  }, [lastSet]);

  const adjustReps = (increment: boolean) => {
    setReps((prev) => Math.max(1, increment ? prev + 1 : prev - 1));
  };

  const adjustWeight = (increment: boolean) => {
    setWeight((prev) => Math.max(0, increment ? prev + 2.5 : prev - 2.5));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{exercise || 'Select Exercise'}</Text>
      
      <View style={styles.controlsContainer}>
        <StepperControl
          label="Reps"
          value={reps}
          onDecrease={() => adjustReps(false)}
          onIncrease={() => adjustReps(true)}
          unit=""
        />

        <StepperControl
          label="Weight"
          value={weight}
          onDecrease={() => adjustWeight(false)}
          onIncrease={() => adjustWeight(true)}
          unit="kg"
        />
      </View>

      <TouchableOpacity
        style={styles.saveButton}
        onPress={() => onSave(reps, weight)}
        activeOpacity={0.8}
      >
        <Text style={styles.saveButtonText}>Save Set</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingVertical: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    color: theme.colors.text.primary,
    marginBottom: 32,
  },
  controlsContainer: {
    marginBottom: 40,
  },
  stepperContainer: {
    marginBottom: 24,
  },
  stepperLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
    marginBottom: 12,
  },
  stepperControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: theme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  valueContainer: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    marginHorizontal: 20,
    borderRadius: 12,
    backgroundColor: theme.colors.background,
    minWidth: 96,
    alignItems: 'center',
  },
  valueText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
  saveButton: {
    backgroundColor: theme.colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.colors.text.primary,
  },
}); 