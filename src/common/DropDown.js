import React from 'react';
import { StyleSheet } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import SelectDropdown from 'react-native-select-dropdown';

import * as Colors from '../config/colors';
import View from './View';

/* =============================================================================
<DropDown />
============================================================================= */
const DropDown = ({ data, defaultValue, onChange, value, error, ...props }) => {
  return (
    <SelectDropdown
      data={data}
      onSelect={onChange}
      defaultValue={defaultValue}
      buttonStyle={styles.input}
      dropdownStyle={styles.dropDown}
      buttonTextStyle={[styles.dropDownText]}
      dropdownIconPosition={'right'}
      errorText={error}
      {...props}
      renderDropdownIcon={isOpened => (
        <View style={{ marginRight: 10 }}>
          {isOpened ? (
            <Feather color="#000" size={22} name="chevron-up" />
          ) : (
            <Feather color="#000" size={22} name="chevron-down" />
          )}
        </View>
      )}
      rowTextStyle={{ textAlign: 'left' }}
    />
  );
};

const styles = StyleSheet.create({
  input: {
    flex: 1,
    height: 40,
    fontSize: 14,
    borderRadius: 4,
    borderWidth: 1,
    color: Colors.black,
    paddingHorizontal: 0,
    borderColor: Colors.border,
    backgroundColor: 'transparent',
    fontFamily: 'Poppins-Medium',
  },
  dropDown: {
    backgroundColor: '#fff',
  },
  dropDownText: {
    fontSize: 14,
    color: '#000',
    textAlign: 'left',
    fontFamily: 'Poppins-SemiBold',
  },
});

/* Export
============================================================================= */
export default DropDown;
