import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { useNavigation } from '@react-navigation/native';

/* =============================================================================
<DrawerButton />
============================================================================= */
const DrawerButton = () => {
  const navigation = useNavigation();

  return (
    <TouchableOpacity
      onPress={() => navigation.openDrawer()}
      style={styles.container}>
      <Feather name="menu" color="#000" size={22} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingRight: 15,
    paddingVertical: 10,
  },
});

/* Export
============================================================================= */
export default DrawerButton;
