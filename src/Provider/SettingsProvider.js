import React, { createContext, useEffect, useState } from 'react';
import { Alert, ToastAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { selectUser } from '../auth/redux/reducer';

export const SettingsContext = createContext();

/* =============================================================================
<SettingsProvider />
============================================================================= */
function SettingsProvider({ children }) {
  const [destination, setDestination] = useState('ABC');
  const [quality, setQuality] = useState(1);

  useEffect(() => {
    getStoredUser();
    getStoredDestination();
    getStoredQuality();
  }, []);

  const storeUser = async value => {
    try {
      await AsyncStorage.setItem('USER', value);
    } catch (e) {
      Alert.alert('error asyncstorage');
    }
  };

  const getStoredUser = async () => {
    try {
      const value = await AsyncStorage.getItem('USER');
      if (value !== null) {
        return value;
      } else {
        console.log('no user set');
      }
    } catch (e) {
      Alert.alert('error asyncstorage retr');
    }
    return '';
  };

  const storeDestination = async value => {
    // setDestination(value)
    try {
      await AsyncStorage.setItem('DESTINATION', value);
    } catch (e) {
      Alert.alert('error asyncstorage');
    }
  };

  const getStoredDestination = async () => {
    try {
      const value = await AsyncStorage.getItem('DESTINATION');
      if (value !== null) {
        setDestination(value);
        console.log('getstoreddestination ' + value);
        return value;
      } else {
        console.log('no user set');
      }
    } catch (e) {
      Alert.alert('error asyncstorage retr');
    }
    return '';
  };

  const getStoredQuality = async () => {
    try {
      const value = await AsyncStorage.getItem('QUALITY');
      if (value !== null) {
        setQuality(parseFloat(value));
        return value;
      } else {
        console.log('no quality set');
      }
    } catch (e) {
      Alert.alert('error asyncstorage retr');
    }
    return 1.0;
  };

  const store_quality = async _quality => {
    try {
      await AsyncStorage.setItem('QUALITY', String(_quality));
    } catch (e) {
      Alert.alert('error asyncstorage');
    }
  };

  const saveSettings = async (_quality, _destination) => {
    await store_quality(_quality);
    await storeDestination(_destination);

    setQuality(_quality);
    setDestination(_destination);
    ToastAndroid.show('Settings saved!', ToastAndroid.LONG);
  };

  return (
    <SettingsContext.Provider
      value={{
        quality,
        setQuality,
        destination,
        setDestination,
        saveSettings,
      }}>
      {children}
    </SettingsContext.Provider>
  );
}

const mapStateToProps = state => ({
  username: selectUser(state)?.name,
});

/* Export
============================================================================= */
export default connect(mapStateToProps)(SettingsProvider);
