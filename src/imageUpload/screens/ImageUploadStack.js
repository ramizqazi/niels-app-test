/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DrawerButton } from '../../common';
import ZdriveScreen from './ZdriveScreen';
import LogViewScreen from './LogViewScreen';
import BarScanScreen from './BarScanScreen';
import ImageUploadScreen from './ImageUploadScreen';
import OnlyBarScanScreen from './OnlyBarScanScreen';
import SingleImageViewScreen from './SingleImageViewScreen';

const Stack = createNativeStackNavigator();

/* =============================================================================
<ImageUploadStack />
============================================================================= */
const ImageUploadStack = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        headerTintColor: '#33393B',
        headerTitleStyle: {
          color: '#33393B',
        },
        headerStyle: {
          backgroundColor: '#C1C334',
        },
      }}>
      <Stack.Screen
        name="ImageUpload"
        component={ImageUploadScreen}
        options={{
          headerTitle: 'Image upload direct',
          headerLeft: () => <DrawerButton />,
        }}
      />
      <Stack.Screen
        name="BarScan"
        component={BarScanScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="LogView"
        component={LogViewScreen}
        options={{ title: 'See logs' }}
      />
      <Stack.Screen
        name="Zdrive"
        component={ZdriveScreen}
        options={{ title: 'View Zdrive images' }}
      />
      <Stack.Screen
        name="SingleImageView"
        component={SingleImageViewScreen}
        options={{ title: 'Single image' }}
      />
      <Stack.Screen
        name="OnlyBarScan"
        component={OnlyBarScanScreen}
        options={{ title: 'Scan barcode' }}
      />
    </Stack.Navigator>
  );
};

/* Export
============================================================================= */
export default ImageUploadStack;
