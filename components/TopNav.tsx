import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Spacing } from '../config/Theme';
import { Image } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { PREDEFINED_AVATARS } from './AvatarPicker';

interface TopNavProps {
  currentScreen: 'home' | 'diary';
  onToggle: () => void;
  onAvatarPress?: () => void;
  userName?: string;
}

export default function TopNav({ currentScreen, onToggle, onAvatarPress, userName }: TopNavProps) {
  const insets = useSafeAreaInsets();
  const { currentUser } = useAuth();
  
  return (
    <View style={[styles.topBar, { paddingTop: insets.top + 10, paddingBottom: 10 }]}>
      <TouchableOpacity style={styles.avatar} onPress={onAvatarPress}>
        {(() => {
          if (currentUser?.avatar_url) {
            const predefined = PREDEFINED_AVATARS.find(a => a.id === currentUser.avatar_url);
            if (predefined) {
              return <Image source={predefined.source} style={styles.avatarImage} />;
            }
            return <Image source={{ uri: currentUser.avatar_url }} style={styles.avatarImage} />;
          }
          return <Ionicons name="person" size={28} color="#666" />;
        })()}
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
    paddingHorizontal: Spacing.md,
    paddingBottom: 15,
    backgroundColor: Colors.background,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Colors.surface,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  avatarImage: {
    width: 48,
    height: 48,
  },
  toggle: {
    flexDirection: 'row',
    backgroundColor: Colors.primaryLight,
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
    backgroundColor: '#9381ff',
  },
  toggleText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#9381ff',
  },
  toggleTextActive: {
    color: Colors.onPrimary,
  },
});