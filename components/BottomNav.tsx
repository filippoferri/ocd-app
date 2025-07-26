import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface BottomNavProps {
  activeTab: 'home' | 'explore';
  onHomePress: () => void;
  onExplorePress: () => void;
  onAddPress: () => void;
}

export default function BottomNav({ activeTab, onHomePress, onExplorePress, onAddPress }: BottomNavProps) {
  return (
    <View style={styles.bottomNav}>
      <TouchableOpacity style={styles.navItem} onPress={onHomePress}>
        <Ionicons 
          name="home" 
          size={24} 
          color={activeTab === 'home' ? '#8B7CF6' : '#999'} 
        />
        <Text style={[styles.navLabel, activeTab === 'home' && styles.navLabelActive]}>Home</Text>
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.addButton} onPress={onAddPress}>
        <Ionicons name="add" size={24} color="white" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.navItem} onPress={onExplorePress}>
        <Ionicons 
          name="grid" 
          size={24} 
          color={activeTab === 'explore' ? '#8B7CF6' : '#999'} 
        />
        <Text style={[styles.navLabel, activeTab === 'explore' && styles.navLabelActive]}>Esplora</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingVertical: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: '#F0F0F0',
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
  },
  navLabelActive: {
    color: '#8B7CF6',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B7CF6',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
  },
});