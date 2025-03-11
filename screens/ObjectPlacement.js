import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

const objects = [
  { id: '1', type: 'Car', emoji: '🚗' },
  { id: '2', type: 'Truck', emoji: '🚚' },
  { id: '3', type: 'Person', emoji: '🧍' },
  { id: '4', type: 'Dog', emoji: '🐶' },
  { id: '5', type: 'Cat', emoji: '🐱' },
];

export default function ObjectPlacementScreen() {
  const [placedObjects, setPlacedObjects] = useState([]);

  const placeObject = (object) => {
    setPlacedObjects([...placedObjects, object]);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🎯 Object Placement</Text>

      <FlatList
        data={objects}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.button} onPress={() => placeObject(item)}>
            <Text style={styles.buttonText}>{item.emoji} Place {item.type}</Text>
          </TouchableOpacity>
        )}
      />

      <View style={styles.placedObjects}>
        <Text style={styles.subtitle}>Placed Objects:</Text>
        {placedObjects.map((obj, index) => (
          <Text key={index} style={styles.placedObject}>{obj.emoji} {obj.type}</Text>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#EAF6FF', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', marginBottom: 20 },
  button: { backgroundColor: '#4c669f', padding: 15, borderRadius: 10, margin: 10, width: 250, alignItems: 'center' },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  placedObjects: { marginTop: 20 },
  subtitle: { fontSize: 20, fontWeight: 'bold' },
  placedObject: { fontSize: 18, marginTop: 5 },
});