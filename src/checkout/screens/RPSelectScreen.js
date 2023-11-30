import React, { useEffect, useState } from 'react';
import { useIsFocused } from '@react-navigation/core';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Alert, StyleSheet, FlatList, ToastAndroid } from 'react-native';

import { Container } from '../../common';
import RPSelectListHeader from '../components/RPSelectListHeader';
import RPSelectListItem from '../components/RPSelectListItem';
import {
  loadDataStorage,
  fetchDataServerWithRenew,
  // fetchDataServerWithRenew,
} from '../../util/functions';

/* =============================================================================
<RPSelectScreen />
============================================================================= */
const RPSelectScreen = ({ route, navigation }) => {
  const { rps_cb } = route?.params;
  const isFocused = useIsFocused();
  const [data, setData] = useState(undefined);
  const [showRP, setshowRP] = useState(true);
  const [showSO, setshowSO] = useState(true);
  const [searchCode, setSearchCode] = useState('');
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    return () => {
      setTimeout(() => {
        rps_cb();
      }, 1000);
    };
  });

  useEffect(() => {
    if (isFocused) {
      (async () => {
        try {
          let jsondata = await loadDataStorage();

          if (jsondata) {
            setData(jsondata);
          }
          const fetchData = await fetchDataServerWithRenew();
          if (fetchData) {
            setData(fetchData);

            await AsyncStorage.setItem(
              'server_json_cache',
              JSON.stringify(fetchData),
            );

            ToastAndroid.show(
              'Data updated with most recent data',
              ToastAndroid.LONG,
            );
          }
        } catch (e) {
          Alert.alert('Alert', e?.message);
        }
      })();
    }
  }, [isFocused]);

  const selectThisRP = async (RPnumber, SN) => {
    navigation.goBack();

    setTimeout(() => {
      rps_cb(RPnumber, SN);
    }, 1000);
  };

  const _handleUseNumberPress = async () => {
    if (searchCode.length === 0) {
      Alert.alert('No number entered!');
      return;
    }
    if (searchCode.length > 6) {
      Alert.alert('Number is more than 6 digits. Can not be RP or SO');
      return;
    }
    var paddedNumber = '0'.repeat(6 - searchCode.length) + searchCode;
    var rpnum = 'RP' + paddedNumber;
    var sonum = 'SO' + paddedNumber;

    var snumber = 'NA_manualRPnumber';

    Alert.alert(
      'Use this number',
      'Choose between erpee or èso number',
      [
        {
          text: rpnum,
          onPress: () => {
            selectThisRP(rpnum, snumber);
          },
        },
        {
          text: sonum,
          onPress: () => {
            selectThisRP(sonum, snumber);
          },
        },
      ],
      { cancelable: true },
    );
  };

  const _handleUseTextPress = async () => {
    if (searchText.length === 0) {
      Alert.alert('No text entered!');
      return;
    }
    var rpnum = searchText;
    var snumber = 'input';

    selectThisRP(rpnum, snumber);
  };

  const filteredData = data?.filter(item => {
    if ((item.isSO && showSO) || (!item.isSO && showRP)) {
      if (searchCode) {
        if (String(item.RP).toLowerCase().includes(searchCode?.toLowerCase())) {
          return item;
        }
      } else {
        return item;
      }
    }
  });

  return (
    <Container>
      <FlatList
        numColumns={2}
        data={filteredData}
        columnWrapperStyle={styles.content}
        keyExtractor={item => item.RP + item.SN}
        renderItem={props => renderItem(props, selectThisRP)}
        ListHeaderComponent={
          <RPSelectListHeader
            showRP={showRP}
            showSO={showSO}
            setSearchCode={setSearchCode}
            searchText={searchText}
            setSearchText={setSearchText}
            setshowSO={setshowSO}
            setshowRP={setshowRP}
            searchCode={searchCode}
            onTextSearch={_handleUseTextPress}
            onCodeSearch={_handleUseNumberPress}
          />
        }
      />
    </Container>
  );
};

const renderItem = ({ item, index }, onSelect) => (
  <RPSelectListItem key={index} data={item} onSelect={onSelect} />
);

const styles = StyleSheet.create({
  content: {
    justifyContent: 'space-between',
  },
});

/* Export
============================================================================= */
export default RPSelectScreen;
