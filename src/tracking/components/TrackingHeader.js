import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { Alert, StyleSheet, TouchableOpacity } from 'react-native';

import { View } from '../../common';

/* =============================================================================
<TrackingHeader />
============================================================================= */
const TrackingHeader = () => {
  const navigation = useNavigation();
  return (
    <View horizontal>
      <TouchableOpacity
        style={styles.btn}
        onPress={() => navigation.navigate('History')}>
        <FontAwesome
          name="history"
          size={24}
          color="black"
          style={{ margin: 10 }}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  btn: {
    paddingHorizontal: 10,
  },
});

/* Export
============================================================================= */
export default TrackingHeader;
