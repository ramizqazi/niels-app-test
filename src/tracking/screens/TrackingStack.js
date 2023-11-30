/* eslint-disable react/no-unstable-nested-components */
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { DrawerButton } from '../../common';
import TrackingScreen from './TrackingScreen';
import TrackingHeader from '../components/TrackingHeader';
import BarScanScreen from './BarScanScreen';
import HistoryScreen from './HistoryScreen';

const Stack = createNativeStackNavigator();

/* =============================================================================
<TrackingStack />
============================================================================= */
const TrackingStack = () => {
  return (
    <Stack.Navigator
      headerMode="none"
      screenOptions={{
        headerTintColor: '#33393B',
        headerTitleStyle: {
          color: '#33393B',
        },
        headerStyle: {
          backgroundColor: '#99B2B6',
        },
      }}>
      <Stack.Screen
        name="Tracking"
        component={TrackingScreen}
        options={{
          headerTitle: 'Esengo tracking',
          headerRight: () => <TrackingHeader />,
          headerLeft: () => <DrawerButton />,
        }}
      />
      <Stack.Screen
        name="BarScan"
        component={BarScanScreen}
        options={{
          headerShown: true,
          title: 'Bar Scan',
        }}
      />
      <Stack.Screen
        name="History"
        component={HistoryScreen}
        options={{ title: 'Tracking geschiedenis' }}
      />
    </Stack.Navigator>
  );
};

/* Export
============================================================================= */
export default TrackingStack;
