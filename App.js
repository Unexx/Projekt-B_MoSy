import { StatusBar } from 'expo-status-bar';
import React, {useState} from "react";
import { StyleSheet, Text, View, Dimensions } from 'react-native';
// import { enableLatestRenderer } from 'react-native-maps';
import MapView from 'react-native-maps';
import { Marker } from 'react-native-maps';

// enableLatestRenderer();

export default function App() {
  const [region, setRegion] = useState({
    latitude: 51.5079145,
    longitude: -0.0899163,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
  });

  const stadtpark = {
    latitude: 53.59641,
    longitude: 10.01886,
    latitudeDelta: 0.05,
    longitudeDelta: 0.01,
  }

  function CustomMarker() {
    return (
      <View style={styles.marker}>
        <Text style={styles.color}>Stadtpark</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        style={styles.map}
        initialRegion={stadtpark}
        //onRegionChangeComplete runs when the user stops dragging MapView
        onRegionChangeComplete={(region) => setRegion(region)}   
      >
        <Marker coordinate={stadtpark}>
          <CustomMarker />
        </Marker>
        <Marker coordinate={{
          latitude: 53.6,
          longitude: 10.03,
        }}
          image={require("./assets/jojo.png")} />
      {/*Display user's current region:*/}
      
      
      </MapView>
    {/* <StatusBar style="auto" /> */}
    <Text style={styles.text}>Current latitude: {region.latitude}</Text>
    <Text style={styles.text}>Current longitude: {region.longitude}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
  },
  marker: {
    paddingVertical: 10,
    paddingHorizontal: 30,
    backgroundColor: "yellow",
    borderColor: "blue",
    borderWidth: 2,
    borderRadius: 50,
    elevation: 100,
  },
  text: {
    flex: 1,
    color: "#000",   
  },
});