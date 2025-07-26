import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';

interface ButtonNavProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function ButtonNav({ label, onPress, disabled = false }: ButtonNavProps) {
  return (
    <View style={styles.footer}>
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
    paddingBottom: 40,
    backgroundColor: 'white',
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