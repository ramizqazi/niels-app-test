import React from 'react';
import { LogBox } from 'react-native';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { useCameraPermission } from 'react-native-vision-camera';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeDrawer from './HomeDrawer';
import { NotAllowedScreen } from '../common';
import LoginScreen from '../auth/screens/LoginScreen';
import ImageViewScreen from '../checkout/screens/ImageViewScreen';
import SettingsScreen from '../imageUpload/screens/SettingsScreen';
import * as Colors from '../config/colors';

import { selectUser } from '../auth/redux/reducer';

const Stack = createNativeStackNavigator();

const ignoreWarns = ['ViewPropTypes will be removed from React Native'];
LogBox.ignoreLogs(ignoreWarns);

/* =============================================================================
<AppNavigation />
============================================================================= */
const AppNavigation = ({ authenticated }) => {
  const { hasPermission } = useCameraPermission();

  return (
    <NavigationContainer theme={THEME}>
      <Stack.Navigator
        initialRouteName={hasPermission ? 'HomeDrawer' : 'NotAllowed'}
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
        }}>
        {authenticated ? (
          <>
            <Stack.Screen name="HomeDrawer" component={HomeDrawer} />
            <Stack.Screen name="NotAllowed" component={NotAllowedScreen} />
            <Stack.Screen
              name="ImageView"
              component={ImageViewScreen}
              options={{
                headerShown: true,
                headerStyle: {
                  backgroundColor: 'green',
                },
                title: 'Image View',
              }}
            />
            <Stack.Screen
              name="Settings"
              component={SettingsScreen}
              options={{
                headerShown: true,
                headerTintColor: '#000',
                headerStyle: {
                  backgroundColor: '#fff',
                },
                title: 'Settings',
              }}
            />
          </>
        ) : (
          <Stack.Screen name="Login" component={LoginScreen} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

const THEME = {
  dark: false,
  colors: {
    text: Colors.white,
    background: Colors.black,
  },
};

const mapStateToProps = state => ({
  authenticated: !!selectUser(state),
});

/* Export
============================================================================= */
export default connect(mapStateToProps)(AppNavigation);
