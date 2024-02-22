import React from 'react';
import { StyleSheet, Text, SafeAreaView } from 'react-native';

const SessionsScreen = ({ navigation }: { navigation: any }) => {
  return (
    <SafeAreaView style={styles.container}>
      <Text>HI</Text>
      <Text>HI</Text>
      
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  grid: {
    alignItems: 'center',
  },
});

export default SessionsScreen;
