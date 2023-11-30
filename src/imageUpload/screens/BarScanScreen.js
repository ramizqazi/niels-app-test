import React, { useRef, useState, useEffect } from 'react';
import {
  Alert,
  StyleSheet,
  BackHandler,
  ToastAndroid,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import ScreenOrientation from 'react-native-orientation-locker';
import Entypo from 'react-native-vector-icons/Entypo';
import Feather from 'react-native-vector-icons/Feather';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { LogBox } from 'react-native';
import Dialog from 'react-native-dialog';
import { useIsFocused } from '@react-navigation/native';
import {
  useCodeScanner,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import codeTypes from '../../static/codeTypes';
import { Camera, Text, View } from '../../common';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';

LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

/* =============================================================================
<BarScanScreen />
============================================================================= */
const BarScanScreen = ({ route, navigation }) => {
  const parmas = route?.params;
  const erpee = parmas?.RP;
  const callback = parmas?.cb;
  const callback2 = parmas?.cb2;
  const myCamera = useRef(null);
  const isFocused = useIsFocused();
  const { hasPermission, requestPermission } = useCameraPermission();
  const [images, setImages] = useState([]);
  const [imgcount, setImgCount] = useState(0);
  const [RP, setRP] = useState(undefined);
  const [portrait, isPortrait] = useState(true);
  const [flash, setFlash] = useState(false);
  const [autoFocus, setAutoFocus] = useState(true);
  const [barcodescanning, setbarcodescanning] = useState(true);
  const [cameraLoaded, setcameraLoaded] = useState(true);
  const [imageprocessing, isImageprocessing] = useState(false);
  const [subfolderdialogvisible, setsubfolderdialogvisible] = useState(false);
  const [subfolder, setsubfolder] = useState('');
  const [inputval, setInputVal] = useState('');

  const toggleFlash = () => setFlash(previousState => !previousState);
  const toggleAutoFocus = () => setAutoFocus(previousState => !previousState);
  const toggleBarcodescanning = () => {
    if (barcodescanning) {
      ToastAndroid.show('Barcode scanning disabled!', ToastAndroid.LONG);
    } else {
      ToastAndroid.show('Barcode scanning enabled!', ToastAndroid.LONG);
    }

    setbarcodescanning(previousState => !previousState);
  };

  const takePicture = async () => {
    // console.log("start making picture")
    if (myCamera) {
      if (!imageprocessing) {
        isImageprocessing(true);
        console.log('start making picture', flash);
        const options = {
          qualityPrioritization: 'speed',
          flash: flash ? 'on' : 'off',
          enableShutterSound: false,
        };
        console.log(options);
        const file = await myCamera.current.takePhoto(options);
        const filepath = `file://${file.path}`;
        await CameraRoll.save(filepath, {
          type: 'photo',
        });

        let NewImageList = [...images, filepath];
        // console.log(NewImageList.length);
        setImages(NewImageList);
        setImgCount(NewImageList.length);
        // console.log("RP when taking picture" + RP)
        console.log('done making picture');
        isImageprocessing(false);
      } else {
        console.log('still processing image');
      }
    }
  };

  const uploadImages = async () => {
    console.log('uploadImages');
    if (RP) {
      callback(images, RP, subfolder);
      navigation.goBack();
    } else {
      backpressed();
    }
    // navigation.navigate('Home', {barcode: RP, takenImages: images, picker: false});
  };

  const select_sub_folder = async () => {
    console.log('select_sub_folder');

    setsubfolderdialogvisible(true);
    setcameraLoaded(false);
  };

  const handleCancel = async () => {
    console.log('handleCancel');
    setcameraLoaded(false);
    setsubfolderdialogvisible(false);
    setcameraLoaded(true);
  };

  const handleSave = async () => {
    console.log('handleSave');
    setcameraLoaded(false);
    setsubfolder(inputval.replace(/[^a-z0-9]/gi, '') + '/');
    setsubfolderdialogvisible(false);
    setcameraLoaded(true);
  };

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

  const check_valid_RP = data => {
    var begin = data.substring(0, 2);
    if (begin === 'RP' || begin === 'SO' || begin === 'FS') {
      if (data.length === 8) {
        return true;
      }
    }
    return false;
  };

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes,
    onCodeScanned: data => {
      if (barcodescanning) {
        const code = data[0];
        const { type, value } = code;
        console.log(
          `Bar code with type ${type} and data ${value} has been scanned!`,
        );
        if (check_valid_RP(value)) {
          setRP(value);
        } else {
          // suppressed
          //Alert.alert('A barcode has been read but it was not a valid SF, RP or FS');
        }
      }
    },
  });

  const imageViewCallback = _images => {
    setcameraLoaded(true);
    // if (myCamera) {
    //     myCamera.resumePreview()
    //     console.log("resumed");
    // }

    console.log('imageViewCallback', _images);
    setImages(_images);
    setImgCount(_images.length);
  };

  const imageViewUploadCallback = _images => {
    console.log('imageViewuploadCallback');
    navigation.goBack();
    callback(_images, RP);
  };

  const checkImages = () => {
    console.log('check images');
    // if (myCamera) {
    //     myCamera.pausePreview();
    //     console.log("paused");
    // }
    setcameraLoaded(false);
    navigation.navigate('ImageView', {
      images: images,
      cb: imageViewCallback,
      cub: imageViewUploadCallback,
    });
  };

  const backpressed = () => {
    console.log('backpressed');
    console.log('image count: ' + imgcount);
    if (imgcount > 0 && !RP) {
      Alert.alert(
        'No RPNumber Scaned',
        'Do you wish to return and add RPNumber manually',
        [
          {
            text: 'return',
            onPress: () => {
              callback2(images);
              navigation.goBack();
            },
          },
          {
            text: 'Cancel',
            onPress: () => {},
            style: 'cancel',
          },
        ],
        { cancelable: true },
      );

      return true;
    }

    return false;
  };

  useEffect(() => {
    if (!hasPermission) {
      (async () => {
        await requestPermission();
      })();
    }

    //   console.log("got rp from prev screen: " + erpee)
    if (erpee) {
      setRP(erpee);
    }

    BackHandler.addEventListener('hardwareBackPress', backpressed);
    return () =>
      BackHandler.removeEventListener('hardwareBackPress', backpressed);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [imgcount]);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const _handleFocus = async e => {
    const focusCordinates = {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    };
    await myCamera.current.focus(focusCordinates);
  };

  return (
    <View style={styles.container}>
      <Dialog.Container visible={subfolderdialogvisible}>
        <Dialog.Title>Choose subfolder</Dialog.Title>
        <Dialog.Input
          value={inputval}
          style={{ color: '#292c2e' }}
          autoCapitalize="characters"
          maxLength={10}
          onChangeText={text => setInputVal(text)}
        />
        <Dialog.Description>
          A subfolder will be made {' -> '} RP/subfolder/*images*
        </Dialog.Description>
        <Dialog.Button label="Cancel" onPress={handleCancel} />
        <Dialog.Button label="Save" onPress={handleSave} />
      </Dialog.Container>

      {cameraLoaded && isFocused && (
        <Camera
          device={device}
          ref={myCamera}
          photo={true}
          isActive={cameraLoaded}
          style={styles.camera}
          codeScanner={codeScanner}
          onPress={_handleFocus}
        />
      )}
      <View style={styles.content}>
        <View
          style={{
            flex: 0,
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
          }}>
          <TouchableOpacity
            style={styles.head}
            onPress={() => toggleBarcodescanning()}>
            <Text>
              {barcodescanning ? (
                <MaterialIcons
                  name="location-searching"
                  size={14}
                  color="black"
                />
              ) : (
                <MaterialIcons
                  name="location-disabled"
                  size={14}
                  color="black"
                />
              )}{' '}
              | RP: {RP ? RP : 'undefined'}{' '}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={toggleFlash}>
            <Text style={styles.toggle_button}>
              {flash ? (
                <MaterialIcons name="flash-on" size={24} color="black" />
              ) : (
                <MaterialIcons name="flash-off" size={24} color="black" />
              )}{' '}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.head}
            disabled={imageprocessing}
            onPress={checkImages}>
            <Text>image count: {imgcount} </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggle_button}
            onPress={() => toggleAutoFocus()}>
            <Text>Auto Focus: {autoFocus ? 'ON' : 'OFF'} </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggle_button}
            onPress={() => select_sub_folder()}>
            <Text>
              <Feather name="folder-plus" size={24} color="black" />
              {subfolder}
            </Text>
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
                  disabled={imageprocessing}
                  onPress={takePicture}
                  style={styles.captureCamera}>
                  {!imageprocessing && (
                    <Entypo name="camera" size={20} color="black" />
                  )}
                  {imageprocessing && (
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
                disabled={imageprocessing}
                onPress={uploadImages}
                style={styles.capture}>
                <Text sm>Upload</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              alignContent: 'flex-end',
            }}>
            <TouchableOpacity
              disabled={imageprocessing}
              onPress={uploadImages}
              style={styles.capture}>
              <Text sm> Upload </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={imageprocessing}
              onPress={takePicture}
              style={styles.capturePortrait}>
              {!imageprocessing && (
                <Entypo name="camera" size={20} color="black" />
              )}
              {imageprocessing && (
                <ActivityIndicator size="large" color="#00ff00" />
              )}
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  content: {
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 200,
    flex: 1,
    position: 'absolute',
    alignContent: 'space-around',
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    margin: 20,
  },
  button: {
    flex: 0.1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    color: 'white',
  },
  head: {
    color: '#000',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 8,
    paddingHorizontal: 20,
    zIndex: 5000,
    margin: 10,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  toggle_button: {
    color: '#000',
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 8,
    paddingHorizontal: 15,
    margin: 8,
    marginTop: 0,
    marginLeft: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureCamera: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    justifyContent: 'center',
    margin: 10,
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    color: '#000',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    margin: 10,
  },
  capturePortrait: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 10,
    paddingHorizontal: 20,
    alignSelf: 'flex-end',
    margin: 10,
  },
});

/* Export
============================================================================= */
export default BarScanScreen;
