import {
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from 'react-native';
import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { server_allsearch } from '../components/connectionValue';

/* =============================================================================
<ZdriveItem />
============================================================================= */
const ZdriveItem = ({ data }) => {
  const navigation = useNavigation();
  const view_image = async uri => {
    console.log('view uri');
    navigation.navigate('SingleImageView', { imgurl: uri });
  };

  var image_uri = server_allsearch + data;

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={() => view_image(data)}>
        <ImageBackground source={{ uri: image_uri }} style={styles.image} />
      </TouchableOpacity>
    </View>
  );
};

/* Style
============================================================================= */
const styles = StyleSheet.create({
  container: {
    width: '50%',
    margin: 0,
    padding: 0,
  },
  image: {
    flex: 1,
    resizeMode: 'contain',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    width: '100%',
    height: 300,
  },
});

/* Export
============================================================================= */
export default ZdriveItem;
