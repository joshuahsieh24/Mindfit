import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Modal, TextInput, Alert } from 'react-native';
import * as Haptics from 'expo-haptics';
import { MotiView } from 'moti';
import { getTodayNutritionGoal, updateNutritionGoal, NutritionGoal } from '../lib/nutrition';

const NutritionGoalsCard: React.FC = () => {
  const [nutritionGoal, setNutritionGoal] = useState<NutritionGoal | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [noteText, setNoteText] = useState('');

  useEffect(() => {
    loadTodayNutritionGoal();
  }, []);

  const loadTodayNutritionGoal = async () => {
    try {
      const goal = await getTodayNutritionGoal();
      if (goal) {
        setNutritionGoal(goal);
      } else {
        // Create new goal for today
        const today = new Date().toDateString();
        const newGoal: NutritionGoal = {
          date: today,
          metGoal: false,
          waterCups: 0,
          note: '',
        };
        setNutritionGoal(newGoal);
      }
    } catch (error) {
      console.error('Error loading nutrition goal:', error);
      // Fallback
      const today = new Date().toDateString();
      const fallbackGoal: NutritionGoal = {
        date: today,
        metGoal: false,
        waterCups: 0,
        note: '',
      };
      setNutritionGoal(fallbackGoal);
    } finally {
      setIsLoading(false);
    }
  };

  const updateNutritionGoalState = async (updates: Partial<NutritionGoal>) => {
    if (!nutritionGoal) return;

    const updatedGoal = { ...nutritionGoal, ...updates };
    setNutritionGoal(updatedGoal);

    try {
      await updateNutritionGoal({
        metGoal: updatedGoal.metGoal,
        waterCups: updatedGoal.waterCups,
        note: updatedGoal.note,
      });
    } catch (error) {
      console.error('Error saving nutrition goal:', error);
    }
  };

  const toggleGoal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateNutritionGoalState({ metGoal: !nutritionGoal?.metGoal });
  };

  const incrementWaterCup = (index: number) => {
    if (!nutritionGoal) return;
    
    const newWaterCups = Math.min(8, Math.max(0, index + 1));
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateNutritionGoalState({ waterCups: newWaterCups });
  };

  const decrementWaterCup = (index: number) => {
    if (!nutritionGoal) return;
    
    const newWaterCups = Math.max(0, index);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    updateNutritionGoalState({ waterCups: newWaterCups });
  };

  const handleAddNote = () => {
    setNoteText(nutritionGoal?.note || '');
    setShowNoteModal(true);
  };

  const saveNote = () => {
    updateNutritionGoalState({ note: noteText.trim() });
    setShowNoteModal(false);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  if (isLoading || !nutritionGoal) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.loadingText}>Loading nutrition goals...</Text>
        </View>
      </View>
    );
  }

  return (
    <>
      <View style={styles.container}>
        <View style={styles.card}>
          <View style={styles.header}>
            <Text style={styles.title}>Nutrition Goal</Text>
            <TouchableOpacity
              style={[styles.toggleButton, nutritionGoal.metGoal && styles.toggleButtonActive]}
              onPress={toggleGoal}
              accessible={true}
              accessibilityLabel={`Nutrition goal ${nutritionGoal.metGoal ? 'completed' : 'not completed'}, tap to toggle`}
              accessibilityRole="button"
            >
              <Text style={styles.toggleText}>
                {nutritionGoal.metGoal ? '✅' : '❌'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.waterSection}>
            <Text style={styles.waterTitle}>Water Intake</Text>
            <View style={styles.waterCups}>
              {Array.from({ length: 8 }, (_, index) => (
                <TouchableOpacity
                  key={index}
                  style={[
                    styles.waterCup,
                    index < nutritionGoal.waterCups && styles.waterCupFilled
                  ]}
                  onPress={() => incrementWaterCup(index)}
                  onLongPress={() => decrementWaterCup(index)}
                  delayLongPress={300}
                  accessible={true}
                  accessibilityLabel={`Water cup ${index + 1}, ${index < nutritionGoal.waterCups ? 'filled' : 'empty'}`}
                  accessibilityRole="button"
                >
                  <MotiView
                    from={{ scale: 1 }}
                    animate={{ scale: index < nutritionGoal.waterCups ? 1.1 : 1 }}
                    transition={{ type: 'spring', damping: 10 }}
                  >
                    <Text style={[
                      styles.waterCupText,
                      index < nutritionGoal.waterCups && styles.waterCupTextFilled
                    ]}>
                      💧
                    </Text>
                  </MotiView>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.waterCount}>
              {nutritionGoal.waterCups}/8 cups
            </Text>
          </View>

          {nutritionGoal.note && (
            <View style={styles.noteSection}>
              <Text style={styles.noteLabel}>Note:</Text>
              <Text style={styles.noteText}>{nutritionGoal.note}</Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.addNoteButton}
            onPress={handleAddNote}
          >
            <Text style={styles.addNoteText}>
              {nutritionGoal.note ? 'Edit Note' : 'Add Note'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Note Modal */}
      <Modal
        visible={showNoteModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Add Note</Text>
            <TouchableOpacity onPress={() => setShowNoteModal(false)}>
              <Text style={styles.closeButton}>✕</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.modalContent}>
            <TextInput
              style={styles.noteInput}
              placeholder="How did your nutrition go today?"
              placeholderTextColor="#8E8E93"
              value={noteText}
              onChangeText={setNoteText}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            
            <TouchableOpacity
              style={styles.saveNoteButton}
              onPress={saveNote}
            >
              <Text style={styles.saveNoteButtonText}>Save Note</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  card: {
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  toggleButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FF3B30',
  },
  toggleButtonActive: {
    borderColor: '#34C759',
    backgroundColor: '#34C759',
  },
  toggleText: {
    fontSize: 20,
  },
  waterSection: {
    marginBottom: 16,
  },
  waterTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  waterCups: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  waterCup: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#2C2C2E',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#3A3A3C',
  },
  waterCupFilled: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  waterCupText: {
    fontSize: 16,
    opacity: 0.5,
  },
  waterCupTextFilled: {
    opacity: 1,
  },
  waterCount: {
    fontSize: 14,
    color: '#8E8E93',
    textAlign: 'center',
  },
  noteSection: {
    marginBottom: 12,
    padding: 12,
    backgroundColor: '#2C2C2E',
    borderRadius: 8,
  },
  noteLabel: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 4,
  },
  noteText: {
    fontSize: 14,
    color: '#EBEBF5',
    lineHeight: 20,
  },
  addNoteButton: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#007AFF',
    borderRadius: 6,
  },
  addNoteText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '500',
  },
  loadingText: {
    fontSize: 16,
    color: '#8E8E93',
    textAlign: 'center',
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
  modalContent: {
    flex: 1,
    padding: 20,
  },
  noteInput: {
    backgroundColor: '#1C1C1E',
    borderRadius: 8,
    padding: 16,
    fontSize: 16,
    color: '#FFFFFF',
    marginBottom: 24,
    minHeight: 100,
    borderWidth: 1,
    borderColor: '#2C2C2E',
  },
  saveNoteButton: {
    backgroundColor: '#007AFF',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
  },
  saveNoteButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default NutritionGoalsCard; 