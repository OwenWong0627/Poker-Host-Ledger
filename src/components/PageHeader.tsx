import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { resetGrid, toggleKeyboard } from '../redux/actions';

const PageHeader = ({ navigation }: { navigation: any }) => {

  const dispatch = useDispatch();

  const handleReturn = () => {
    dispatch(resetGrid());
    dispatch(toggleKeyboard(false, '?', 'suits'));
    navigation.goBack();
  }

  return (
    <View style={styles.header}>
      <TouchableOpacity style={styles.headerButton} onPress={handleReturn}>
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
