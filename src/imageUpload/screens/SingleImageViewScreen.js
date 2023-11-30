import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  Platform,
  ImageBackground,
  TouchableOpacity,
  Alert,
  Dimensions,
} from 'react-native';
import { server_allsearch } from '../../config/secrets';
import RNFS from 'react-native-fs'; // Import react-native-fs

const { StorageAccessFramework } = RNFS;

/* =============================================================================
<SingleImageViewScreen />
============================================================================= */
const SingleImageViewScreen = ({ route }) => {
  const imgurl = route?.params?.imgurl;
  const [image_uri, setImageUri] = useState(undefined);
  const [maxWidth, setMaxWidth] = useState('100%');
  const [maxHeight, setMaxHeight] = useState('100%');
  const [imagewidth, setimagewidth] = useState(100);
  const [imageheight, setimageheight] = useState(100);

  useEffect(() => {
    setState();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const [downloadProgress, setDownloadProgress] = React.useState();
  const downloadPath = `${RNFS.DocumentDirectoryPath}${
    Platform.OS === 'android' ? '' : ''
  }`;

  const ensureDirAsync = async (dir, intermediates = true) => {
    const props = await RNFS.stat(dir);
    if (props.isDirectory()) {
      return props;
    }
    await RNFS.mkdir(dir, intermediates);
    return await ensureDirAsync(dir, intermediates);
  };

  const downloadCallback = _downloadProgress => {
    const progress =
      _downloadProgress.bytesWritten / _downloadProgress.contentLength;
    // eslint-disable-next-line radix
    var progstring = `${parseInt(progress * 100)} %`;
    setDownloadProgress(progstring);
  };

  const downloadFile = async () => {
    var fileUrl = image_uri;
    if (Platform.OS === 'android') {
      await ensureDirAsync(downloadPath);
    }

    let fileName = fileUrl.split('Reports/')[1];
    const downloadDest = `${downloadPath}/${fileName}`;

    const options = {
      fromUrl: fileUrl,
      toFile: downloadDest,
      background: true,
      begin: downloadCallback,
    };

    try {
      const result = await RNFS.downloadFile(options);
      if (result.statusCode === 200) {
        saveAndroidFile(downloadDest, fileName);
      } else {
        console.error('Download error:', result.statusCode, result.headers);
      }
    } catch (e) {
      console.error('download error:', e);
    }
  };

  const saveAndroidFile = async (fileUri, fileName = 'ABC_image_app') => {
    try {
      const fileString = await RNFS.readFile(fileUri, 'base64');
      const permissions =
        await StorageAccessFramework.requestDirectoryPermissionsAsync();
      if (!permissions.granted) {
        return;
      }

      try {
        const uri = await StorageAccessFramework.createFileAsync(
          permissions.directoryUri,
          fileName,
          'image/jpeg',
        );

        await RNFS.writeFile(uri, fileString, 'base64');
        Alert.alert('Download done!');
        setDownloadProgress('');
      } catch (e) {
        Alert.alert(e);
        setDownloadProgress('');
      }
    } catch (err) {}
  };

  useEffect(() => {
    const subscription = Dimensions.addEventListener(
      'change',
      ({ window, screen }) => {
        let windowWidth = window.width;
        let windowHeight = window.height;

        let h = imageheight;
        let w = imagewidth;

        let heightrat = windowHeight / h;
        let widthrat = windowWidth / w;

        var newheight = h;
        var newwidth = w;

        if (widthrat < heightrat) {
          newheight = widthrat * h;
          newwidth = widthrat * w;
        } else {
          newheight = widthrat * h;
          newwidth = widthrat * w;
        }

        setMaxHeight(newheight);
        setMaxWidth(newwidth);
      },
    );
    return () => subscription?.remove();
  });

  const setState = async () => {
    console.log('singleimgview focus');

    let uri = server_allsearch + imgurl;

    RNFS.stat(uri)
      .then(stats => {
        let windowWidth = Dimensions.get('window').width;
        let windowHeight = Dimensions.get('window').height;

        setimageheight(stats.size);
        setimagewidth(stats.size);

        let heightrat = windowHeight / stats.size;
        let widthrat = windowWidth / stats.size;

        var newheight = stats.size;
        var newwidth = stats.size;

        if (widthrat < heightrat) {
          newheight = widthrat * stats.size;
          newwidth = widthrat * stats.size;
        } else {
          newheight = widthrat * stats.size;
          newwidth = widthrat * stats.size;
        }

        setMaxHeight(newheight);
        setMaxWidth(newwidth);
        setImageUri(uri);
      })
      .catch(err => {
        console.log('Error getting image size:', err);
      });
  };

  return (
    <View style={{ margin: 0, padding: 0 }}>
      <View style={{ width: '100%', height: '100%' }}>
        <ImageBackground
          source={{ uri: image_uri }}
          style={{
            resizeMode: 'contain',
            justifyContent: 'flex-end',
            alignItems: 'flex-end',
            width: maxWidth,
            height: maxHeight,
          }}
        />
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={downloadFile}
          style={styles.touchableOpacityStyle}>
          <Image
            source={{
              uri: 'https://icons.iconarchive.com/icons/graphicloads/100-flat-2/256/arrow-download-icon.png',
            }}
            style={styles.floatingButtonStyle}
          />
          <Text>{downloadProgress}</Text>
        </TouchableOpacity>
      </View>
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
  touchableOpacityStyle: {
    position: 'absolute',
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    right: 30,
    bottom: 30,
  },
  floatingButtonStyle: {
    resizeMode: 'contain',
    width: 50,
    height: 50,
  },
});

export default SingleImageViewScreen;
