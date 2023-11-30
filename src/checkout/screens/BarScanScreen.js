import React, { useCallback, useEffect, useRef, useState } from 'react';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import {
  Alert,
  StyleSheet,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import ScreenOrientation from 'react-native-orientation-locker';
import { useCameraDevice, useCodeScanner } from 'react-native-vision-camera';

import { Camera, Container, Text, View } from '../../common';
import codeTypes from '../../static/codeTypes';
import {
  check_valid_RP,
  displayInfo,
  setLastScreen,
  uploadImages,
} from '../../util/functions';
import { server_endpoints } from '../../config/secrets';
import { useFocusEffect } from '@react-navigation/native';
import { connect } from 'react-redux';
import { selectUser } from '../../auth/redux/reducer';

/* =============================================================================
<BarScanScreen />
============================================================================= */
const BarScanScreen = ({ user, navigation }) => {
  const myCamera = useRef(null);
  const [images, setImages] = useState([]);
  const [imgcount, setImgCount] = useState(0);
  const [RP, setRP] = useState(undefined);
  const [SN, setSN] = useState(undefined);
  const [portrait, isPortrait] = useState(true);
  const [uploading, isUploading] = useState(false);
  const [processingPicture, isProcessingPicture] = useState(false);
  const [cameraLoaded, setcameraLoaded] = useState(true);

  const userName = user?.name;

  useFocusEffect(
    useCallback(() => {
      // Do something when the screen is focused/mount
      setcameraLoaded(true);
      setLastScreen('CheckoutStack');

      return () => {
        setcameraLoaded(false);
        // Do something when the screen is unfocused/unmount
        // Useful for cleanup functions
      };
    }, []),
  );

  const checkOrientation = async orientation => {
    if (orientation === 'PORTRAIT') {
      isPortrait(true);
      console.log('portrait');
    } else {
      isPortrait(false);
      console.log('landscape');
    }
  };

  useEffect(() => {
    ScreenOrientation.addOrientationListener(checkOrientation);

    return () => {
      ScreenOrientation.removeOrientationListener(checkOrientation);
    };
  }, []);

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes,
    onCodeScanned: data => {
      const code = data[0];
      const { type, value } = code;
      console.log(
        `Bar code with type ${type} and data ${value} has been scanned!`,
      );
      if (check_valid_RP(value)) {
        if (imgcount > 0 && RP !== undefined) {
          Alert.alert(
            'You might lose images',
            "You've made some images that you didn't upload. These images will be lost if you select a RP/SO",
            [
              {
                text: 'OK',
                onPress: () => {
                  console.log('unload camera');
                  setcameraLoaded(false);
                  navigation.navigate('RPSelect', { rps_cb: RPSelectCallback });
                },
              },
              { text: 'Upload now', onPress: _handleUploadPress },
              { text: 'cancel', onPress: () => console.log('cancel Pressed') },
            ],
            { cancelable: false },
          );
        } else {
          setRP(value);
        }
      } else {
        // suppressed
        //Alert.alert('A barcode has been read but it was not a valid SF, RP or FS');
      }
    },
  });

  const takePicture = async () => {
    if (processingPicture) {
      return;
    }
    if (RP === undefined) {
      Alert.alert('Alert', 'No RP/FS/SO scanned');
      return;
    } else if (myCamera.current) {
      isProcessingPicture(true);
      const options = {
        qualityPrioritization: 'speed',
        flash: 'off',
        enableShutterSound: false,
      };
      const file = await myCamera.current.takePhoto(options);
      const filepath = `file://${file.path}`;
      await CameraRoll.save(filepath, {
        type: 'photo',
      });

      let NewImageList = [...images, filepath];
      setImages(NewImageList);
      setImgCount(NewImageList.length);
      isProcessingPicture(false);
    }
  };

  const _handleUploadPress = async () => {
    try {
      isUploading(true);

      const response = await uploadImages(
        server_endpoints.rp_checkout_post_img_url,
        RP,
        SN,
        images,
        userName,
      );

      if (response.ok) {
        if (response.status === 200) {
          ToastAndroid.show('Uploaded Successfully', ToastAndroid.LONG);

          //this reset is important and seems to solve bug that after some uploading there appear to be 2 states
          setImages([]);
          setImgCount(0);
          setcameraLoaded(false);
          navigation.navigate('RPSelect', { rps_cb: RPSelectCallback });
        } else {
          Alert.alert('Something went wrong');
        }
      }
    } catch (error) {
      let errortext =
        'Error uploading for ' +
        RP +
        ' Something happened while trying to upload the image:\n' +
        error;

      console.log(error);
      Alert.alert('Alert', errortext);
    } finally {
      isUploading(false);
    }
  };

  const _handleRPPress = async () => {
    if (imgcount > 0) {
      Alert.alert(
        'You might lose images',
        "You've made some images that you didn't upload. These images will be lost if you select a RP/SO",
        [
          {
            text: 'OK',
            onPress: () => {
              setcameraLoaded(false);
              navigation.navigate('RPSelect', { rps_cb: RPSelectCallback });
            },
          },
          {
            text: 'Upload now',
            onPress: _handleUploadPress,
          },
          { text: 'cancel', onPress: () => console.log('cancel Pressed') },
        ],
        { cancelable: false },
      );
    } else {
      setcameraLoaded(false);
      navigation.navigate('RPSelect', { rps_cb: RPSelectCallback });
    }
  };

  const RPSelectCallback = (rp, sn) => {
    setcameraLoaded(true);
    if (rp) {
      setRP(rp);
      setSN(sn);
      setImages([]);
      setImgCount(0);
    }
  };

  const _handleImageCountPress = () => {
    setcameraLoaded(false);
    navigation.navigate('ImageView', {
      images: images,
      cb: _images => {
        setcameraLoaded(true);
        setImages(_images);
        console.log(_images);
        setImgCount(_images.length);
      },
      cub: _images => {
        setcameraLoaded(true);
        setImages(_images);
        setImgCount(_images.length);
        _handleUploadPress();
      },
    });
  };

  const _handleFocus = async e => {
    const focusCordinates = {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    };
    await myCamera.current.focus(focusCordinates);
  };

  return (
    <Container style={{ backgroundColor: '#000' }}>
      {cameraLoaded && (
        <Camera
          ref={myCamera}
          photo={true}
          device={device}
          focusable={true}
          isActive={cameraLoaded}
          style={styles.camera}
          codeScanner={codeScanner}
        />
      )}
      <View style={styles.content} spacebetween>
        <View horizontal spacebetween style={{ paddingHorizontal: 5 }}>
          <TouchableOpacity
            onPress={_handleRPPress}
            disabled={uploading}
            style={styles.btn}>
            <Text>{RP ? `RP: ${RP}` : 'No RP Found'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={displayInfo} style={styles.btn}>
            <Text>
              <Ionicons
                name="information-circle-outline"
                size={24}
                color="black"
              />
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={_handleImageCountPress} style={styles.btn}>
            <Text>image count: {imgcount} </Text>
          </TouchableOpacity>
        </View>
        <View
          flex={portrait && 1}
          style={
            !portrait && {
              position: 'absolute',
              top: 80,
              bottom: 0,
              right: 100,
              left: 0,
              zIndex: 7000,
            }
          }
          onTouchStart={_handleFocus}
        />
        {!portrait ? (
          <View
            style={{
              flexDirection: 'column',
              flex: 2,
              alignContent: 'space-between',
            }}>
            <View
              style={{
                flex: 1,
                flexDirection: 'row-reverse',
                alignItems: 'flex-start',
                justifyContent: 'space-between',
              }}>
              <View
                style={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}>
                <TouchableOpacity
                  onPress={takePicture}
                  style={[styles.btn, { flex: 1 }]}
                  disabled={uploading}>
                  {!processingPicture && (
                    <Ionicons name="camera" size={20} color="black" />
                  )}
                  {processingPicture && (
                    <ActivityIndicator size="large" color="#00ff00" />
                  )}
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                flex: 0,
                flexDirection: 'row-reverse',
                alignItems: 'flex-end',
                justifyContent: 'space-between',
              }}>
              <TouchableOpacity
                onPress={_handleUploadPress}
                style={styles.btn}
                disabled={uploading}>
                <Text sm bold>
                  Upload
                </Text>
                {uploading && (
                  <ActivityIndicator size="large" color="#00ff00" />
                )}
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            horizontal
            spacebetween
            columnGap={10}
            style={{ paddingHorizontal: 10 }}>
            <TouchableOpacity
              onPress={_handleUploadPress}
              style={styles.btn}
              disabled={uploading}>
              <Text sm bold>
                Upload
              </Text>
              {uploading && <ActivityIndicator size="large" color="#00ff00" />}
            </TouchableOpacity>
            <TouchableOpacity
              onPress={takePicture}
              style={[styles.btn, { flex: 1 }]}
              disabled={uploading}>
              {!processingPicture && (
                <Ionicons name="camera" size={20} color="black" />
              )}
              {processingPicture && (
                <ActivityIndicator size="large" color="#00ff00" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Container>
  );
};

const styles = StyleSheet.create({
  camera: {
    width: '100%',
    height: '100%',
  },
  content: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 2000,
    position: 'absolute',
  },
  btn: {
    borderRadius: 5,
    marginVertical: 10,
    paddingVertical: 10,
    alignItems: 'center',
    paddingHorizontal: 14,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
});

const mapStateToProps = state => ({
  user: selectUser(state),
});

/* Export
============================================================================= */
export default connect(mapStateToProps)(BarScanScreen);
