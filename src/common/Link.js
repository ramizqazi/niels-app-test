import React from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import Text from './Text';
import * as Colors from '../config/colors';

const Link = ({
  children,
  center,
  buttonStyle,
  to,
  onPress,
  textStyle,
  underline,
}) => {
  const navigation = useNavigation();
  const _textStyle = {
    textDecorationLine: underline ? 'underline' : 'none',
  };

  const _handlePress = () => {
    if (typeof onPress === 'function') {
      onPress();
    } else {
      navigation.navigate(to);
    }
  };

  return (
    <TouchableOpacity
      onPress={_handlePress}
      style={[styles.button, buttonStyle]}>
      <Text
        primary
        center={center}
        style={[styles.text, _textStyle, textStyle]}>
        {children}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  text: {
    fontSize: 13,
    color: Colors.primary,
    fontFamily: 'Poppins-Medium',
  },
});

/* Export
============================================================================= */
export default Link;
