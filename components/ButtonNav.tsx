import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ButtonNavProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function ButtonNav({ label, onPress, disabled = false }: ButtonNavProps) {
  const insets = useSafeAreaInsets();
  
  return (
    <View style={[styles.footer, { paddingBottom: Math.max(20, insets.bottom + 15) }]}>
      <TouchableOpacity 
        style={[
          styles.button,
          disabled && styles.buttonDisabled
        ]} 
        onPress={onPress}
        disabled={disabled}
      >
        <Text style={[
          styles.buttonText,
          disabled && styles.buttonTextDisabled
        ]}>
          {label}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    padding: 20,
    backgroundColor: 'transparent',
  },
  button: {
    backgroundColor: '#FF9500',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
  },
  buttonDisabled: {
    backgroundColor: '#F4A261',
    opacity: 0.5,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttonTextDisabled: {
    color: 'white',
  },
});