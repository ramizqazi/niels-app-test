import React, { useState, useContext } from 'react';
import Slider from '@react-native-community/slider';
import { Picker } from '@react-native-picker/picker';
import { LogBox, StyleSheet } from 'react-native';

import { Container, Content, View, Text, Button } from '../../common';
import { SettingsContext } from '../../Provider/SettingsProvider';
import { connect } from 'react-redux';
import { selectUser } from '../../auth/redux/reducer';

LogBox.ignoreLogs(["exported from 'deprecated-react-native-prop-types'."]);

LogBox.ignoreLogs([
  'ViewPropTypes will be removed',
  'ColorPropType will be removed',
]);

/* =============================================================================
<SettingsScreen />
============================================================================= */
const SettingsScreen = ({ navigation, user }) => {
  const { quality, destination, saveSettings } = useContext(SettingsContext);
  const [_quality, setQuality] = useState(quality);
  const [_destination, setDestination] = useState(destination);

  const userName = user?.name;

  const displayQuality = async value => {
    value = Number(value.toFixed(2));
    setQuality(value);
  };

  return (
    <Container>
      <Content contentContainerStyle={styles.content}>
        <View horizontal spacebetween>
          <Text style={styles.bold_username} bold>
            User: <Text style={styles.bold_username}>{userName}</Text>{' '}
          </Text>
        </View>

        <View horizontal spacebetween>
          <Text style={styles.bold_username}>Image quality: </Text>
          <Text style={styles.bold_username}>{_quality}</Text>
        </View>

        <View horizontal spacebetween>
          <Text style={styles.bold_username}>LOW </Text>

          <Slider
            step={0.05}
            value={_quality}
            minimumValue={0.5}
            maximumValue={1.0}
            style={styles.slider}
            minimumTrackTintColor="#000000"
            maximumTrackTintColor="#000000"
            onValueChange={displayQuality}
          />

          <Text style={styles.bold_username}>HIGH </Text>
        </View>

        <View horizontal spacebetween>
          <Text style={styles.bold_username}>Image destination: </Text>
          <Picker
            selectedValue={_destination}
            style={styles.picker}
            onValueChange={setDestination}>
            <Picker.Item label="ABC" value="ABC" />
            <Picker.Item label="Tallertronic" value="tallertronic" />
          </Picker>
        </View>

        <View style={styles.btnContainer}>
          <Button
            flex
            onPress={() => {
              saveSettings(_quality, _destination);
              navigation.goBack();
            }}
            title="Save settings"
          />
        </View>
      </Content>
    </Container>
  );
};

/* Style
============================================================================= */
const styles = StyleSheet.create({
  content: {
    padding: 15,
    rowGap: 15,
  },
  bold_username: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 20,
    color: '#000',
  },
  slider: {
    width: 200,
    height: 40,
  },
  picker: {
    height: 20,
    width: 140,
  },
  dialogInput: {
    color: '#292c2e',
  },
  btnContainer: {
    marginVertical: 10,
  },
});

const mapStateToProps = state => ({
  user: selectUser(state),
});

/* Export
============================================================================= */
export default connect(mapStateToProps)(SettingsScreen);
