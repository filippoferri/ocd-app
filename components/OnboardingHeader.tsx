import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface OnboardingHeaderProps {
  onBack?: () => void;
  color?: string;
}

export default function OnboardingHeader({ onBack, color = '#333' }: OnboardingHeaderProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.header, { paddingTop: insets.top + 20 }]}>
      {onBack ? (
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={24} color={color} />
        </TouchableOpacity>
      ) : (
        <View style={styles.placeholder} />
      )}
      <View style={styles.placeholder} />
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: 'transparent',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -10, // Adjust for touch target padding
  },
  placeholder: {
    width: 40,
    height: 40,
  },
});
