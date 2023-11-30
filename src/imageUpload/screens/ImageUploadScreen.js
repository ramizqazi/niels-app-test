import React, { useEffect, useState } from 'react';
import Feather from 'react-native-vector-icons/Feather';
import { openPicker } from '@baronha/react-native-multiple-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import {
  Alert,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  ToastAndroid,
} from 'react-native';

import {
  Text,
  View,
  Button,
  Content,
  TextInput,
  Container,
} from '../../common';
import * as Colors from '../../config/colors';
import {
  checkNetwork,
  employe_check,
  getCheckPermissionPromise,
  requestForegroundPermissionsAsync,
  setLastScreen,
  uploadImages,
} from '../../util/functions';
import { server_endpoints } from '../../config/secrets';
import { useCameraPermission } from 'react-native-vision-camera';
import moment from 'moment';
import { connect } from 'react-redux';
import { selectUser } from '../../auth/redux/reducer';

/* =============================================================================
<ImageUploadScreen />
============================================================================= */
const ImageUploadScreen = ({ user, navigation }) => {
  const { hasPermission } = useCameraPermission();
  const [RPnummer, setRPnummer] = useState('');
  const [RNinfo, setRNInfo] = useState('');
  const [h_repairindex, set_h_repairindex] = useState(5);
  const [images, setImages] = useState([]);
  const [uploading, isUploading] = useState(false);
  const [historyRepairs, setHisteryRepairs] = useState(['', '', '', '', '']);

  const userName = user?.name;

  useEffect(() => {
    getData();
    setLastScreen('ImageStack');
  }, []);

  const getData = async () => {
    try {
      const _historyRepairsData = await AsyncStorage.getItem('RPHISTORY');

      // setUser(_userData || '');
      if (_historyRepairsData) {
        setHisteryRepairs(JSON.parse(_historyRepairsData));
      }

      requestForegroundPermissionsAsync();
    } catch (e) {
      Alert.alert(
        'Something went wrong',
        'An error occured while getting data',
      );
    }
  };

  const _handleScanBarCodePress = async () => {
    if (RPnummer && RPnummer.length > 0) {
      navigation.navigate('BarScan', {
        RP: RPnummer,
        cb: _handleImageUpload,
        cb2: _setImages,
      });
    } else {
      navigation.navigate('BarScan', {
        cb: _handleImageUpload,
        cb2: _setImages,
      });
    }
  };

  const _setImages = imgs => {
    if (imgs?.length > 0) {
      setImages([...images, ...imgs]);
    }
  };

  const ZdriveImagesPressHandler = async () => {
    console.log('ZdriveImagesPressHandler');

    console.log(RPnummer);

    if (
      RPnummer?.length === 8 &&
      /^\d+$/.test(RPnummer?.substring(2, 8)) &&
      (RPnummer?.substring(0, 2) === 'RPnummer' ||
        RPnummer?.substring(0, 2) === 'SO' ||
        RPnummer?.substring(0, 2) === 'FS')
    ) {
      let correctWifi = await checkNetwork();
      if (!correctWifi) {
        Alert.alert("Error: you don't seem to be connected to the internet!");
        return;
      }

      var requesturl = server_endpoints.get_repair_images_api + RPnummer;
      // console.log(requesturl)

      fetch(requesturl)
        .then(response => response.json())
        .then(result => {
          navigation.navigate('Zdrive', { data: result });
          // console.log(result)
        })
        .catch(error => {
          console.log('error', error);
          Alert.alert('Error:' + error);
        });
    } else {
      // Alert.alert("Geen geldig RPnummer ingevuld!")
      navigation.navigate('OnlyBarScan', {
        BarcodeScanCallback: BarcodeScanCallbackZdrive,
      });
    }
  };

  const BarcodeScanCallbackGallery = async rp => {
    console.log('RP: ', rp);
    setRPnummer(rp);
    ChoosePicturesPressHandler(rp);
  };

  const pickerCallback = async uris => {
    console.log('pickerCallback');
    setImages(uris);
  };

  const ChoosePicturesPressHandler = async () => {
    if (RPnummer?.length < 1) {
      console.log('geen repair number');
      navigation.navigate('OnlyBarScan', {
        BarcodeScanCallback: BarcodeScanCallbackGallery,
      });
    } else {
      const result = await openPicker({
        isPreview: false,
        mediaType: 'all',
      });

      await pickerCallback(result?.map(r => `file://${r.realPath}`));
    }
  };

  const BarcodeScanCallbackZdrive = async rp => {
    setRPnummer(rp);
    ZdriveImagesPressHandler(rp);
  };

  const _handleImageUpload = async (imgs, rp, subfolder) => {
    try {
      if (rp || RPnummer) {
        setRPnummer(rp);
        if (imgs?.length !== 0) {
          setImages(imgs);

          isUploading(true);

          let text =
            'start uploading ' +
            imgs?.length +
            ' images for RP: ' +
            RPnummer +
            ' is_erpee: ' +
            employe_check(rp);

          appendLog(text);

          const response = await uploadImages(
            server_endpoints.post_img_url,
            rp,
            null,
            imgs,
            subfolder,
            false,
            userName,
          );
          if (response?.ok) {
            if (response?.status === 200) {
              let _log =
                'done uploading ' +
                String(imgs.length) +
                ' images for RP: ' +
                String(rp);
              appendLog(_log);

              var text_1 =
                '** Done uploading ' +
                imgs.length +
                ' images for ' +
                rp +
                ' ** ';
              append_info(text_1);

              let t =
                String(rp) + ': uploaded ' + String(imgs?.length) + ' file(s)';

              //this reset is important and seems to solve bug that after some uploading there appear to be 2 states
              setImages([]);

              ToastAndroid.show(t, ToastAndroid.LONG);
              add_repair_to_history(rp);
            }
          }
        } else {
          Alert.alert('Please add Images');
        }
      } else {
        Alert.alert('Please add Rp Number');
      }
    } catch (error) {
      let errortext =
        'Error uploading for ' +
        rp +
        ' Something happened while trying to upload the image:\n' +
        error;

      appendLog(errortext);
      append_info('Error posting image: ' + errortext);
      Alert.alert('Alert', errortext);
      console.log(errortext);
      Alert.alert('Something went wrong', 'Error while uploading images');
    } finally {
      isUploading(false);
    }
  };
  const get_stored_repair_history = async () => {
    try {
      const value = await AsyncStorage.getItem('RPHISTORY');
      if (value !== null) {
        let data = JSON.parse(value);
        console.log('from history: ' + data.length);

        for (let i = 0; i < data.length; i++) {
          console.log(i + ' from history: ' + data[i]);
        }

        setHisteryRepairs(data);
        return data;
      } else {
        console.log('no history set');
      }
    } catch (e) {
      Alert.alert('error asyncstorage retr');
    }
    return historyRepairs;
  };

  const add_repair_to_history = async rp => {
    let h_repairs = await get_stored_repair_history();
    h_repairs[0] = h_repairs[1];
    h_repairs[1] = h_repairs[2];
    h_repairs[2] = h_repairs[3];
    h_repairs[3] = h_repairs[4];
    h_repairs[4] = rp;
    console.log('index 4 has: ' + h_repairs[4]);

    setHisteryRepairs(h_repairs);
    // setRPnummer("")
    set_h_repairindex(4);
    await store_repair_history(h_repairs);
  };

  const store_repair_history = async value => {
    // let value = ["1", "2", "3", "4", "5"]
    console.log('storing history...');
    for (let i = 0; i < value.length; i++) {
      console.log(i + ' to store: ' + value[i]);
    }

    try {
      await AsyncStorage.setItem('RPHISTORY', JSON.stringify(value));
    } catch (e) {
      Alert.alert('error asyncstorage');
    }
  };

  const apply_history_index = new_index => {
    let rp = historyRepairs[new_index];
    console.log('value: ' + rp);
    setRPnummer(rp);
    set_h_repairindex(new_index);
  };

  const previous_rp = async () => {
    let new_index = h_repairindex - 1;
    if (new_index < 0) {
      ToastAndroid.show('No older RP history..', ToastAndroid.LONG);
      return;
    }

    apply_history_index(new_index);
  };

  const next_rp = async () => {
    console.log('next rp');
    let new_index = h_repairindex + 1;
    if (new_index > 5) {
      ToastAndroid.show('No newer RP history..', ToastAndroid.LONG);
      return;
    }

    apply_history_index(new_index);
  };

  const showLogs = async () => {
    console.log('showLogs');
    navigation.navigate('LogView');
  };

  const showDebug = async () => {
    console.log('showDebug');

    var state = await NetInfo.fetch();
    let granted = await requestForegroundPermissionsAsync();
    let status = granted ? 'Granted' : 'Not Granted';
    var debugtext = 'Location permission (read SSID): ' + status + '\r\n';
    status = hasPermission ? 'Granted' : 'Not Granted';
    debugtext += 'Camera permission: ' + status + '\r\n';
    status = (await getCheckPermissionPromise()) ? 'Granted' : 'Not Grantd';
    debugtext += 'Media permission: ' + status + '\r\n';
    debugtext += 'Connection type: ' + state.type + '\r\n';
    debugtext += 'is connected: ' + state.isConnected + '\r\n';
    debugtext += 'has internet: ' + state.isInternetReachable + '\r\n';

    if (state.type === 'wifi') {
      if (await requestForegroundPermissionsAsync()) {
        debugtext += 'SSID: ' + state.details.ssid + '\r\n';
      }
    }

    append_info(debugtext);
  };

  const appendLog = async string => {
    const logs = await AsyncStorage.getItem('THEM_LOGZ');
    var dt = moment().format('DD/MM/YYYY');
    let new_logs = `${dt} : ${string} ${'\n'} ${logs || ''}`;

    await AsyncStorage.setItem('THEM_LOGZ', new_logs);
  };

  const append_info = async text => {
    console.log('svenh');
    var newtext = text + '\r\n' + RNinfo;
    setRNInfo(newtext);
  };

  return (
    <Container>
      <Content contentContainerStyle={styles.content}>
        <Button
          title="Scan barcode / Make image"
          onPress={_handleScanBarCodePress}
        />
        <View horizontal spacebetween columnGap={5}>
          <TouchableOpacity style={styles.arrowBtn} onPress={previous_rp}>
            <Feather name="chevron-left" color="#fff" size={22} />
          </TouchableOpacity>
          <TextInput
            value={RPnummer}
            onChange={setRPnummer}
            autoCapitalize="characters"
            placeholder="RP012345"
          />
          <Button title="clear" onPress={() => setRPnummer('')} />
          <TouchableOpacity style={styles.arrowBtn} onPress={next_rp}>
            <Feather name="chevron-right" color="#fff" size={22} />
          </TouchableOpacity>
        </View>

        <Button title="Zdrive images" onPress={ZdriveImagesPressHandler} />
        <Button title="Select images" onPress={ChoosePicturesPressHandler} />
        <View horizontal spacebetween columnGap={10}>
          <Button flex title="See logs" onPress={showLogs} />
          <Button flex title="debug" onPress={showDebug} />
        </View>

        <Button
          title="Upload Z-drive"
          variant="dark"
          loading={uploading}
          onPress={() => _handleImageUpload(images, RPnummer)}
          disabled={uploading}
        />

        <Text xl bold>
          SELECTED IMAGES:
          {images.length}
        </Text>

        <ScrollView style={styles.scrollView}>
          <Text style={{ margin: 0, padding: 0 }}>{RNinfo}</Text>
        </ScrollView>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    rowGap: 15,
    flexGrow: 1,
    paddingVertical: 20,
  },
  arrowBtn: {
    borderWidth: 1,
    borderRadius: 2,
    paddingVertical: 8,
    paddingHorizontal: 8,
    position: 'relative',
    flexDirection: 'row',
    justifyContent: 'center',
    borderColor: Colors.secondary,
    backgroundColor: Colors.secondary,
  },
  scrollView: {
    height: '100%',
    marginTop: 10,
    padding: 20,
    backgroundColor: '#b6c1d4',
    borderWidth: 5,
    borderRadius: 15,
  },
});

const mapStateToProps = state => ({
  user: selectUser(state),
});

/* Export
============================================================================= */
export default connect(mapStateToProps)(ImageUploadScreen);
