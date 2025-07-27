import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { theme } from '../lib/theme';
import { Exercise } from '../lib/types';

interface ExerciseSelectionSheetProps {
  exercises: Exercise[];
  onExerciseSelect: (exercise: Exercise) => void;
}

export function ExerciseSelectionSheet({ exercises, onExerciseSelect }: ExerciseSelectionSheetProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Exercise</Text>
      
      <ScrollView style={styles.gridContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {exercises.map((exercise) => (
            <TouchableOpacity
              key={exercise.id}
              style={styles.exerciseButton}
              onPress={() => onExerciseSelect(exercise)}
              activeOpacity={0.8}
            >
              <Text style={styles.exerciseText}>{exercise.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
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
    marginBottom: 20,
  },
  gridContainer: {
    flex: 1,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  exerciseButton: {
    width: '31%',
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    alignItems: 'center',
  },
  exerciseText: {
    fontSize: 14,
    fontWeight: '500',
    color: theme.colors.text.primary,
    textAlign: 'center',
  },
}); 