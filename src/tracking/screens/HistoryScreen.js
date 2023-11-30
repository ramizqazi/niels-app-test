import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet } from 'react-native';

import { Container, Text, View } from '../../common';
import { getStoredHistory } from '../../util/functions';
import HistoryListItem from '../components/HistoryListItem';

/* =============================================================================
<HistoryScreen />
============================================================================= */
const HistoryScreen = () => {
  const [trackings, setTrackings] = useState([]);

  useEffect(() => {
    (async () => {
      let history = await getStoredHistory();

      if (!history.error) {
        setTrackings(history);
      }
    })();
  }, []);

  return (
    <Container>
      <FlatList
        data={trackings}
        renderItem={({ item }) => <HistoryListItem data={item} />}
        contentContainerStyle={styles.content}
        ListEmptyComponent={
          <View center flex>
            <Text center>No Tracking Found</Text>
          </View>
        }
        keyExtractor={item => item.id}
      />
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
  },
});

/* Export
============================================================================= */
export default HistoryScreen;
