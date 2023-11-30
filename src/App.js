import 'core-js/stable/atob';
import React from 'react';
import { decode } from 'base-64';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';

import { PersistGate } from 'redux-persist/integration/react';

import AppNavigation from './navigation/AppNavigation';
import SettingsProvider from './Provider/SettingsProvider';
import configureStore from './redux/configureStore';

const { persistor, store } = configureStore();

global.atob = decode;

/* =============================================================================
<App />
============================================================================= */
const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SettingsProvider>
          <AppNavigation />
          <Toast />
        </SettingsProvider>
      </PersistGate>
    </Provider>
  );
};

/* Export
============================================================================= */
export default App;
