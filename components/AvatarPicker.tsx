import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, Dimensions, ScrollView } from 'react-native';
import { Colors, Spacing, Shadow } from '../config/Theme';
import { Ionicons } from '@expo/vector-icons';

// Predefined avatars mapping
export const PREDEFINED_AVATARS = [
  { id: 'cloud', name: 'Nuvola Serena', source: require('../assets/avatars/avatar_cloud.png') },
  { id: 'sun', name: 'Sole Splendente', source: require('../assets/avatars/avatar_sun.png') },
  { id: 'plant', name: 'Piantina Felice', source: require('../assets/avatars/avatar_plant.png') },
  { id: 'zen', name: 'Pietre Zen', source: require('../assets/avatars/avatar_zen_stones.png') },
  { id: 'heart', name: 'Cuore Aperto', source: require('../assets/avatars/avatar_heart.png') },
  { id: 'moon', name: 'Luna Stellata', source: require('../assets/avatars/avatar_moon_stars.png') },
];

interface AvatarPickerProps {
  onSelect: (avatarId: string) => void;
  onClose: () => void;
  currentAvatarId?: string;
}

const { width } = Dimensions.get('window');

export default function AvatarPicker({ onSelect, onClose, currentAvatarId }: AvatarPickerProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Scegli il tuo Avatar</Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Ionicons name="close" size={24} color="#0D0140" />
        </TouchableOpacity>
      </View>
      
      <Text style={styles.subtitle}>Seleziona un'illustrazione che ti rappresenti oggi</Text>

      <View style={styles.grid}>
        {PREDEFINED_AVATARS.map((avatar) => {
          const isSelected = currentAvatarId === avatar.id;
          return (
            <TouchableOpacity 
              key={avatar.id} 
              style={[styles.avatarCard, isSelected && styles.selectedCard]}
              onPress={() => onSelect(avatar.id)}
            >
              <View style={styles.imageContainer}>
                <Image source={avatar.source} style={styles.avatarImage} />
                {isSelected && (
                  <View style={styles.checkBadge}>
                    <Ionicons name="checkmark" size={12} color="white" />
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: Spacing.lg,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0D0140',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.secondary,
    marginBottom: Spacing.xl,
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: Spacing.md,
  },
  avatarCard: {
    width: (width - 64) / 3, // 3 column grid with spacing
    alignItems: 'center',
    marginBottom: Spacing.md,
    padding: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
  },
  selectedCard: {
    borderColor: Colors.accent,
    backgroundColor: '#F8F7FF',
    borderWidth: 2,
  },
  imageContainer: {
    position: 'relative',
  },
  avatarImage: {
    width: 70,
    height: 70,
    borderRadius: 35,
  },
  checkBadge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    backgroundColor: Colors.accent,
    width: 20,
    height: 20,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: Colors.surface,
  },
  closeButton: {
    padding: 4,
  },
});
