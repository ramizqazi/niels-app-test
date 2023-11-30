import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { ActivityIndicator } from 'react-native';
import SplashScreen from 'react-native-splash-screen';

import { login as loginAction } from '../redux/reducer';
import { Container } from '../../common';

/* =============================================================================
<LoginScreen />
============================================================================= */
const LoginScreen = ({ login }) => {
  useEffect(() => {
    _handleLogin();
    SplashScreen.hide();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const _handleLogin = async () => {
    login();
  };

  return (
    <Container center>
      <ActivityIndicator color="#999" size={28} />
    </Container>
  );
};

const mapDisptachToProps = {
  login: loginAction,
};

/* Export
============================================================================= */
export default connect(null, mapDisptachToProps)(LoginScreen);
