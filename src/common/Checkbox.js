import React from 'react';
import { StyleSheet } from 'react-native';
import CheckBox from 'react-native-check-box';

import Text from './Text';
import * as Colors from '../config/colors';

/* =============================================================================
<Checkbox />
============================================================================= */
const Checkbox = ({ text, isChecked, onChange }) => (
  <CheckBox
    leftText={text}
    onClick={() => onChange(prev => !prev)}
    isChecked={isChecked}
    checkBoxColor={Colors.success}
    leftTextView={
      <Text sm font="primary-medium" style={styles.txt}>
        {text}
      </Text>
    }
  />
);

const styles = StyleSheet.create({
  img: {
    width: 24,
    height: 24,
  },
  txt: {},
});

/* Export
============================================================================= */
export default Checkbox;
