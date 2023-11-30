import React from 'react';
import {StyleSheet, View} from 'react-native';

import * as Colors from '../config/colors';

/* =============================================================================
<Card />
============================================================================= */
const Card = ({width, height, center, children, style, shadow, ...props}) => {
  const _style = {
    width,
    height,
  };

  const _center = {
    justifyContent: 'center',
    alignItems: 'center',
  };

  return (
    <View
      style={[
        _style,
        style,
        styles.container,
        center && _center,
        shadow ? styles.shadow : null,
      ]}
      {...props}>
      {children}
    </View>
  );
};

Card.defaultProps = {
  shadow: true,
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 'auto',
    borderRadius: 4,
    padding: 10,
    backgroundColor: Colors.white,
  },
  shadow: {
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
});

export default Card;
