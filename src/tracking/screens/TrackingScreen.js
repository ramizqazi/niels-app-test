import React, { useState, useEffect } from 'react';
import moment from 'moment';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Alert, StyleSheet, ToastAndroid } from 'react-native';

import {
  Button,
  Container,
  Content,
  DropDown,
  Text,
  TextInput,
  View,
} from '../../common';
import TextArea from '../../common/TextArea';
import timeData from '../../static/tracking-times.json';
import {
  check_valid_RP,
  getStoredHistory,
  setLastScreen,
} from '../../util/functions';
import { server_endpoints } from '../../config/secrets';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { connect } from 'react-redux';
import { selectUser } from '../../auth/redux/reducer';

/* =============================================================================
<TrackingScreen />
============================================================================= */
const TrackingScreen = ({ route, user, navigation }) => {
  const userName = user?.name;

  const params = route?.params;
  const barcode = params?.barcode;
  const [date, setDate] = useState('Today');
  const [trackingText, setTrackingText] = useState('');
  const [trackingTime, setTrackingTime] = useState(timeData[0].value);
  const [RPnummer, setRPnummer] = useState(barcode || '');
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [loading, setLoading] = useState(false);

  const _toggleDateModal = () => setDatePickerVisibility(prev => !prev);

  useEffect(() => {
    setLastScreen('TrackingStack');
  }, []);

  useEffect(() => {
    if (barcode) {
      setRPnummer(barcode);
    }
  }, [barcode]);

  const _handleMakeTrackingPress = async () => {
    if (!RPnummer.length) {
      Alert.alert('No number entered!');
      return;
    }

    let rpnum = '';
    if (RPnummer.length <= 6) {
      var paddedNumber = '0'.repeat(6 - RPnummer.length) + RPnummer;
      rpnum = 'RP' + paddedNumber;
    } else {
      rpnum = RPnummer;
    }

    if (!check_valid_RP(rpnum)) {
      Alert.alert('No valid RP/FS/SO number');
      return;
    }

    if (!userName) {
      Alert.alert('Please add user from settings in the left menu');
      return;
    }

    if (userName.length !== 6) {
      Alert.alert('No valid user');
      return;
    }

    // let correctWifi = await checkNetwork();
    // if (!correctWifi) {
    //   return;
    // }

    _handleSubmit(rpnum);
  };

  async function _handleSubmit(rpnum) {
    let ttext = trackingText;
    if (trackingText.length === 0) {
      ttext = 'Assistentie';
    }

    try {
      setLoading(true);
      var myHeaders = new Headers();
      myHeaders.append('Content-Type', 'application/json');

      var payload = {
        tracking: [
          {
            quantity: trackingTime,

            startTime: date,

            notes: ttext,

            user: userName,
          },
        ],
      };

      var payload = [payload];

      console.log(payload);

      let url = server_endpoints.post_tracking + String(rpnum).toUpperCase();

      let response = await fetch(url, {
        method: 'POST',
        headers: myHeaders,
        body: JSON.stringify(payload),
        redirect: 'follow',
      });
      let resptext = '';
      if (response.status === 200 || response.status === 204) {
        ToastAndroid.show('Tracking succesfully added!', ToastAndroid.LONG);

        resetInputs();
      } else {
        resptext = await response.text();
        let errormsg = 'Error: ' + String(response.status) + ' ' + resptext;
        Alert.alert(errormsg);
      }

      let historyObject = {
        id: String(new Date().getTime()),
        rp_number: rpnum,
        error: response.status !== 200 && response.status !== 204,
        status: response.status,
        text: resptext,
        tracking_time: trackingTime,
        startTime: date,
        notes: ttext,
        user: userName,
      };

      const storedhistory = await getStoredHistory();

      console.log('response', response);
      console.log('storedhistory', storedhistory);
      if (storedhistory == null) {
        const jsonValue = JSON.stringify([historyObject]);
        await AsyncStorage.setItem('HISTORY', jsonValue);
      } else {
        const jsonValue = JSON.stringify([...storedhistory, historyObject]);

        await AsyncStorage.setItem('HISTORY', jsonValue);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const resetInputs = () => {
    setTrackingTime('0.25');
    setTrackingText('');
    setDate('Today');
  };

  return (
    <Container>
      <Content contentContainerStyle={styles.content}>
        <View horizontal columnGap={10}>
          <Button
            flex
            variant="secondary"
            title="SCAN BARCODE"
            onPress={() => navigation.navigate('BarScan')}
          />
          <TextInput
            maxLength={8}
            placeholder="RP012345"
            value={RPnummer}
            onChangeText={setRPnummer}
            autoCapitalize="characters"
          />
        </View>
        <TextArea
          value={trackingText}
          onChange={setTrackingText}
          placeholder="Default: Assistentie"
        />
        <View horizontal columnGap={10}>
          <DropDown
            data={timeData}
            value={trackingTime}
            defaultValue={timeData[0]}
            onChange={selectedItem => setTrackingTime(selectedItem?.value)}
            buttonTextAfterSelection={selectedItem => {
              console.log(selectedItem);
              return selectedItem?.title;
            }}
            rowTextForSelection={item => {
              return item.title;
            }}
          />
          <Text bold>
            {typeof date === 'object' ? moment(date).format('L') : date}
          </Text>
          <Button
            title="CHANGE DATE"
            variant="secondary"
            onPress={_toggleDateModal}
          />
        </View>
        <Button
          title="MAKE TRACKING"
          variant="secondary"
          disabled={loading}
          loading={loading}
          onPress={_handleMakeTrackingPress}
        />
      </Content>

      <DateTimePickerModal
        mode="date"
        onConfirm={setDate}
        isVisible={isDatePickerVisible}
        onCancel={_toggleDateModal}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    rowGap: 15,
    paddingVertical: 20,
  },
  input: {
    flex: 1,
    height: 30,
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  box: {
    marginTop: 15,
  },
});

const mapStateToProps = state => ({
  user: selectUser(state),
});

/* Export
============================================================================= */
export default connect(mapStateToProps)(TrackingScreen);
