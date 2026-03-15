import React, { useEffect, useRef, useState } from 'react';
import { 
  Modal, 
  View, 
  StyleSheet, 
  Animated, 
  Dimensions, 
  Easing,
  Platform
} from 'react-native';

interface HorizontalSlideModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const { width } = Dimensions.get('window');

const HorizontalSlideModal: React.FC<HorizontalSlideModalProps> = ({ 
  visible, 
  onClose, 
  children 
}) => {
  const [shouldRender, setShouldRender] = useState(visible);
  const [persistedChildren, setPersistedChildren] = useState(children);
  const slideAnim = useRef(new Animated.Value(width)).current;

  useEffect(() => {
    if (visible) {
      setPersistedChildren(children);
      setShouldRender(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 350,
        easing: Easing.out(Easing.poly(4)),
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: width,
        duration: 300,
        easing: Easing.in(Easing.poly(4)),
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (finished) {
          setShouldRender(false);
          setPersistedChildren(null); // Clear after animation
        }
      });
    }
  }, [visible]);

  // Update persisted children if they change while visible
  useEffect(() => {
    if (visible) {
      setPersistedChildren(children);
    }
  }, [children, visible]);

  if (!shouldRender && !visible) return null;

  return (
    <Modal
      visible={shouldRender || visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
      presentationStyle="overFullScreen"
    >
      <View style={styles.modalContainer}>
        <Animated.View
          style={[
            styles.animatedContent,
            { transform: [{ translateX: slideAnim }] }
          ]}
        >
          {persistedChildren || children}
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'transparent', 
  },
  animatedContent: {
    flex: 1,
    backgroundColor: '#F8F9FA', 
  },
});

export default HorizontalSlideModal;
