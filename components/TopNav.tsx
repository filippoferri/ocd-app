import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface TopNavProps {
  currentScreen: 'home' | 'diary';
  onToggle: () => void;
  onAvatarPress?: () => void;
  userName?: string;
}

export default function TopNav({ currentScreen, onToggle, onAvatarPress, userName }: TopNavProps) {
  return (
    <View style={styles.topBar}>
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
    paddingTop: 50,
    paddingHorizontal: 20,
    paddingBottom: 15,
    backgroundColor: '#F8F9FA',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E8E8E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: '#E8E8F0',
    borderRadius: 20,
    padding: 3,
  },
  toggleOption: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 17,
  },
  toggleOptionFirst: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
  },
  toggleOptionLast: {
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
  },
  toggleOptionActive: {
    backgroundColor: '#8B7CF6',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  toggleTextActive: {
    color: 'white',
  },
});