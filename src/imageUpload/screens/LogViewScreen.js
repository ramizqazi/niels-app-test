import React, { useEffect, useState } from 'react';
import { StyleSheet } from 'react-native';
import { Container, Content, Text } from '../../common';
import AsyncStorage from '@react-native-async-storage/async-storage';

/* =============================================================================
<LogViewScreen />
============================================================================= */
const LogViewScreen = () => {
  const [logtext, setLogText] = useState('NO LOGS');

  useEffect(() => {
    getLogs();
  }, []);

  const getLogs = async () => {
    const value = await AsyncStorage.getItem('THEM_LOGZ');
    if (value !== null) {
      setLogText(value);
    }
  };

  return (
    <Container>
      <Content contentContainerStyle={styles.content}>
        <Text>{logtext}</Text>
      </Content>
    </Container>
  );
};

const styles = StyleSheet.create({
  content: {
    paddingVertical: 25,
  },
});

/* Export
============================================================================= */
export default LogViewScreen;
