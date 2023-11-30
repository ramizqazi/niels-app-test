import React from 'react';
import { Text, View } from '../../common';
import { StyleSheet, TouchableOpacity } from 'react-native';

/* =============================================================================
<ImageViewListHeader />
============================================================================= */
const ImageViewListHeader = ({ onDonePress, showUpload, onUploadPress }) => {
  return (
    <View
      style={{
        height: 70,
        flexDirection: 'row',
        justifyContent: 'space-between',
      }}>
      {/*             <TouchableOpacity onPress={() => upload()} style={styles.capture}>
            <Text style={{fontSize: 14}}> Upload </Text>
        </TouchableOpacity> */}

      <TouchableOpacity onPress={onDonePress} style={styles.capture}>
        <Text style={{ fontSize: 14 }}> Done </Text>
      </TouchableOpacity>
      {showUpload && (
        <TouchableOpacity onPress={onUploadPress} style={styles.capture}>
          <Text style={{ fontSize: 14 }}> Upload </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  capture: {
    flex: 0,
    borderRadius: 5,
    fontSize: 20,
    backgroundColor: '#4d99bf',
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 10,
  },
});

/* Export
============================================================================= */
export default ImageViewListHeader;
