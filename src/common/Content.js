import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';

import * as Colors from '../config/colors';

/* =============================================================================
<Content />
============================================================================= */
const Content = ({
  center,
  children,
  containerStyle,
  contentContainerStyle,
  keyboardAvoidingViewProps,
  ...props
}) => (
  <ScrollView
    style={[styles.container, containerStyle]}
    contentContainerStyle={[
      styles.contentContainer,
      center && styles.center,
      contentContainerStyle,
    ]}
    {...props}>
    {children}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  contentContainer: {
    paddingHorizontal: 14,
    backgroundColor: Colors.white,
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

/* Export
============================================================================= */
export default Content;
