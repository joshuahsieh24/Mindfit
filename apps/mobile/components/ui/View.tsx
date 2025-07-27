import React from 'react';
import { View as RNView, StyleSheet, ViewProps } from 'react-native';

interface CustomViewProps extends ViewProps {
  variant?: 'container' | 'section' | 'row' | 'center';
  children: React.ReactNode;
}

export function View({ variant = 'container', children, style, ...props }: CustomViewProps) {
  return (
    <RNView style={[styles.view, styles[variant], style]} {...props}>
      {children}
    </RNView>
  );
}

const styles = StyleSheet.create({
  view: {
    backgroundColor: '#1C1C1E',
  },
  container: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
}); 