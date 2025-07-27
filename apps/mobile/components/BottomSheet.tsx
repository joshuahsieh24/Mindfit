import React, { useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import { theme } from '../lib/theme';

interface CustomBottomSheetProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  snapPoints?: string[];
}

export function CustomBottomSheet({ 
  isOpen, 
  onClose, 
  children, 
  snapPoints = ['50%', '75%'] 
}: CustomBottomSheetProps) {
  const bottomSheetRef = useRef<BottomSheet>(null);

  const snapPointsArray = useMemo(() => snapPoints, [snapPoints]);

  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) {
      onClose();
    }
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPointsArray}
      onChange={handleSheetChanges}
      backgroundStyle={styles.background}
      handleIndicatorStyle={styles.indicator}
      enablePanDownToClose
    >
      <View style={styles.content}>
        {children}
      </View>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  background: {
    backgroundColor: theme.colors.surface,
  },
  indicator: {
    backgroundColor: theme.colors.text.muted,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
}); 