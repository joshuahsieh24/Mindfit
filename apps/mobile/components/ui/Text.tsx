import React from 'react';
import { Text as RNText, StyleSheet, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'caption' | 'label';
  color?: 'primary' | 'secondary' | 'accent' | 'muted';
  children: React.ReactNode;
}

export function Text({ 
  variant = 'body', 
  color = 'primary', 
  children, 
  style, 
  ...props 
}: CustomTextProps) {
  const variantStyle = styles[variant] || styles.body;
  const colorStyle = styles[color] || styles.primary;
  
  return (
    <RNText style={[styles.text, variantStyle, colorStyle, style]} {...props}>
      {children}
    </RNText>
  );
}

const styles = StyleSheet.create({
  text: {
    color: '#FFFFFF',
  },
  h1: {
    fontSize: 32,
    fontWeight: 'bold',
    lineHeight: 40,
  },
  h2: {
    fontSize: 24,
    fontWeight: '600',
    lineHeight: 32,
  },
  h3: {
    fontSize: 20,
    fontWeight: '600',
    lineHeight: 28,
  },
  body: {
    fontSize: 16,
    lineHeight: 24,
  },
  caption: {
    fontSize: 14,
    lineHeight: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  primary: {
    color: '#FFFFFF',
  },
  secondary: {
    color: '#EBEBF5',
  },
  accent: {
    color: '#007AFF',
  },
  muted: {
    color: '#8E8E93',
  },
}); 