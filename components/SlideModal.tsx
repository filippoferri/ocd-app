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

interface SlideModalProps {
  visible: boolean;
  onClose: () => void;
  children: React.ReactNode;
  direction?: 'horizontal' | 'vertical';
}

const { width, height } = Dimensions.get('window');

const SlideModal: React.FC<SlideModalProps> = ({ 
  visible, 
  onClose, 
  children,
  direction = 'horizontal'
}) => {
  const [shouldRender, setShouldRender] = useState(visible);
  const [persistedChildren, setPersistedChildren] = useState(children);
  
  // Choose initial value based on direction
  const initialValue = direction === 'horizontal' ? width : height;
  const slideAnim = useRef(new Animated.Value(initialValue)).current;

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
        toValue: initialValue,
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
  }, [visible, direction, initialValue]);

  // Update persisted children if they change while visible
  useEffect(() => {
    if (visible) {
      setPersistedChildren(children);
    }
  }, [children, visible]);

  if (!shouldRender && !visible) return null;

  const transformStyle = direction === 'horizontal' 
    ? { translateX: slideAnim } 
    : { translateY: slideAnim };

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
            { transform: [transformStyle] }
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
    backgroundColor: 'transparent', 
  },
});

export default SlideModal;
