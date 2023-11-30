import React from 'react';
import { StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import { Text, Touchable } from '../../../common';
import * as Colors from '../../../config/colors';

/* =============================================================================
<HomeDrawerContentLink />
============================================================================= */
const HomeDrawerContentLink = ({ title, icon, primary, onPress }) => {
  return (
    <Touchable
      horizontal
      style={styles.container}
      android_ripple={{
        color: Colors.ripple,
      }}
      onPress={onPress}>
      <Feather name={icon} color={Colors.primary} size={22} />
      <Text lg primary={primary}>
        {title}
      </Text>
    </Touchable>
  );
};

const styles = StyleSheet.create({
  container: {
    columnGap: 10,
    paddingVertical: 16,
    paddingHorizontal: 25,
  },
});

/* Export
============================================================================= */
export default HomeDrawerContentLink;
