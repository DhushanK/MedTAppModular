import React, { useEffect, useState } from "react";
import { View, Text, ActivityIndicator, FlatList, Button, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import HomeScreen from "./screens/HomeScreen";
import MapScreen from "./screens/MapScreen";
import ObjectPlacementScreen from "./screens/ObjectPlacement";
import { BleManager } from "react-native-ble-plx";
import { check, request, PERMISSIONS, RESULTS } from "react-native-permissions";
import { Platform } from "react-native";

// Initialize BLE Manager
const bleManager = new BleManager();

const Stack = createStackNavigator();

export default function App() {
  const [devices, setDevices] = useState([]);
  const [scanning, setScanning] = useState(false);

  useEffect(() => {
    requestPermissions();
    return () => {
      bleManager.destroy();
    };
  }, []);

  // Request Bluetooth permissions (needed for iOS)
  const requestPermissions = async () => {
    if (Platform.OS === "ios") {
      const status = await request(PERMISSIONS.IOS.BLUETOOTH_SCAN);
      if (status !== RESULTS.GRANTED) {
        alert("Bluetooth requires permission to scan for devices.");
      }
    } else if (Platform.OS === "android") {
      const status = await request(PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION);
      if (status !== RESULTS.GRANTED) {
        alert("Bluetooth requires location permissions.");
      }
    }
  };

  // Start scanning for Bluetooth devices
  const startScan = () => {
    setScanning(true);
    setDevices([]);

    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.error("Scan Error:", error);
        setScanning(false);
        return;
      }
      if (device && device.name) {
        setDevices((prevDevices) => {
          const exists = prevDevices.some((d) => d.id === device.id);
          return exists ? prevDevices : [...prevDevices, device];
        });
      }
    });

    // Stop scanning after 10 seconds
    setTimeout(() => {
      bleManager.stopDeviceScan();
      setScanning(false);
    }, 10000);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="Map" component={MapScreen} />
        <Stack.Screen name="ObjectPlacement" component={ObjectPlacementScreen} />
        <Stack.Screen name="Bluetooth" options={{ title: "Bluetooth Scanner" }}>
          {() => (
            <View style={styles.container}>
              <Text style={styles.title}>Bluetooth Scanner</Text>
              <Button title={scanning ? "Scanning..." : "Start Scan"} onPress={startScan} disabled={scanning} />
              {scanning && <ActivityIndicator size="large" color="#007AFF" />}
              <FlatList
                data={devices}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.deviceItem}>
                    <Text style={styles.deviceName}>{item.name || "Unknown Device"}</Text>
                    <Text style={styles.deviceId}>ID: {item.id}</Text>
                  </View>
                )}
              />
            </View>
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// Styles
const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f4f4f4" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  deviceItem: { padding: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  deviceName: { fontSize: 18, fontWeight: "600" },
  deviceId: { fontSize: 14, color: "#555" },
});