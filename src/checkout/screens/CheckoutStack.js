import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const Stack = createNativeStackNavigator();

import BarScanScreen from './BarScanScreen';
import RPSelectScreen from './RPSelectScreen';

/* =============================================================================
<CheckoutStack />
============================================================================= */
const CheckoutStack = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        animation: 'slide_from_right',
        headerStyle: {
          backgroundColor: 'green',
        },
      }}>
      <Stack.Screen
        name="BarScan"
        component={BarScanScreen}
        options={{
          headerShown: false,
          title: 'Scan Barcode',
        }}
      />
      <Stack.Screen
        name="RPSelect"
        component={RPSelectScreen}
        options={{ title: 'Select RP' }}
      />
    </Stack.Navigator>
  );
};

/* Export
============================================================================= */
export default CheckoutStack;
