import React, { useEffect, useState } from 'react';
import { StyleSheet, FlatList } from 'react-native';

import { Container } from '../../common';
import ImageViewListHeader from '../components/ImageViewListHeader';
import ImageViewListItem from '../components/ImageViewListItem';

/* =============================================================================
<ImageViewScreen />
============================================================================= */
const ImageViewScreen = ({ route, navigation }) => {
  const { images, cb, cub } = route?.params;
  const [_images, setImages] = useState(images);

  const _handleDelete = uri => {
    setImages(_images.filter(e => e !== uri));
  };
  const _handleGoBack = () => {
    navigation.goBack();

    // To Fix the Bug where camera stop working if we call this callback instanly
    setTimeout(() => {
      cb(_images);
    }, 1000);
  };

  const _handleUpload = () => {
    navigation.goBack();

    // To Fix the Bug where camera stop working if we call this callback instanly
    setTimeout(() => {
      cub(_images);
    }, 1000);
  };

  useEffect(() => {
    return () => {
      setTimeout(() => {
        cb(_images);
      }, 1000);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <FlatList
        data={_images}
        numColumns={2}
        keyExtractor={item => item}
        renderItem={props => renderItem(props, _handleDelete)}
        columnWrapperStyle={styles.content}
        ListHeaderComponent={
          <ImageViewListHeader
            showUpload={cub}
            onDonePress={_handleGoBack}
            onUploadPress={_handleUpload}
          />
        }
      />
    </Container>
  );
};

const renderItem = ({ item }, onDeletePress) => (
  <ImageViewListItem URL={item} onDeletePress={onDeletePress} />
);

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
  },
});

/* Export
============================================================================= */
export default ImageViewScreen;
