import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';

import { Text, TextInput, View } from '../../common';
import Checkbox from '../../common/Checkbox';

/* =============================================================================
<RPSelectListHeader />
============================================================================= */
const RPSelectListHeader = ({
  showRP,
  showSO,
  searchText,
  setshowRP,
  setshowSO,
  searchCode,
  setSearchText,
  setSearchCode,
  onCodeSearch,
  onTextSearch,
}) => {
  return (
    <View style={styles.container} rowGap={10}>
      <View columnGap={10} horizontal spacebetween style={styles.header}>
        <View columnGap={5} horizontal style={styles.checkboxContainer}>
          <Checkbox text="RP:" isChecked={showRP} onChange={setshowRP} />
          <Checkbox text="SO:" isChecked={showSO} onChange={setshowSO} />
        </View>
        <TextInput
          onChange={setSearchCode}
          value={searchCode}
          placeholder="Enter Number"
          autoCapitalize="characters"
          keyboardType="number-pad"
        />
        <TouchableOpacity onPress={onCodeSearch} style={styles.purpleBtn}>
          <Text style={{ color: 'white', textTransform: 'uppercase' }}>
            Use number
          </Text>
        </TouchableOpacity>
      </View>
      <View horizontal spacebetween columnGap={10}>
        <TextInput
          value={searchText}
          placeholder="Enter Text"
          autoCapitalize="characters"
          onChange={setSearchText}
        />
        <TouchableOpacity onPress={onTextSearch} style={styles.purpleBtn}>
          <Text style={{ color: 'white', textTransform: 'uppercase' }}>
            Use text
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 15,
  },
  header: {
    marginTop: 20,
  },
  checkboxContainer: {},
  purpleBtn: {
    padding: 9,
    color: 'white',
    borderRadius: 5,
    alignContent: 'center',
    backgroundColor: '#841584',
  },
});

/* Export
============================================================================= */
export default RPSelectListHeader;
