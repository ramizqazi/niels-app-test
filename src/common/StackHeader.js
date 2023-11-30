import React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { View, Text, Pressable, StyleSheet } from 'react-native';

import * as Colors from '../config/colors';

import ChevronLeftIcon from '../assets/icons/edit-chevron-left.svg';
import { useNavigation } from '@react-navigation/native';

/* =============================================================================
<StackHeader />
============================================================================= */
const StackHeader = ({
  left,
  right,
  title,
  outlined,
  elevated,
  children,
  titleStyle,
  containerStyle,
  leftContainerStyle,
  rightContainerStyle,
  centerContainerStyle,
  onLeftPress,
  onRightPress,
}) => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const _handleLeftPress = () => {
    if (typeof onLeftPress === 'function') {
      onLeftPress();
    } else {
      navigation.goBack();
    }
  };

  const _handleRightPress = () => {
    if (typeof onRightPress === 'function') {
      onRightPress();
    }
  };

  const _renderLeft = () => {
    if (left) {
      return left;
    }
    return <ChevronLeftIcon />;
  };

  const _renderRight = () => {
    if (right) {
      return right;
    }
    return null;
  };

  const _renderCenter = () => {
    if (children) {
      return children;
    }
    if (title) {
      return (
        <Text style={[styles.title, titleStyle]} numberOfLines={1}>
          {title}
        </Text>
      );
    }
    return null;
  };

  return (
    <View
      style={[
        styles.container,
        { height: insets.top + 60, paddingTop: insets.top },
        outlined && styles.outlined,
        elevated && styles.elevated,
        containerStyle,
      ]}>
      <Pressable
        style={[styles.left, leftContainerStyle]}
        onPress={_handleLeftPress}>
        {_renderLeft()}
      </Pressable>
      <View style={[styles.center, centerContainerStyle]}>
        {_renderCenter()}
      </View>
      <Pressable
        style={[styles.right, rightContainerStyle]}
        onPress={_handleRightPress}>
        {_renderRight()}
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.background,
  },
  outlined: {
    borderBottomColor: Colors.outline,
  },
  elevated: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },
  left: {
    padding: 20,
    alignItems: 'flex-start',
  },
  center: {
    flex: 1,
  },
  right: {
    padding: 20,
    alignItems: 'flex-end',
  },
  title: {
    fontSize: 18,
    textAlign: 'left',
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
});

/* Export
  ============================================================================= */
export default StackHeader;
