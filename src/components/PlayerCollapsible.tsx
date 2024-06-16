import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Button, Share, Alert } from 'react-native';
import { SessionPlayerDetail } from '../db/models';
import { addDollarSign } from '../utils/helpers';
import Toggle from "react-native-toggle-element";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { updatePlayerCashIn, updatePlayerCashOut } from '../db/sessionPlayer';
import { useDatabase } from '../context/DatabaseContext';

interface PlayerCollapsibleProps {
  sessionPlayerDetail: SessionPlayerDetail;
  playerName: string;
  fetchSessionDetails: () => void;
}

const PlayerCollapsible: React.FC<PlayerCollapsibleProps> = ({ sessionPlayerDetail, playerName, fetchSessionDetails }) => {
  const db = useDatabase();
  
  const [inOutToggleValue, setInOutToggleValueValue] = useState(false);
  const [plusMinusToggleValue, setPlusMinusToggleValueValue] = useState(true);
  const [selectedValue, setSelectedValue] = useState<number | null>(null);
  const [customValue, setCustomValue] = useState('');
  const [isCollapsibleOpen, setIsCollapsibleOpen] = useState(false);

  const values = [5, 10, 25, 50];

  const handleUpdatePlayerCashInOut = async () => {
    let cashValue = selectedValue || parseFloat(customValue) || 0;
    if (cashValue === 0) {
      console.log('No cash value selected')
      return;
    }
    if (!plusMinusToggleValue) {
      console.log('Minus selected');
      cashValue = -cashValue;
    }
    if (!inOutToggleValue) {
      console.log('Cash In selected');
      cashValue = cashValue + sessionPlayerDetail.cash_in;
      await updatePlayerCashIn(db, sessionPlayerDetail.session_id, sessionPlayerDetail.player_id, cashValue);
    }
    else {
      console.log('Cash Out selected');
      await updatePlayerCashOut(db, sessionPlayerDetail.session_id, sessionPlayerDetail.player_id, cashValue);
    }
    fetchSessionDetails();
  }

  const onShare = async () => {
    try {
      let ETmessage = '';
      if (sessionPlayerDetail.cash_out - sessionPlayerDetail.cash_in < 0) {
        ETmessage = 'ET owen.wong0627@gmail.com ' + addDollarSign(sessionPlayerDetail.cash_out - sessionPlayerDetail.cash_in) + ', thanks!';
      }
      else if (sessionPlayerDetail.cash_out - sessionPlayerDetail.cash_in > 0) {
        ETmessage = 'I will ET you ' + addDollarSign(sessionPlayerDetail.cash_out - sessionPlayerDetail.cash_in);
      }
        
      const result = await Share.share({
        message: ETmessage,
        title: 'Ledger Settlement',
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log(`Content shared using ${result.activityType}.`);
        } else {
          console.log('Content shared successfully without specific activity type.');
        }
      } else if (result.action === Share.dismissedAction) {
        console.log('Share dismissed by the user.');
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  return (
    <View style={styles.playerItem}>
      <TouchableOpacity onPress={() => setIsCollapsibleOpen(!isCollapsibleOpen)}>
        <View style={styles.playerDetail}>
          <Text style={styles.playerName}>{playerName}</Text>
          <View style={styles.cashInOut}>
            <View style={styles.cashFlow}>
              <MaterialIcons name="arrow-downward" size={24} color="green" />
              <Text style={styles.cashIn}>In: {addDollarSign(sessionPlayerDetail.cash_in)}</Text>
            </View>
            <View style={styles.cashFlow}>
              <MaterialIcons name="arrow-upward" size={24} color="red" />
              <Text style={styles.cashOut}>Out: {addDollarSign(sessionPlayerDetail.cash_out)}</Text>
            </View>
          </View>
          <Text style={styles.profit}>Profit: {addDollarSign(sessionPlayerDetail.cash_out - sessionPlayerDetail.cash_in)}</Text>
        </View>
      </TouchableOpacity>
      {isCollapsibleOpen && (
      <View style={styles.playerCollapsible}>
        <View style={styles.toggles}>
          <Toggle
            value={inOutToggleValue}
            onPress={(newState) => setInOutToggleValueValue(newState || false)}
            leftTitle="In"
            rightTitle="Out"
            trackBar={{
              width: 60,
              height: 30,
              radius: 30,
            }}
            thumbButton={{
              width: 30,
              height: 30,
              radius: 30,
            }}
            containerStyle={{
              marginBottom: 4,
            }}
          />
          <Toggle
            value={plusMinusToggleValue}
            onPress={(newState) => setPlusMinusToggleValueValue(newState || false)}
            leftComponent={
              <MaterialIcons name="horizontal-rule" size={24} color="darkgray" />
            }
            rightComponent={
              <MaterialIcons name="add" size={24} color="darkgray" />
            }
            trackBar={{
              width: 60,
              height: 30,
              radius: 30,
            }}
            thumbButton={{
              width: 30,
              height: 30,
              radius: 30,
            }}
          />
          <View style={{marginTop: 5}}>
            <Button onPress={onShare} title="Share" />
          </View>
        </View>
        <View style={styles.container}>
          {values.map((value) => (
            <TouchableOpacity
              key={value}
              style={[styles.button, selectedValue === value && styles.selectedButton]}
              onPress={() => {
                setSelectedValue(value);
                setCustomValue('');
              }}
            >
              <Text style={styles.buttonText}>{value}</Text>
            </TouchableOpacity>
          ))}
          <TextInput
            style={styles.input}
            onChangeText={setCustomValue}
            value={customValue}
            keyboardType="numeric"
            placeholder="Custom"
            onFocus={() => setSelectedValue(null)}
          />
        </View>
        <TouchableOpacity style={styles.updateButton} onPress={handleUpdatePlayerCashInOut}>
          <Text>Update</Text>
        </TouchableOpacity>
      </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  playerItem: {
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 15,
    marginVertical: 5,
    borderRadius: 10,
    elevation: 2,
    flexDirection: 'column',
  },
  playerDetail: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  playerName: {
    fontWeight: 'bold',
    flex: 1,
  },
  cashInOut: {
    flexDirection: 'column',
    alignItems: 'center',
    marginLeft: -15,
  },
  cashFlow: {
    marginTop: -5,
    flexDirection: 'row',
    alignItems: 'center',
  },
  cashIn: {
    color: 'green',
  },
  cashOut: {
    color: 'red',
  },
  profit: {
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'right',
    flex: 1,
  },
  toggles: {
    flexDirection: 'column',
    alignItems: 'center',
  },
  playerCollapsible: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 5,
  },

  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  button: {
    padding: 5,
    backgroundColor: '#ddd',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  selectedButton: {
    backgroundColor: '#ccc',
    borderColor: '#888',
  },
  buttonText: {
    fontSize: 13,
  },
  input: {
    width: 60,
    height: 30,
    borderWidth: 1,
    borderColor: '#ccc',
    textAlign: 'center',
    padding: 5,
  },

  updateButton: {
    padding: 10,
    backgroundColor: 'lightblue',
    borderRadius: 5,
    marginLeft: 5,
  },
});

export default PlayerCollapsible;
