import React from 'react';
import { StyleSheet, View as RNView } from 'react-native';

/* =============================================================================
<View />
============================================================================= */
const View = ({
  style,
  flex,
  block,
  center,
  rowGap,
  columnGap,
  spacebetween,
  children,
  horizontal,
  ...props
}) => (
  <RNView
    style={[
      flex && styles.flex,
      block && styles.block,
      center && styles.center,
      spacebetween && { justifyContent: 'space-between' },
      { columnGap: columnGap || 0 },
      { rowGap: rowGap || 0 },
      horizontal && styles.horizontal,
      style,
    ]}
    {...props}>
    {children}
  </RNView>
);

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  block: {
    width: '100%',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

/* Export
============================================================================= */
export default View;
