import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import { Platform, Alert, PermissionsAndroid } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

import { AppVersion, server_endpoints } from '../config/secrets';
import DeviceInfo from 'react-native-device-info';

export const getCheckPermissionPromise = () => {
  if (Platform.Version >= 33) {
    return Promise.all([
      PermissionsAndroid.check(
        PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      ),
      PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO),
    ]).then(
      ([hasReadMediaImagesPermission, hasReadMediaVideoPermission]) =>
        hasReadMediaImagesPermission && hasReadMediaVideoPermission,
    );
  } else {
    return PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    );
  }
};

export const getRequestPermissionPromise = () => {
  if (Platform.Version >= 33) {
    return PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES,
      PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO,
    ]).then(
      statuses =>
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_IMAGES] ===
          PermissionsAndroid.RESULTS.GRANTED &&
        statuses[PermissionsAndroid.PERMISSIONS.READ_MEDIA_VIDEO] ===
          PermissionsAndroid.RESULTS.GRANTED,
    );
  } else {
    return PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
    ).then(status => status === PermissionsAndroid.RESULTS.GRANTED);
  }
};

export const requestForegroundPermissionsAsync = async () => {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'ABCNEILS App',
        message: 'ABCNEILS App like to access your location ',
      },
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    } else {
      return false;
    }
  } catch (err) {
    console.warn(err);
  }
};

export const check_valid_RP = data => {
  var begin = data.substring(0, 2);
  if (begin === 'RP' || begin === 'SO' || begin === 'FS') {
    if (data.length === 8) {
      return true;
    }
  }
  return false;
};

export const displayInfo = async () => {
  Alert.alert('Info', `RP Checkout app ${AppVersion}`);
};

export const loadDataStorage = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('server_json_cache');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    console.log('Error' + e);
  }
};

export const fetchDataServerWithRenew = async () => {
  try {
    let correctWifi = await checkNetwork();
    if (!correctWifi) {
      return;
    }
    //let response = await cancelablePromise.promise
    const response = await fetch(
      server_endpoints.rp_checkout_data_url_renew,
    ).then(res => res.json());

    return response;
  } catch (error) {
    console.log(error.message);
    // Alert.alert(error.message);
  }
};

export const checkNetwork = async () => {
  let state = await NetInfo.fetch();
  //console.log(state.details.ssid, state.type)
  if (state.type !== 'wifi' && state.type !== 'vpn') {
    Alert.alert('Error:You are not on a wifi connection!');
    return false;
  }
  if (await requestForegroundPermissionsAsync()) {
    //ToastAndroid.show(state.details.ssid, ToastAndroid.LONG);
    if (state.details.ssid && state.details.ssid !== 'ABC-private') {
      //console.log(state.details.ssid)
      Alert.alert(
        "Error: SSID is not 'ABC-private'. You seem to be connected to: " +
          state.details.ssid,
      );
      return false;
    }
  }
  console.log('wifi ok');
  return true;
};

export const getStoredHistory = async () => {
  try {
    const jsonValue = await AsyncStorage.getItem('HISTORY');
    return jsonValue != null ? JSON.parse(jsonValue) : null;
  } catch (e) {
    Alert.alert('error asyncstorage history rtr');
  }
};

export const validateUploadImagesData = async (
  RP,
  SN,
  images,
  RpValidation,
) => {
  if (RP === undefined) {
    Alert.alert('No RP/FS/SO scanned');
    return;
  }
  console.log(images);
  if (images.length === 0) {
    Alert.alert('Please take some pictures first');
    return;
  }

  var is_general_or_damage = false;
  if (RP === 'checkin-damage' || RP === 'checkin-general') {
    is_general_or_damage = true;
  }

  var is_text_input = false;
  if (SN === 'input') {
    is_text_input = true;
  }
  console.log(RpValidation);
  if (
    (RpValidation ? !employe_check(RP) : RpValidation) &&
    !is_general_or_damage &&
    !is_text_input
  ) {
    Alert.alert('Not a valid RP/SO/FS number');
    return;
  }

  var state = await NetInfo.fetch();

  if (state.type !== 'wifi') {
    Alert.alert('Error:You are not on a wifi connection!');
    return;
  }

  if (!getCheckPermissionPromise()) {
    getRequestPermissionPromise();
    return;
  }

  return true;
};

export const uploadImages = async (
  url,
  RP,
  SN,
  images,
  subfolder = '',
  RpValidation = true,
  username,
) => {
  const validation = await validateUploadImagesData(
    RP,
    SN,
    images,
    RpValidation,
  );

  if (!validation) {
    return;
  }
  var data = new FormData();

  images.forEach(png_uri => {
    let filename = png_uri.split('/').pop();
    let match = /\.(\w+)$/.exec(filename);
    let type = match ? `image/${match[1]}` : 'image';
    data.append('file', { uri: png_uri, name: filename, type: type });
  });

  data.append('rp_number', RP);
  if (SN) {
    data.append('SN', SN);
  }
  data.append('is_erpee', true);

  data.append('app_version', AppVersion);
  if (subfolder) {
    data.append('subfolder', subfolder);
  }
  data.append('android_id', await DeviceInfo.getAndroidId());
  if (!RpValidation) {
    data.append('is_erpee', false);
  }
  if (username) {
    data.append('username', username);
  }
  data.append('destination', await getDestination());
  data.append('device_name', await DeviceInfo.getDeviceName());
  data.append('device_brand', await DeviceInfo.getBrand());
  data.append('device_manufacturer', await DeviceInfo.getManufacturer());
  data.append('device_modelname', await DeviceInfo.getModel());
  data.append('device_modelid', await DeviceInfo.getModel());
  data.append('device_designname', await DeviceInfo.getDevice());
  data.append('device_productname', await DeviceInfo.getProduct());
  data.append('device_deviceyearclass', await DeviceInfo.getBuildId());
  data.append('device_totalmemory', await DeviceInfo.getTotalMemory());
  // data.append('device_supportcpu', await DeviceInfo.supportedCpuArchitectures); -> makes upload crash
  data.append('device_osname', await DeviceInfo.getBaseOs());
  data.append('device_osversion', await DeviceInfo.getVersion());
  data.append('device_osbuildid', await DeviceInfo.getBuildId());
  data.append('device_osinternalbuildid', await DeviceInfo.getBuildId());
  data.append('device_osbuildfingerprint', await DeviceInfo.getFingerprint());
  data.append('device_platformapilevel', await DeviceInfo.getApiLevel());

  let response = await fetch(url, {
    method: 'post',
    body: data,
    headers: {
      Connection: 'keep-alive',
    },
  });

  return response;
};

export const downloadFile = async ({ image_uri, downloadCallback }) => {
  var fileUrl = image_uri;

  let fileName = fileUrl.split('Reports/')[1];
  const downloadDest = `${RNFS.DocumentDirectoryPath}/${fileName}`;

  const options = {
    fromUrl: fileUrl,
    toFile: downloadDest,
    background: true,
    begin: downloadCallback,
  };

  try {
    const result = await RNFS.downloadFile(options);
    if (result.statusCode === 200) {
      saveAndroidFile(downloadDest, fileName);
    } else {
      console.error('Download error:', result.statusCode, result.headers);
    }
  } catch (e) {
    console.error('download error:', e);
  }
};

export const saveAndroidFile = async (fileUri, fileName = 'ABC_image_app') => {
  try {
    const fileString = await RNFS.readFile(fileUri, 'base64');
    const permissions = await RNFS.requestExternalStoragePermission();
    if (permissions) {
      const filePath = `${RNFS.ExternalStorageDirectoryPath}/${fileName}.jpg`;
      try {
        await RNFS.writeFile(filePath, fileString, 'base64');
        Alert.alert('Download done!');
      } catch (e) {
        Alert.alert(e);
      }
    } else {
      Alert.alert('Permission denied');
    }
  } catch (err) {
    console.error('Error reading file:', err);
  }
};

export const employe_check = RP => {
  if (
    RP.length === 8 &&
    /^\d+$/.test(RP.substring(2, 8)) &&
    (RP.substring(0, 2) === 'RP' ||
      RP.substring(0, 2) === 'SO' ||
      RP.substring(0, 2) === 'FS')
  ) {
    return true;
  } else {
    return false;
  }
};

export const setLastScreen = async routeName => {
  setTimeout(
    async () => await AsyncStorage.setItem('LAST_SCREEN', routeName),
    1000,
  );
};

export const getDestination = async () =>
  await AsyncStorage.getItem('DESTINATION');
