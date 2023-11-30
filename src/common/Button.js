import React from 'react';
import Ripple from 'react-native-material-ripple';
import { StyleSheet, Text, ActivityIndicator } from 'react-native';

import * as Colors from '../config/colors';

/* =============================================================================
<Button />
============================================================================= */
const Button = ({
  flex,
  block,
  title,
  style,
  loading,
  variant,
  txtColor,
  children,
  titleStyle,
  backgroundColor,
  ...props
}) => {
  const _CustomBackgroundColor = {
    backgroundColor: backgroundColor ? backgroundColor : null,
  };

  const _CustomTxtColor = {
    color: txtColor ? txtColor : null,
  };

  return (
    <Ripple
      style={[
        styles.container,
        flex && styles.flex,
        block && styles.block,
        _CustomBackgroundColor,
        variant === 'primary' && styles.primary,
        variant === 'secondary' && styles.secondary,
        variant === 'dark' && styles.dark,
        style,
        props.disabled && styles.primaryDisabled,
      ]}
      {...props}>
      {loading ? <ActivityIndicator color={Colors.white} /> : null}
      {!loading && title ? (
        <Text
          style={[
            styles.title,
            _CustomTxtColor,
            variant === 'primary' && styles.titlePrimary,
            variant === 'secondary' && styles.titleSecondary,
            variant === 'dark' && styles.titlePrimary,
            titleStyle,
          ]}>
          {title}
        </Text>
      ) : (
        children
      )}
    </Ripple>
  );
};

Button.defaultProps = {
  variant: 'secondary',
};

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 10,
    flexDirection: 'row',
    justifyContent: 'center',
    position: 'relative',
  },
  flex: {
    flex: 1,
  },
  block: {
    width: '100%',
  },
  primary: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primary,
  },
  primaryDisabled: {
    opacity: 0.7,
  },
  secondary: {
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
  },
  dark: {
    borderColor: '#182a47',
    backgroundColor: '#182a47',
  },
  title: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '900',
    textTransform: 'uppercase',
    fontFamily: 'Poppins-Semibold',
    textAlign: 'center',
  },
  titlePrimary: {
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
  titleSecondary: {
    color: Colors.white,
    fontFamily: 'Poppins-Regular',
  },
});

/* Export
============================================================================= */
export default Button;
