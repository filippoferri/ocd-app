import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface TopNavProps {
  currentScreen: 'home' | 'diary';
  onToggle: () => void;
  onAvatarPress?: () => void;
  userName?: string;
}

export default function TopNav({ currentScreen, onToggle, onAvatarPress, userName }: TopNavProps) {
  const insets = useSafeAreaInsets();
  return (
    <View style={[styles.topBar, { paddingTop: insets.top + 20 }]}>
      <TouchableOpacity style={styles.avatar} onPress={onAvatarPress}>
        <Ionicons name="person" size={28} color="#666" />
      </TouchableOpacity>
      <View style={styles.toggle}>
        <TouchableOpacity 
          style={[styles.toggleOption, styles.toggleOptionFirst, currentScreen === 'diary' && styles.toggleOptionActive]} 
          onPress={() => currentScreen !== 'diary' && onToggle()}
        >
          <Text style={[styles.toggleText, currentScreen === 'diary' && styles.toggleTextActive]}>Diario</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleOption, styles.toggleOptionLast, currentScreen === 'home' && styles.toggleOptionActive]} 
          onPress={() => currentScreen !== 'home' && onToggle()}
        >
          <Text style={[styles.toggleText, currentScreen === 'home' && styles.toggleTextActive]}>Oggi</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#F8F9FA',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#E6E2FF',
    borderRadius: 30,
    padding: 0,
    height: 44,
  },
  toggleOption: {
    paddingHorizontal: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 30,
  },
  toggleOptionFirst: {
    // No specific corner resets needed as we want it to be a pill
  },
  toggleOptionLast: {
    // No specific corner resets needed
  },
  toggleOptionActive: {
    backgroundColor: '#8B7CF6',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#8B7CF6',
  },
  toggleTextActive: {
    color: '#FFFFFF',
  },
});