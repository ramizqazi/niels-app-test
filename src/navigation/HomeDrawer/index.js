import React, { useEffect } from 'react';
import RNSplashScreen from 'react-native-splash-screen';
import { createDrawerNavigator } from '@react-navigation/drawer';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeDrawerContent from './HomeDrawerContent';
import CheckoutStack from '../../checkout/screens/CheckoutStack';
import TrackingStack from '../../tracking/screens/TrackingStack';
import ImageUploadStack from '../../imageUpload/screens/ImageUploadStack';
import {
  getRequestPermissionPromise,
  requestForegroundPermissionsAsync,
} from '../../util/functions';
import { useCameraPermission } from 'react-native-vision-camera';
import { connect } from 'react-redux';
import { selectUser } from '../../auth/redux/reducer';

const Drawer = createDrawerNavigator();

/* =============================================================================
<HomeDrawer />
============================================================================= */
const HomeDrawer = ({ navigation, user }) => {
  const { requestPermission } = useCameraPermission();

  const allowedApps = user?.allowedApps;

  useEffect(() => {
    navigateToLastScreen();

    (async () => {
      await requestPermission();
      await getRequestPermissionPromise();
      await requestForegroundPermissionsAsync();
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navigateToLastScreen = async () => {
    const lastRouteName = await AsyncStorage.getItem('LAST_SCREEN');
    console.log(lastRouteName);
    if (lastRouteName) {
      navigation.navigate(lastRouteName);
    }
    setTimeout(() => RNSplashScreen.hide(), 800);
  };

  return (
    <Drawer.Navigator
      drawerContent={renderDrawerContent}
      screenOptions={{
        headerShown: false,
        swipeEdgeWidth: 200,
        unmountOnBlur: true,
      }}>
      {allowedApps?.map(app => (
        <Drawer.Screen
          key={app}
          name={ROUTENAMES[app]?.name}
          component={ROUTENAMES[app]?.component}
          options={{ unmountOnBlur: true }}
        />
      ))}
    </Drawer.Navigator>
  );
};

const ROUTENAMES = {
  checkout_app_role: {
    name: 'CheckoutStack',
    component: CheckoutStack,
  },
  tracking_app_role: {
    name: 'TrackingStack',
    component: TrackingStack,
  },
  image_app_role: {
    name: 'ImageStack',
    component: ImageUploadStack,
  },
};

const renderDrawerContent = props => <HomeDrawerContent {...props} />;

const mapStatToProps = state => ({
  user: selectUser(state),
});

/* Export
============================================================================= */
export default connect(mapStatToProps)(HomeDrawer);
