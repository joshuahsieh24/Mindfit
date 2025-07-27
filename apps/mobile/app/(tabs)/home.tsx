import React from 'react';
import { Alert, StyleSheet } from 'react-native';
import { View, Text, Button, Card } from '../../components/ui';
import { supabase } from '../../lib/supabase';

export default function Home() {
  const testSupabase = async () => {
    try {
      const { data, error } = await supabase
        .from('exercises')
        .select()
        .limit(1);
      
      Alert.alert(
        'Supabase Test Result',
        JSON.stringify({ data, error }, null, 2)
      );
    } catch (err) {
      Alert.alert('Error', 'Failed to test Supabase connection');
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="h1" style={styles.title}>
        MindFit Coach
      </Text>
      <Text variant="body" color="muted" style={styles.subtitle}>
        Your Personal Fitness & Faith Journey
      </Text>
      
      <Card style={styles.card}>
        <Text variant="h3" style={styles.cardTitle}>
          Welcome Back!
        </Text>
        <Text variant="body" color="secondary" style={styles.cardText}>
          Ready to log your workout and receive your daily boost?
        </Text>
        
        <Button onPress={testSupabase} style={styles.testButton}>
          Test Supabase Connection
        </Button>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },
  title: {
    textAlign: 'center',
    marginTop: 60,
    marginBottom: 8,
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: 48,
  },
  card: {
    marginTop: 24,
  },
  cardTitle: {
    marginBottom: 12,
  },
  cardText: {
    marginBottom: 24,
  },
  testButton: {
    marginTop: 16,
  },
}); 