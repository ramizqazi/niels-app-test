import React, { useEffect, useRef } from 'react';
import {
  useCodeScanner,
  useCameraDevice,
  useCameraPermission,
} from 'react-native-vision-camera';

import codeTypes from '../../static/codeTypes';
import { check_valid_RP } from '../../util/functions';
import { Camera, Container, Text } from '../../common';

/* =============================================================================
<BarScanScreen />
============================================================================= */
const BarScanScreen = ({ navigation }) => {
  const myCamera = useRef(null);
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      (async () => {
        await requestPermission();
      })();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const device = useCameraDevice('back');
  const codeScanner = useCodeScanner({
    codeTypes,
    onCodeScanned: data => {
      const code = data[0];
      console.log(data);
      const { type, value } = code;
      console.log(
        `Bar code with type ${type} and data ${value} has been scanned!`,
      );
      if (check_valid_RP(value)) {
        navigation.navigate('Tracking', { barcode: value });
      } else {
        // suppressed
        // Alert.alert('A barcode has been read but it was not a valid SF, RP or FS');
      }
    },
  });

  if (!hasPermission) {
    return <Text>No access to camera, you declined permission</Text>;
  }

  const _handleFocus = async e => {
    const focusCordinates = {
      x: e.nativeEvent.locationX,
      y: e.nativeEvent.locationY,
    };
    await myCamera.current.focus(focusCordinates);
  };

  return (
    <Container style={{ flex: 1 }} onTouchStart={_handleFocus}>
      <Camera
        device={device}
        ref={myCamera}
        photo={true}
        focusable={true}
        isActive={true}
        style={{ flex: 1 }}
        codeScanner={codeScanner}
      />
    </Container>
  );
};

export default BarScanScreen;
