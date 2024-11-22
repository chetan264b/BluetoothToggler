import React, {useEffect} from 'react';
import {
  SafeAreaView,
  Text,
  TouchableOpacity,
  View,
  PermissionsAndroid,
  Platform,
  ToastAndroid,
} from 'react-native';
import BluetoothStateManager from 'react-native-bluetooth-state-manager';
import {styles} from './styles';
import { BLUETOOTH_STATES, CONSTANTS } from './src/utils/constants';

const App = () => {

  //Getting Bluetooth Permission from USER
  useEffect(() => {
    requestBluetoothPermission();
  });

  const requestBluetoothPermission = async () => {
    if (Platform.OS === 'android' && Platform.Version >= 31) {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
          {
            title: CONSTANTS.BLUETOOTH_PERMISSION,
            message: CONSTANTS.BLUETOOTH_PERMISSION_MSG,
            buttonNeutral: CONSTANTS.ASK_ME_LATER,
            buttonNegative: CONSTANTS.CANCEL,
            buttonPositive: CONSTANTS.OK,
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          ToastAndroid.show(
            CONSTANTS.BLUETOOTH_PERMISSION_GRANTED,
            ToastAndroid.SHORT,
          );
        } else {
          ToastAndroid.show(
            CONSTANTS.BLUETOOTH_PERMISSION_DENIED,
            ToastAndroid.SHORT,
          );
        }
      } catch (err) {
        console.warn(err);
      }
    }
  };

  const toogleBluetooth = async () => {
    await requestBluetoothPermission();
    try {
      const state = await BluetoothStateManager.getState();
      if (state !== BLUETOOTH_STATES.PoweredOn) {
        //Enabling the Bluetooth
        await BluetoothStateManager.enable();
        ToastAndroid.show(
          CONSTANTS.BLUETOOTH_ENABLED,
          ToastAndroid.SHORT,
        );
      } else {
        //Disabling the Bluetooth
        await BluetoothStateManager.disable();
        ToastAndroid.show(
          CONSTANTS.BLUETOOTH_DISABLED,
          ToastAndroid.SHORT,
        );
      }
    } catch (error) {
      console.error('Not able to toggle bluetooth', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.sectionTitle}>{CONSTANTS.BLUETOOTH_APP}</Text>
      <View style={styles.mainContainer}>
        <TouchableOpacity style={styles.button} onPress={toogleBluetooth}>
          <Text style={styles.sectionDescription}>{CONSTANTS.TOGGLE_BLUETOOTH}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default App;
