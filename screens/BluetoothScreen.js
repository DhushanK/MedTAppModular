import React, { useEffect, useState } from "react";
import { View, Text, FlatList, Button, PermissionsAndroid, Platform, Alert } from "react-native";
import { BleManager } from "react-native-ble-plx";

const manager = new BleManager();

export default function BluetoothScanner() {
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    requestPermissions();
  }, []);

  // Request permissions (Android only)
  async function requestPermissions() {
    if (Platform.OS === "android") {
      const granted = await PermissionsAndroid.requestMultiple([
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
        PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      ]);
      if (granted["android.permission.BLUETOOTH_SCAN"] !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert("Permission Required", "Bluetooth scanning requires permission.");
      }
    }
  }

  // Scan for Bluetooth devices
  const scanDevices = () => {
    setDevices([]); // Clear previous scan results
    manager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan Error:", error);
        return;
      }
      if (device && device.name) {
        setDevices((prevDevices) => {
          const deviceExists = prevDevices.some((d) => d.id === device.id);
          return deviceExists ? prevDevices : [...prevDevices, device];
        });
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      manager.stopDeviceScan();
    }, 10000);
  };

  return (
    <View style={{ flex: 1, padding: 20 }}>
      <Button title="Scan for Devices" onPress={scanDevices} />
      <FlatList
        data={devices}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <Text>{item.name} ({item.id})</Text>}
      />
    </View>
  );
}