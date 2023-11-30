import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { Image, StyleSheet, TouchableOpacity } from 'react-native';

import { Text, View } from '../../common';

/* =============================================================================
<RPSelectListHeader />
============================================================================= */
const RPSelectListHeader = ({ data, onSelect }) => {
  return (
    <TouchableOpacity
      onPress={() => onSelect(data.RP, data.SN)}
      style={[styles.Box, data.isSO ? styles.SOBox : styles.RPBox]}>
      <View style={styles.rpandloc}>
        <Text style={styles.bold}>{data.RP}</Text>
      </View>

      {data.has_reference && <Text>Has reference pieces</Text>}

      <View horizontal columnGap={7}>
        <Feather name="map-pin" size={15} color="black" />
        <Text>{data.location}</Text>
      </View>

      <View horizontal columnGap={7}>
        <Ionicons name="ticket-outline" size={15} color="black" />
        <Text>{data.SN}</Text>
      </View>

      {data.image && (
        <Image
          resizeMode={'center'}
          source={{ uri: data.image }}
          style={styles.RPImage}
        />
      )}

      {!data.image && (
        <Text>
          <Text>Name: </Text>
          {data.item_name}
        </Text>
      )}
      {!data.image && (
        <Text>
          <Text>Brand: </Text>
          {data.item_brand}
        </Text>
      )}
      {!data.image && (
        <Text>
          <Text>Code: </Text>
          {data.item_code}
        </Text>
      )}

      <Text style={styles.italic}>{data.klant}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  Box: {
    margin: 10,
    borderRadius: 4,
    borderWidth: 1,
    width: '45%',
    borderColor: '#d6d7da',
    padding: 10,
  },
  RPImage: {
    height: 100,
    width: '100%',
  },
  RPBox: {
    backgroundColor: '#e0f0d3',
  },
  SOBox: {
    backgroundColor: '#ceedf0',
  },
  italic: {
    fontStyle: 'italic',
    marginVertical: 5,
  },
});

/* Export
============================================================================= */
export default RPSelectListHeader;
