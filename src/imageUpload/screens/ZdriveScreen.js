import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, LogBox } from 'react-native';

import { Text, Container } from '../../common';
import ZdriveItem from '../components/ZdriveItem';

LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

/* =============================================================================
<ZdriveScreen />
============================================================================= */
const ZdriveScreen = ({ route }) => {
  const data = route?.params?.data;
  const [images, setImages] = useState([]);
  const [Rp, setRp] = useState('undefined');

  useEffect(() => {
    setImages(data.images);
    setRp(data.rp);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <FlatList
        data={images}
        numColumns={2}
        style={styles.flatList}
        renderItem={renderItem}
        keyExtractor={item => item}
        contentContainerStyle={styles.content}
        columnWrapperStyle={styles.flatListWrapper}
        ListHeaderComponent={<ListHeaderComponent Rp={Rp} images={images} />}
      />
    </Container>
  );
};

const ListHeaderComponent = ({ Rp, images }) => {
  return (
    <Text sm center>
      {`${Rp}: ${images.length} images found on Zdrive`}
    </Text>
  );
};

const renderItem = ({ item }) => <ZdriveItem data={item} />;

/* Style
============================================================================= */
const styles = StyleSheet.create({
  flatList: {
    flex: 1,
  },
  content: {
    padding: 10,
  },
  flatListWrapper: {
    justifyContent: 'space-between',
  },
});

/* Export
============================================================================= */
export default ZdriveScreen;
