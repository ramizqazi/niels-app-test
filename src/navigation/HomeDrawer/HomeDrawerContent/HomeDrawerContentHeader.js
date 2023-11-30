import React from 'react';
import { StyleSheet } from 'react-native';

import { Text, View } from '../../../common';
import { connect } from 'react-redux';
import { selectUser } from '../../../auth/redux/reducer';

/* =============================================================================
<HomeDrawerContentHeader />
============================================================================= */
const HomeDrawerContentHeader = ({ user }) => {
  const userName = user?.name;
  const email = user?.email;

  return (
    <View horizontal style={styles.container}>
      <View flex style={styles.content}>
        <Text lg bold numberOfLines={1}>
          {userName}
        </Text>
        {email && (
          <Text sm primary>
            {email}
          </Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginLeft: 25,
    marginVertical: 32,
  },
  content: {
    paddingLeft: 12,
    paddingRight: 24,
  },
});

const mapStateToProps = state => ({
  user: selectUser(state),
});

/* Export
============================================================================= */
export default connect(mapStateToProps)(HomeDrawerContentHeader);
