import React, { useRef } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TextInput as RNTextInput,
} from 'react-native';

import * as Colors from '../config/colors';

/* =============================================================================
<TextInput />
============================================================================= */
const TextInput = ({
  left,
  right,
  label,
  value,
  errorText,
  editable,
  disabled,
  placeholder,
  labelStyle,
  inputStyle,
  containerStyle,
  contentContainerStyle,
  rightContainerStyle,
  leftContainerStyle,
  onPress,
  onRightPress,
  onLeftPress,
  onChange,
  ...props
}) => {
  const _textInput = useRef();

  const _handleChange = inputValue => {
    if (typeof onChange === 'function') {
      onChange(inputValue);
    }
  };

  const _handlePress = e => {
    if (typeof onPress === 'function') {
      onPress(e);
    } else if (_textInput.current && editable) {
      _textInput.current.focus();
    }
  };

  const _handleRightPress = () => {
    if (typeof onRightPress === 'function') {
      onRightPress();
    }
  };

  const _handleLeftPress = () => {
    if (typeof onLeftPress === 'function') {
      onLeftPress();
    }
  };

  const _renderRight = () => {
    if (right) {
      return right;
    }
    return null;
  };

  const _renderLeft = () => {
    if (left) {
      return left;
    }
    return null;
  };

  return (
    <Pressable
      style={[styles.container, containerStyle]}
      disabled={disabled}
      onPress={_handlePress}>
      {!!label && <Text style={[styles.label, labelStyle]}>{label}</Text>}
      <View style={[styles.content, contentContainerStyle]}>
        <Pressable
          style={[styles.left, leftContainerStyle]}
          onPress={_handleLeftPress}>
          {_renderLeft()}
        </Pressable>
        <RNTextInput
          ref={_textInput}
          value={value}
          style={[
            styles.input,
            left && styles.inputWithLeft,
            right && styles.inputWithRight,
            inputStyle,
          ]}
          editable={editable}
          selectionColor="#8A93A0"
          placeholderTextColor={Colors.grey2}
          placeholder={placeholder}
          onChangeText={_handleChange}
          {...props}
        />
        <Pressable
          style={[styles.right, rightContainerStyle]}
          onPress={_handleRightPress}>
          {_renderRight()}
        </Pressable>
      </View>
      {!!errorText && <Text style={styles.errorTxt}>{errorText}</Text>}
    </Pressable>
  );
};

TextInput.defaultProps = {
  editable: true,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
  },
  label: {
    fontSize: 18,
    marginBottom: 8,
    color: Colors.black,
    fontFamily: 'Poppins-SemiBold',
  },
  content: {
    width: '100%',
    borderRadius: 8,
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    backgroundColor: Colors.white,
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    color: Colors.black,
    paddingHorizontal: 0,
    fontFamily: 'Poppins-Medium',
  },
  inputWithLeft: {
    marginLeft: 14,
  },
  inputWithRight: {
    marginRight: 14,
  },
  right: {
    height: 40,
    paddingRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTxt: {
    color: Colors.danger,
    marginTop: 12,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    marginLeft: 5,
  },
});

/* Export
============================================================================= */
export default TextInput;
