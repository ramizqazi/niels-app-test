import React, { useRef, useEffect } from 'react';
import {
  useCodeScanner,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { Camera, Container, Text } from '../../common';
import codeTypes from '../../static/codeTypes';
import {
  check_valid_RP,
  requestForegroundPermissionsAsync,
} from '../../util/functions';

/* =============================================================================
<OnlyBarScanScreen />
============================================================================= */
const OnlyBarScanScreen = ({ navigation, route }) => {
  const myCamera = useRef(null);
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      (async () => {
        await requestPermission();
        await requestForegroundPermissionsAsync();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const callback = route?.params?.BarcodeScanCallback;
  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes,
    onCodeScanned: async data => {
      const code = data[0];
      const { type, value } = code;
      console.log(
        `Bar code with type ${type} and data ${value} has been scanned!`,
      );
      if (check_valid_RP(value)) {
        await AsyncStorage.setItem('RP', value);
        console.log(value);
        callback(value);
        navigation.goBack();
      } else {
        // suppressed
        //Alert.alert('A barcode has been read but it was not a valid SF, RP or FS');
      }
    },
  });

  if (!hasPermission) {
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
    <Container onTouchStart={_handleFocus}>
      <Camera
        device={device}
        ref={myCamera}
        photo={true}
        isActive={true}
        style={{ flex: 1 }}
        codeScanner={codeScanner}
      />
    </Container>
  );
};

/* Export
============================================================================= */
export default OnlyBarScanScreen;
