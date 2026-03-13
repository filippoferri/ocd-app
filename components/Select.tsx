import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface SelectOption {
  label: string;
  value: string;
}

interface SelectProps {
  options: SelectOption[];
  selectedValue: string | null;
  onSelect: (value: string) => void;
  containerStyle?: object;
}

export default function Select({ options, selectedValue, onSelect, containerStyle }: SelectProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {options.map((option) => {
        const isSelected = selectedValue === option.value;
        return (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              isSelected && styles.optionButtonSelected
            ]}
            onPress={() => onSelect(option.value)}
            activeOpacity={0.7}
          >
            <Text style={[
              styles.optionText,
              isSelected && styles.optionTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    gap: 12, // Standard spacing to prevent layout shifts when elements are added/removed
  },
  optionButton: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 24,
    borderWidth: 2,
    borderColor: '#F0F0F0',
    alignItems: 'center',
    justifyContent: 'center',
    // No shadow for flat design
  },
  optionButtonSelected: {
    borderColor: '#8B7CF6',
    backgroundColor: '#F7F6FF',
  },
  optionText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
    textAlign: 'center',
  },
  optionTextSelected: {
    color: '#8B7CF6',
  },
});
