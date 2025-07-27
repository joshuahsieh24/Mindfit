import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, LayoutAnimation } from 'react-native';
import { theme } from '../lib/theme';
import { DailyBoost } from '../lib/types';

interface CollapsibleCardProps {
  boost: DailyBoost;
}

export function CollapsibleCard({ boost }: CollapsibleCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handlePress = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setIsExpanded(!isExpanded);
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.emoji}>{boost.emoji}</Text>
          <Text style={styles.title}>{boost.title}</Text>
        </View>
      </View>

      <Text style={styles.message}>{boost.message}</Text>
      <Text style={styles.verse}>{boost.verse}</Text>

      {isExpanded && (
        <View style={styles.detailsContainer}>
          <Text style={styles.details}>{boost.details}</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.surface,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  emoji: {
    fontSize: 20,
    marginRight: 8,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text.primary,
  },
  message: {
    fontSize: 16,
    color: theme.colors.text.primary,
    marginBottom: 4,
  },
  verse: {
    fontSize: 14,
    fontStyle: 'italic',
    color: theme.colors.text.accent,
  },
  detailsContainer: {
    marginTop: 12,
  },
  details: {
    fontSize: 14,
    lineHeight: 20,
    color: theme.colors.text.muted,
  },
}); 