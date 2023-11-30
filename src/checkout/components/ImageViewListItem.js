import React from 'react';
import { View } from '../../common';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { ImageBackground, StyleSheet, TouchableOpacity } from 'react-native';

/* =============================================================================
<ImageViewListItem />
============================================================================= */
const ImageViewListItem = ({ URL, onDeletePress }) => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: `file://${URL}` }}
        style={styles.backgroundImageContainer}>
        <TouchableOpacity onPress={() => onDeletePress(URL)}>
          <View style={styles.iconContainer}>
            <MaterialIcons name="delete-forever" size={40} color="red" />
          </View>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '50%',
    margin: 0,
    padding: 0,
  },
  backgroundImageContainer: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    height: 300,
  },
  iconContainer: {
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
    width: 50,
    margin: 5,
  },
});

/* Export
============================================================================= */
export default ImageViewListItem;
