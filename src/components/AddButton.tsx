import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface AddButtonProps {
  onPress: () => void;
  title: string;
  buttonBackgroundColor?: string;
  buttonTextColor?: string;
  activeOpacity?: number;
}

const AddButton: React.FC<AddButtonProps> = ({ onPress, title, buttonBackgroundColor, buttonTextColor, activeOpacity }) => {
  const [isPressed, setIsPressed] = useState(false);

  const onPressInHandler = () => {
    setIsPressed(true);
  };

  const onPressOutHandler = () => {
    setIsPressed(false);
  };

  return (
    <View style={styles.buttonWrapper}>
      <TouchableOpacity
        style={[styles.button, { backgroundColor: buttonBackgroundColor }, isPressed && styles.buttonPressed]}
        onPressIn={onPressInHandler}
        onPressOut={onPressOutHandler}
        onPress={onPress}
        activeOpacity={activeOpacity}
      >
        <Text style={[styles.buttonPlus, { color: buttonTextColor }, isPressed && { color: buttonBackgroundColor }]}>+</Text>
        <Text style={[styles.buttonText, { color: buttonTextColor }, isPressed && { color: buttonBackgroundColor }]}>{title}</Text>
        <View style={{ paddingRight: 25 }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonWrapper: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 50,
    marginBottom: 25,
    width: '65%',
  },
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
    alignItems: 'center',
    borderRadius: 50,
    width: '100%',
  },
  buttonPlus: {
    paddingLeft: 10,
    fontSize: 28,
    fontWeight: 'bold',
  },
  buttonText: {
    justifyContent: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonPressed: {
    backgroundColor: 'grey',
  },
});

export default AddButton;
