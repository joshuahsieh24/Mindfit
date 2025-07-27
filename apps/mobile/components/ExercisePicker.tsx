import React, { useState, useMemo, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  FlatList,
  Modal,
} from 'react-native';
import { getAllExercises, searchExercises, MUSCLE_CATEGORIES } from '../lib/exercises';
import type { Exercise } from '../lib/storage';

interface ExercisePickerProps {
  visible: boolean;
  onClose: () => void;
  onSelectExercise: (exercise: Exercise) => void;
  onAddNewExercise?: (name: string) => void;
}

export default function ExercisePicker({
  visible,
  onClose,
  onSelectExercise,
  onAddNewExercise,
}: ExercisePickerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Load exercises when component mounts or becomes visible
  useEffect(() => {
    if (visible) {
      loadExercises();
    }
  }, [visible]);

  const loadExercises = async () => {
    try {
      setIsLoading(true);
      const allExercises = await getAllExercises();
      setExercises(allExercises);
    } catch (error) {
      console.error('Error loading exercises:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredExercises = useMemo(() => {
    if (!searchQuery.trim()) {
      return exercises;
    }

    const query = searchQuery.toLowerCase();
    return exercises.filter(exercise =>
      exercise.name.toLowerCase().includes(query) ||
      exercise.category.toLowerCase().includes(query)
    );
  }, [searchQuery, exercises]);

  const groupedExercises = useMemo(() => {
    const groups: { [key: string]: Exercise[] } = {};
    
    filteredExercises.forEach(exercise => {
      if (!groups[exercise.category]) {
        groups[exercise.category] = [];
      }
      groups[exercise.category].push(exercise);
    });

    return MUSCLE_CATEGORIES
      .filter(category => groups[category]?.length > 0)
      .map(category => ({
        category,
        exercises: groups[category],
      }));
  }, [filteredExercises]);

  const showAddNewOption = searchQuery.trim() && 
    !exercises.some(ex => 
      ex.name.toLowerCase() === searchQuery.toLowerCase()
    );

  const handleAddNewExercise = () => {
    if (onAddNewExercise) {
      onAddNewExercise(searchQuery.trim());
    }
    setSearchQuery('');
  };

  const renderExerciseItem = ({ item }: { item: Exercise }) => (
    <TouchableOpacity
      style={styles.exerciseItem}
      onPress={() => {
        onSelectExercise(item);
        setSearchQuery('');
      }}
    >
      <Text style={styles.exerciseName}>{item.name}</Text>
      <Text style={styles.exerciseCategory}>{item.category}</Text>
    </TouchableOpacity>
  );

  const renderCategoryHeader = ({ item }: { item: { category: string; exercises: Exercise[] } }) => (
    <View>
      <Text style={styles.categoryHeader}>{item.category}</Text>
      {item.exercises.map(exercise => (
        <TouchableOpacity
          key={exercise.id}
          style={styles.exerciseItem}
          onPress={() => {
            onSelectExercise(exercise);
            setSearchQuery('');
          }}
        >
          <Text style={styles.exerciseName}>{exercise.name}</Text>
          <Text style={styles.exerciseCategory}>{exercise.category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderAddNewOption = () => (
    <TouchableOpacity
      style={styles.addNewItem}
      onPress={handleAddNewExercise}
    >
      <Text style={styles.addNewText}>➕ Add '{searchQuery.trim()}'</Text>
    </TouchableOpacity>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingContainer}>
      <Text style={styles.loadingText}>Loading exercises...</Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Choose Exercise</Text>
          <TouchableOpacity
            onPress={() => {
              onClose();
              setSearchQuery('');
            }}
            style={styles.closeButton}
          >
            <Text style={styles.closeButtonText}>✕</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        {isLoading ? (
          renderLoadingState()
        ) : (
          <FlatList
            data={showAddNewOption ? [{ id: 'add-new', category: 'add-new' }] : groupedExercises}
            renderItem={({ item }) => 
              item.category === 'add-new' 
                ? renderAddNewOption()
                : renderCategoryHeader({ item })
            }
            keyExtractor={(item) => item.category}
            style={styles.exerciseList}
            showsVerticalScrollIndicator={false}
          />
        )}
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
  searchContainer: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  searchInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  exerciseList: {
    flex: 1,
    padding: 20,
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
  categoryHeader: {
    color: '#007AFF',
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 12,
  },
  exerciseItem: {
    backgroundColor: '#1C1C1E',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  exerciseName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 4,
  },
  exerciseCategory: {
    color: '#8E8E93',
    fontSize: 14,
  },
  addNewItem: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  addNewText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
}); 