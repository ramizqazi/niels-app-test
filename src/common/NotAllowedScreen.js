import React, { useEffect } from 'react';
import SplashScreen from 'react-native-splash-screen';
import { useCameraPermission } from 'react-native-vision-camera';

import Text from './Text';
import Container from './Container';
import {
  getRequestPermissionPromise,
  requestForegroundPermissionsAsync,
} from '../util/functions';

/* =============================================================================
<ComingSoon />
============================================================================= */
const ComingSoon = ({ navigation }) => {
  const { requestPermission } = useCameraPermission();

  useEffect(() => {
    SplashScreen.hide();
    (async () => {
      await requestPermission();
      await getRequestPermissionPromise();
      await requestForegroundPermissionsAsync();
    })().then(() => navigation.replace('HomeDrawer'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container style={{ backgroundColor: '#2A3037' }} center>
      <Text white>Please Allow Camera Permission From Settings!</Text>
    </Container>
  );
};

export default ComingSoon;
