import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const PageHeader = ({ navigation }: { navigation: any }) => {

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={() => navigation.goBack()}>
        <Text style={styles.buttonText}>←</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.headerButton}>
        <Text style={styles.buttonText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginVertical: 15,
    height: 50,
    backgroundColor: 'white',
  },
  headerButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  buttonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
});

export default PageHeader;
