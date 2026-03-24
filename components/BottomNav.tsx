import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Colors, Shadow } from '../config/Theme';

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
          color={activeTab === 'home' ? Colors.primary : Colors.secondary} 
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
          color={activeTab === 'explore' ? Colors.primary : Colors.secondary} 
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
    backgroundColor: Colors.surface,
    paddingVertical: 15,
    paddingBottom: 30,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    zIndex: 1000, // Ensure tooltip is above content
  },
  navItem: {
    alignItems: 'center',
    flex: 1,
  },
  navLabel: {
    fontSize: 12,
    color: Colors.secondary,
    marginTop: 4,
    fontWeight: '500',
  },
  navLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  addButtonContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 20,
    zIndex: 1001, // Ensure tooltip stays on top
  },
  addButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadow.medium,
  },
  tooltipContainer: {
    position: 'absolute',
    bottom: 75, // Position above the button
    alignItems: 'center',
    width: 200, // Wide enough for text
  },
  tooltipBubble: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
    ...Shadow.medium,
  },
  tooltipText: {
    color: Colors.onPrimary,
    fontSize: 14,
    fontWeight: '700',
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
    borderTopColor: Colors.primary,
    marginTop: -1,
  },
});