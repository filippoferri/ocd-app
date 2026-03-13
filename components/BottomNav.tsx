import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BottomNavProps {
  activeTab: 'home' | 'explore';
  onHomePress: () => void;
  onExplorePress: () => void;
  onAddPress: () => void;
}

export default function BottomNav({ activeTab, onHomePress, onExplorePress, onAddPress }: BottomNavProps) {
  const [showTooltip, setShowTooltip] = useState(false);

  useEffect(() => {
    checkTooltipStatus();
  }, []);

  const checkTooltipStatus = async () => {
    try {
      const hasSeen = await AsyncStorage.getItem('has_seen_activation_tooltip');
      if (!hasSeen) {
        setShowTooltip(true);
      }
    } catch (error) {
      console.error('Error checking tooltip status:', error);
    }
  };

  const handleAddPress = async () => {
    if (showTooltip) {
      setShowTooltip(false);
      try {
        await AsyncStorage.setItem('has_seen_activation_tooltip', 'true');
      } catch (error) {
        console.error('Error saving tooltip status:', error);
      }
    }
    onAddPress();
  };

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
      
      <View style={styles.addButtonContainer}>
        {showTooltip && (
          <View style={styles.tooltipContainer}>
            <View style={styles.tooltipBubble}>
              <Text style={styles.tooltipText}>Traccia attivazione</Text>
            </View>
            <View style={styles.tooltipArrow} />
          </View>
        )}
        <TouchableOpacity style={styles.addButton} onPress={handleAddPress}>
          <Ionicons name="add" size={24} color="white" />
        </TouchableOpacity>
      </View>
      
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
    zIndex: 1000, // Ensure tooltip is above content
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
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    zIndex: 1001, // Ensure tooltip stays on top
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#8B7CF6',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 70, // Position above the button
    alignItems: 'center',
    width: 200, // Wide enough for text
  },
  tooltipBubble: {
    backgroundColor: '#8B7CF6',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tooltipText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
  tooltipArrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderLeftWidth: 8,
    borderRightWidth: 8,
    borderTopWidth: 8,
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderTopColor: '#8B7CF6',
    marginTop: -1,
  },
});