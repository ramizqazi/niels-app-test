import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, View } from '../../../common';
import HomeDrawerContentLink from './HomeDrawerContentLink';
import HomeDrawerContentHeader from './HomeDrawerContentHeader';
import * as Colors from '../../../config/colors';

import {
  logout as logoutAction,
  selectUser,
} from '../../../auth/redux/reducer';
import { connect } from 'react-redux';
import { AppVersion } from '../../../config/secrets';

/* =============================================================================
<HomeDrawerContent />
============================================================================= */
const HomeDrawerContent = ({ logout, user, navigation }) => {
  const insets = useSafeAreaInsets();

  const allowedApps = user?.allowedApps;

  const _handleLinkPress = to => {
    if (to) {
      navigation.navigate(to);
    }
    navigation.closeDrawer();
  };

  const _handleLogoutPress = () => {
    logout();
    navigation.closeDrawer();
  };

  return (
    <View
      style={[
        styles.container,
        { paddingTop: insets.top, paddingBottom: insets.bottom + 20 },
      ]}>
      <HomeDrawerContentHeader navigation={navigation} />
      <View flex>
        {allowedApps?.map(app => (
          <HomeDrawerContentLink
            key={app}
            icon={ROUTENAMES[app]?.icon}
            title={ROUTENAMES[app]?.name}
            onPress={() => _handleLinkPress(ROUTENAMES[app]?.to)}
          />
        ))}
      </View>
      <HomeDrawerContentLink
        primary
        title="Settings"
        onPress={() => _handleLinkPress('Settings')}
      />
      <HomeDrawerContentLink
        primary
        title="Logout"
        onPress={_handleLogoutPress}
      />
      <View style={styles.version}>
        <Text sm center>{`Version ${AppVersion}`}</Text>
      </View>
    </View>
  );
};

const ROUTENAMES = {
  checkout_app_role: {
    name: 'Item Checkout',
    icon: 'check-circle',
    to: 'CheckoutStack',
  },
  tracking_app_role: {
    name: 'Tracking',
    icon: 'map-pin',
    to: 'TrackingStack',
  },
  image_app_role: {
    name: 'Image Upload',
    icon: 'image',
    to: 'ImageStack',
  },
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  version: {
    paddingTop: 20,
    paddingHorizontal: 35,
  },
});

const mapDispatchToProps = {
  logout: logoutAction,
};

const mapStatToProps = state => ({
  user: selectUser(state),
});

/* Export
============================================================================= */
export default connect(mapStatToProps, mapDispatchToProps)(HomeDrawerContent);
