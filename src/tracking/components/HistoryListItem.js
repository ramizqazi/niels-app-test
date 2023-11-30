import React from 'react';
import { StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';

import { Text, View } from '../../common';

/* =============================================================================
<HistoryListItem />
============================================================================= */
const HistoryListItem = ({ data }) => {
  if (data.error) {
    return (
      <View style={styles.historyBoxError}>
        <View horizontal spacebetween flex>
          <Text style={styles.loggedUser}>{data.rp_number}</Text>

          <Text>
            <Entypo name="time-slot" size={15} /> {data.tracking_time}
          </Text>
        </View>

        <Text>
          <Text>Time: </Text>
          {data.startTime}
        </Text>
        <Text>
          <Text>User: </Text>
          {data.user}
        </Text>
        <Text style={styles.italic}>{data.notes}</Text>
        <Text>Error: {data.text}</Text>
      </View>
    );
  }
  return (
    <View style={styles.historyBox}>
      <View horizontal spacebetween flex>
        <Text style={styles.loggedUser}>{data.rp_number}</Text>

        <Text>
          <Entypo name="time-slot" size={15} /> {data.tracking_time}
        </Text>
      </View>

      <Text>
        <Text>Time: </Text>
        {data.startTime}
      </Text>
      <Text>
        <Text>User: </Text>
        {data.user}
      </Text>
      <Text style={styles.italic}>{data.notes}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  historyBox: {
    backgroundColor: '#e0f0d3',
    margin: 20,
    marginVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d6d7da',
    padding: 10,
  },
  historyBoxError: {
    backgroundColor: '#f5d49f',
    margin: 20,
    marginVertical: 10,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#d6d7da',
    padding: 10,
  },
  historyRow: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loggedUser: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  italic: {
    fontStyle: 'italic',
    marginVertical: 5,
  },
});

/* Export
============================================================================= */
export default HistoryListItem;
