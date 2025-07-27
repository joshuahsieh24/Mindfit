import React, { useEffect } from 'react';
import { View, Text } from '../../components/ui';
import { supabase } from '../../lib/supabase';
import { useRouter } from 'expo-router';

export default function AuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthStateChange = async (event: string, session: any) => {
      if (event === 'SIGNED_IN' && session) {
        // Navigate to home screen on successful authentication
        router.replace('/(tabs)/home');
      }
    };

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text variant="h2">Signing you in...</Text>
      <Text variant="body" color="muted" style={{ marginTop: 8 }}>
        Please wait while we complete your authentication
      </Text>
    </View>
  );
} 