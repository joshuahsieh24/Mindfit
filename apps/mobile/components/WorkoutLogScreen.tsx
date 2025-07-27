import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  FlatList, 
  Modal, 
  TextInput, 
  Alert,
  ScrollView,
  SafeAreaView
} from 'react-native';
import * as Haptics from 'expo-haptics';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MotiView } from 'moti';

interface WorkoutSet {
  id: string;
  exercise: string;
  reps: number;
  weight: number;
  timestamp: number;
}

interface WorkoutFolder {
  id: string;
  name: string;
  sets: WorkoutSet[];
  createdAt: number;
}

interface Exercise {
  name: string;
  category: string;
}

const EXERCISES: Exercise[] = [
  // Chest
  { name: 'Bench Press', category: 'Chest' },
  { name: 'Incline Bench Press', category: 'Chest' },
  { name: 'Decline Bench Press', category: 'Chest' },
  { name: 'Dumbbell Press', category: 'Chest' },
  { name: 'Push-ups', category: 'Chest' },
  { name: 'Dips', category: 'Chest' },
  { name: 'Chest Flyes', category: 'Chest' },
  
  // Back
  { name: 'Deadlifts', category: 'Back' },
  { name: 'Pull-ups', category: 'Back' },
  { name: 'Barbell Rows', category: 'Back' },
  { name: 'Lat Pulldowns', category: 'Back' },
  { name: 'T-Bar Rows', category: 'Back' },
  { name: 'Face Pulls', category: 'Back' },
  { name: 'Shrugs', category: 'Back' },
  
  // Legs
  { name: 'Squats', category: 'Legs' },
  { name: 'Leg Press', category: 'Legs' },
  { name: 'Lunges', category: 'Legs' },
  { name: 'Leg Extensions', category: 'Legs' },
  { name: 'Leg Curls', category: 'Legs' },
  { name: 'Calf Raises', category: 'Legs' },
  { name: 'Romanian Deadlifts', category: 'Legs' },
  { name: 'Hip Thrusts', category: 'Legs' },
  
  // Shoulders
  { name: 'Shoulder Press', category: 'Shoulders' },
  { name: 'Lateral Raises', category: 'Shoulders' },
  { name: 'Front Raises', category: 'Shoulders' },
  { name: 'Rear Delt Flyes', category: 'Shoulders' },
  { name: 'Upright Rows', category: 'Shoulders' },
  { name: 'Arnold Press', category: 'Shoulders' },
  
  // Arms
  { name: 'Bicep Curls', category: 'Arms' },
  { name: 'Tricep Dips', category: 'Arms' },
  { name: 'Hammer Curls', category: 'Arms' },
  { name: 'Skull Crushers', category: 'Arms' },
  { name: 'Preacher Curls', category: 'Arms' },
  { name: 'Tricep Extensions', category: 'Arms' },
  { name: 'Concentration Curls', category: 'Arms' },
  
  // Core
  { name: 'Planks', category: 'Core' },
  { name: 'Crunches', category: 'Core' },
  { name: 'Russian Twists', category: 'Core' },
  { name: 'Leg Raises', category: 'Core' },
  { name: 'Mountain Climbers', category: 'Core' },
  { name: 'Bicycle Crunches', category: 'Core' },
  { name: 'Ab Wheel Rollouts', category: 'Core' },
];

interface WorkoutLogScreenProps {
  onBack: () => void;
}

const WorkoutLogScreen: React.FC<WorkoutLogScreenProps> = ({ onBack }) => {
  const [sets, setSets] = useState<WorkoutSet[]>([]);
  const [folders, setFolders] = useState<WorkoutFolder[]>([]);
  const [showExercisePicker, setShowExercisePicker] = useState(false);
  const [showQuickSet, setShowQuickSet] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [reps, setReps] = useState(5);
  const [weight, setWeight] = useState(135);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [currentView, setCurrentView] = useState<'today' | 'folders'>('today');
  const [selectedFolder, setSelectedFolder] = useState<WorkoutFolder | null>(null);
  const [showFolderDetail, setShowFolderDetail] = useState(false);

  useEffect(() => {
    loadTodaySets();
    loadFolders();
  }, []);

  const loadTodaySets = async () => {
    try {
      const today = new Date().toDateString();
      const stored = await AsyncStorage.getItem(`workout_sets_${today}`);
      if (stored) {
        setSets(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading sets:', error);
    }
  };

  const loadFolders = async () => {
    try {
      const stored = await AsyncStorage.getItem('workout_folders');
      if (stored) {
        setFolders(JSON.parse(stored));
      }
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const saveTodaySets = async (newSets: WorkoutSet[]) => {
    try {
      const today = new Date().toDateString();
      await AsyncStorage.setItem(`workout_sets_${today}`, JSON.stringify(newSets));
      setSets(newSets);
    } catch (error) {
      console.error('Error saving sets:', error);
    }
  };

  const saveFolders = async (newFolders: WorkoutFolder[]) => {
    try {
      await AsyncStorage.setItem('workout_folders', JSON.stringify(newFolders));
      setFolders(newFolders);
    } catch (error) {
      console.error('Error saving folders:', error);
    }
  };

  const addSet = async () => {
    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      exercise: selectedExercise,
      reps,
      weight,
      timestamp: Date.now(),
    };

    const updatedSets = [newSet, ...sets];
    await saveTodaySets(updatedSets);
    
    // Save last used values
    try {
      await AsyncStorage.setItem(`lastUsed_${selectedExercise}`, JSON.stringify({ reps, weight }));
    } catch (error) {
      console.error('Error saving last used values:', error);
    }

    setShowQuickSet(false);
    setSelectedExercise('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const addSetToFolder = async (folderId: string) => {
    const newSet: WorkoutSet = {
      id: Date.now().toString(),
      exercise: selectedExercise,
      reps,
      weight,
      timestamp: Date.now(),
    };

    const updatedFolders = folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          sets: [newSet, ...folder.sets],
        };
      }
      return folder;
    });

    await saveFolders(updatedFolders);
    
    // Update selected folder
    const updatedFolder = updatedFolders.find(f => f.id === folderId);
    if (updatedFolder) {
      setSelectedFolder(updatedFolder);
    }

    setShowQuickSet(false);
    setSelectedExercise('');
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const deleteSet = async (id: string, isFromFolder = false, folderId?: string) => {
    Alert.alert(
      'Delete Set',
      'Are you sure you want to delete this set?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            if (isFromFolder && folderId) {
              const updatedFolders = folders.map(folder => {
                if (folder.id === folderId) {
                  return {
                    ...folder,
                    sets: folder.sets.filter(set => set.id !== id),
                  };
                }
                return folder;
              });
              await saveFolders(updatedFolders);
              
              // Update selected folder
              const updatedFolder = updatedFolders.find(f => f.id === folderId);
              if (updatedFolder) {
                setSelectedFolder(updatedFolder);
              }
            } else {
              const updatedSets = sets.filter(set => set.id !== id);
              await saveTodaySets(updatedSets);
            }
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          },
        },
      ]
    );
  };

  const editSet = (set: WorkoutSet) => {
    setSelectedExercise(set.exercise);
    setReps(set.reps);
    setWeight(set.weight);
    setShowQuickSet(true);
  };

  const clearAllWorkouts = () => {
    Alert.alert(
      'Clear All Workouts',
      'This will delete all today\'s workouts. This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            await saveTodaySets([]);
            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          },
        },
      ]
    );
  };

  const createFolder = async () => {
    if (!newFolderName.trim()) return;
    
    const newFolder: WorkoutFolder = {
      id: Date.now().toString(),
      name: newFolderName.trim(),
      sets: [],
      createdAt: Date.now(),
    };

    const updatedFolders = [...folders, newFolder];
    await saveFolders(updatedFolders);
    setNewFolderName('');
    setShowFolderModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const saveToFolder = async (folderId: string) => {
    if (sets.length === 0) {
      Alert.alert('No Workouts', 'There are no workouts to save to a folder.');
      return;
    }

    const updatedFolders = folders.map(folder => {
      if (folder.id === folderId) {
        return {
          ...folder,
          sets: [...folder.sets, ...sets],
        };
      }
      return folder;
    });

    await saveFolders(updatedFolders);
    Alert.alert('Success', 'Workouts saved to folder!');
  };

  const openFolder = (folder: WorkoutFolder) => {
    setSelectedFolder(folder);
    setShowFolderDetail(true);
  };

  const filteredExercises = EXERCISES.filter(exercise =>
    exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    exercise.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedExercises = filteredExercises.reduce((groups, exercise) => {
    const category = exercise.category;
    if (!groups[category]) {
      groups[category] = [];
    }
    groups[category].push(exercise);
    return groups;
  }, {} as Record<string, Exercise[]>);

  const renderSet = ({ item, index }: { item: WorkoutSet; index: number }) => (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 200, delay: index * 50 }}
      style={styles.setCard}
    >
      <TouchableOpacity
        style={styles.setContent}
        onLongPress={() => {
          Alert.alert(
            'Set Options',
            'What would you like to do?',
            [
              { text: 'Cancel', style: 'cancel' },
              { text: 'Edit', onPress: () => editSet(item) },
              { text: 'Delete', style: 'destructive', onPress: () => deleteSet(item.id) },
            ]
          );
        }}
        delayLongPress={500}
      >
        <Text style={styles.exerciseName}>{item.exercise}</Text>
        <Text style={styles.setDetails}>{item.reps} reps × {item.weight} lbs</Text>
      </TouchableOpacity>
    </MotiView>
  );

  const renderExerciseSection = ({ item }: { item: { category: string; exercises: Exercise[] } }) => (
    <View style={styles.exerciseSection}>
      <Text style={styles.exerciseSectionTitle}>{item.category}</Text>
      {item.exercises.map((exercise, index) => (
        <TouchableOpacity
          key={`${exercise.name}-${index}`}
          style={styles.exerciseItem}
          onPress={() => {
            setSelectedExercise(exercise.name);
            setShowExercisePicker(false);
            setShowQuickSet(true);
          }}
        >
          <Text style={styles.exerciseItemText}>{exercise.name}</Text>
          <Text style={styles.exerciseCategory}>{exercise.category}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  if (showFolderDetail && selectedFolder) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => setShowFolderDetail(false)} style={styles.backButton}>
            <Text style={styles.backButtonText}>← Back</Text>
          </TouchableOpacity>
          <Text style={styles.title}>{selectedFolder.name}</Text>
          <TouchableOpacity 
            style={styles.addButton}
            onPress={() => setShowExercisePicker(true)}
          >
            <Text style={styles.addButtonText}>+</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={selectedFolder.sets}
          renderItem={({ item, index }) => (
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 200, delay: index * 50 }}
              style={styles.setCard}
            >
              <TouchableOpacity
                style={styles.setContent}
                onLongPress={() => {
                  Alert.alert(
                    'Set Options',
                    'What would you like to do?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Delete', style: 'destructive', onPress: () => deleteSet(item.id, true, selectedFolder.id) },
                    ]
                  );
                }}
                delayLongPress={500}
              >
                <Text style={styles.exerciseName}>{item.exercise}</Text>
                <Text style={styles.setDetails}>{item.reps} reps × {item.weight} lbs</Text>
              </TouchableOpacity>
            </MotiView>
          )}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.setsContentContainer}
          showsVerticalScrollIndicator={false}
        />

        {/* Exercise Picker Modal for Folder */}
        <Modal
          visible={showExercisePicker}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Add Exercise to Folder</Text>
              <TouchableOpacity onPress={() => setShowExercisePicker(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <TextInput
              style={styles.searchInput}
              placeholder="Search exercises..."
              placeholderTextColor="#8E8E93"
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
            
            <FlatList
              data={Object.entries(groupedExercises).map(([category, exercises]) => ({
                category,
                exercises,
              }))}
              renderItem={renderExerciseSection}
              keyExtractor={(item) => item.category}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Modal>

        {/* Quick Set Modal for Folder */}
        <Modal
          visible={showQuickSet}
          animationType="slide"
          presentationStyle="pageSheet"
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Quick Set</Text>
              <TouchableOpacity onPress={() => setShowQuickSet(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.quickSetContent}>
              <Text style={styles.exerciseLabel}>{selectedExercise}</Text>
              
              <View style={styles.controlGroup}>
                <Text style={styles.controlLabel}>Reps</Text>
                <View style={styles.controlRow}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setReps(Math.max(1, reps - 1))}
                  >
                    <Text style={styles.controlButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.controlValue}>{reps}</Text>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setReps(reps + 1)}
                  >
                    <Text style={styles.controlButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <View style={styles.controlGroup}>
                <Text style={styles.controlLabel}>Weight (lbs)</Text>
                <View style={styles.controlRow}>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setWeight(Math.max(0, weight - 5))}
                  >
                    <Text style={styles.controlButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.controlValue}>{weight}</Text>
                  <TouchableOpacity
                    style={styles.controlButton}
                    onPress={() => setWeight(weight + 5)}
                  >
                    <Text style={styles.controlButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
              </View>
              
              <TouchableOpacity
                style={styles.saveButton}
                onPress={() => addSetToFolder(selectedFolder.id)}
              >
                <Text style={styles.saveButtonText}>Add to Folder</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={onBack} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Workout Log</Text>
        <View style={styles.headerRight}>
          <TouchableOpacity 
            style={styles.clearButton}
            onPress={clearAllWorkouts}
          >
            <Text style={styles.clearButtonText}>Clear</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, currentView === 'today' && styles.activeTab]}
          onPress={() => setCurrentView('today')}
        >
          <Text style={[styles.tabText, currentView === 'today' && styles.activeTabText]}>
            Today's Sets
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, currentView === 'folders' && styles.activeTab]}
          onPress={() => setCurrentView('folders')}
        >
          <Text style={[styles.tabText, currentView === 'folders' && styles.activeTabText]}>
            Folders
          </Text>
        </TouchableOpacity>
      </View>

      {currentView === 'today' ? (
        <>
          <FlatList
            data={sets}
            renderItem={renderSet}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.setsContentContainer}
            showsVerticalScrollIndicator={false}
          />
          
          <TouchableOpacity
            style={styles.floatingButton}
            onPress={() => setShowExercisePicker(true)}
            testID="floating-add-button"
          >
            <Text style={styles.floatingButtonText}>+</Text>
          </TouchableOpacity>
        </>
      ) : (
        <ScrollView style={styles.foldersContainer}>
          <TouchableOpacity
            style={styles.createFolderButton}
            onPress={() => setShowFolderModal(true)}
          >
            <Text style={styles.createFolderText}>+ Create New Folder</Text>
          </TouchableOpacity>
          
          {folders.map(folder => (
            <TouchableOpacity
              key={folder.id}
              style={styles.folderCard}
              onPress={() => openFolder(folder)}
            >
              <Text style={styles.folderName}>📁 {folder.name}</Text>
              <Text style={styles.folderDetails}>{folder.sets.length} workouts</Text>
              <TouchableOpacity
                style={styles.saveToFolderButton}
                onPress={() => saveToFolder(folder.id)}
              >
                <Text style={styles.saveToFolderText}>Save Today's Workouts</Text>
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}

      {/* Exercise Picker Modal */}
      <Modal
        visible={showExercisePicker}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Choose Exercise</Text>
            <TouchableOpacity onPress={() => setShowExercisePicker(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <TextInput
            style={styles.searchInput}
            placeholder="Search exercises..."
            placeholderTextColor="#8E8E93"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          
          <FlatList
            data={Object.entries(groupedExercises).map(([category, exercises]) => ({
              category,
              exercises,
            }))}
            renderItem={renderExerciseSection}
            keyExtractor={(item) => item.category}
            showsVerticalScrollIndicator={false}
          />
        </View>
      </Modal>

      {/* Quick Set Modal */}
      <Modal
        visible={showQuickSet}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Quick Set</Text>
            <TouchableOpacity onPress={() => setShowQuickSet(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.quickSetContent}>
            <Text style={styles.exerciseLabel}>{selectedExercise}</Text>
            
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Reps</Text>
              <View style={styles.controlRow}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setReps(Math.max(1, reps - 1))}
                  testID="reps-minus-button"
                >
                  <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.controlValue}>{reps}</Text>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setReps(reps + 1)}
                  testID="reps-plus-button"
                >
                  <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <View style={styles.controlGroup}>
              <Text style={styles.controlLabel}>Weight (lbs)</Text>
              <View style={styles.controlRow}>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setWeight(Math.max(0, weight - 5))}
                  testID="weight-minus-button"
                >
                  <Text style={styles.controlButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.controlValue}>{weight}</Text>
                <TouchableOpacity
                  style={styles.controlButton}
                  onPress={() => setWeight(weight + 5)}
                  testID="weight-plus-button"
                >
                  <Text style={styles.controlButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            
            <TouchableOpacity
              style={styles.saveButton}
              onPress={addSet}
            >
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Create Folder Modal */}
      <Modal
        visible={showFolderModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Create Folder</Text>
            <TouchableOpacity onPress={() => setShowFolderModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.createFolderContent}>
            <TextInput
              style={styles.folderNameInput}
              placeholder="Folder name..."
              placeholderTextColor="#8E8E93"
              value={newFolderName}
              onChangeText={setNewFolderName}
              autoFocus
            />
            
            <TouchableOpacity
              style={[styles.createButton, !newFolderName.trim() && styles.createButtonDisabled]}
              onPress={createFolder}
              disabled={!newFolderName.trim()}
            >
              <Text style={styles.createButtonText}>Create Folder</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  backButton: {
    padding: 8,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  clearButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#FF3B30',
    borderRadius: 6,
  },
  clearButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  addButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
    marginHorizontal: 4,
  },
  activeTab: {
    backgroundColor: '#2C2C2E',
  },
  tabText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '500',
  },
  activeTabText: {
    color: '#FFFFFF',
  },
  setsContentContainer: {
    padding: 20,
    paddingBottom: 200,
  },
  setCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  setContent: {
    padding: 16,
  },
  exerciseName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  setDetails: {
    fontSize: 16,
    color: '#8E8E93',
  },
  floatingButton: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  floatingButtonText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  foldersContainer: {
    flex: 1,
    padding: 20,
  },
  createFolderButton: {
    backgroundColor: '#2C2C2E',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    marginBottom: 20,
  },
  createFolderText: {
    color: '#007AFF',
    fontSize: 16,
    fontWeight: '500',
  },
  folderCard: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  folderName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  folderDetails: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 12,
  },
  saveToFolderButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 8,
    alignItems: 'center',
  },
  saveToFolderText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '500',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#000',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#2C2C2E',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  closeButton: {
    fontSize: 24,
    color: '#8E8E93',
  },
  searchInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 12,
    margin: 20,
    fontSize: 16,
    color: '#FFFFFF',
  },
  exerciseSection: {
    marginBottom: 20,
  },
  exerciseSectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 8,
    paddingHorizontal: 20,
  },
  exerciseItem: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 20,
    marginBottom: 8,
  },
  exerciseItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  exerciseCategory: {
    fontSize: 14,
    color: '#8E8E93',
  },
  quickSetContent: {
    flex: 1,
    padding: 20,
  },
  exerciseLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 32,
  },
  controlGroup: {
    marginBottom: 24,
  },
  controlLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  controlButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 16,
  },
  controlButtonText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  controlValue: {
    fontSize: 24,
    fontWeight: '600',
    color: '#FFFFFF',
    minWidth: 60,
    textAlign: 'center',
  },
  saveButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 32,
  },
  saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  createFolderContent: {
    flex: 1,
    padding: 20,
  },
  folderNameInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 24,
  },
  createButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  createButtonDisabled: {
    backgroundColor: '#3A3A3C',
  },
  createButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default WorkoutLogScreen; 