import React from 'react';
import { StyleSheet, Text as RNText } from 'react-native';

import * as Colors from '../config/colors';

/* =============================================================================
<Text />
============================================================================= */
const Text = ({
  h1,
  h2,
  h3,
  xl,
  lg,
  md,
  sm,
  xs,
  bold,
  white,
  light,
  medium,
  style,
  center,
  primary,
  children,
  ...props
}) => {
  return (
    <RNText
      style={[
        styles.text,
        h1 && styles.h1,
        h2 && styles.h2,
        h3 && styles.h3,
        xl && styles.xl,
        lg && styles.lg,
        md && styles.md,
        sm && styles.sm,
        xs && styles.xs,
        white && styles.white,
        bold && styles.bold,
        light && styles.light,
        medium && styles.medium,
        center && styles.center,
        primary && styles.primary,
        style,
      ]}
      {...props}>
      {children}
    </RNText>
  );
};

const styles = StyleSheet.create({
  text: {
    color: Colors.grey3,
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
  },
  h1: {
    color: Colors.black,
    fontSize: 32,
    fontFamily: 'Poppins-Bold',
  },
  h2: {
    color: Colors.black,
    fontSize: 28,
    fontFamily: 'Poppins-Bold',
  },
  h3: {
    color: Colors.black,
    fontSize: 24,
    fontFamily: 'Poppins-Bold',
  },
  xl: {
    color: Colors.black,
    fontSize: 20,
    fontFamily: 'Poppins-Bold',
  },
  lg: {
    color: Colors.black,
    fontSize: 18,
    fontFamily: 'Poppins-Semibold',
  },
  md: {
    color: Colors.black,
    fontSize: 18,
    fontFamily: 'Poppins-Regular',
  },
  sm: {
    fontSize: 14,
  },
  white: {
    color: '#fff',
  },
  xs: {
    fontSize: 12,
  },
  thin: {
    fontFamily: 'Poppins-Thin',
  },
  bold: {
    fontWeight: 'bold',
    fontFamily: 'Poppins-Bold',
  },
  light: {
    fontFamily: 'Poppins-Light',
  },
  medium: {
    fontFamily: 'Poppins-Medium',
  },
  regular: {
    fontFamily: 'Poppins-Regular',
  },
  center: {
    textAlign: 'center',
  },
  primary: {
    color: Colors.primary,
  },
});

/* Export
============================================================================= */
export default Text;
