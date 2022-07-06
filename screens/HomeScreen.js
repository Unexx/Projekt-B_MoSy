import { useNavigation } from '@react-navigation/core'
import { auth, db } from '../firebase/firebase-config'
import { signOut } from 'firebase/auth'
import { collection, setDoc, doc, query, onSnapshot } from "firebase/firestore"; 

import React, {useState, useRef } from "react";
import { Text,Alert,  TextInput, View, StyleSheet, TouchableOpacity } from 'react-native';
import MapView, {PROVIDER_GOOGLE, Marker, Callout } from 'react-native-maps';

let userMarkerLatitude = 0
let userMarkerLongitude = 0
let markers = [];

const hawRegion = {  
  name: 'Hochschule für angewandte Wissenschaft Hamburg',
  description: 'Hier studieren wir! :)',
  color: 'hotpink',
  latitude: 53.56903,
  longitude: 10.0328,
  latitudeDelta: 0.01,
  longitudeDelta: 0.01,
}
const user = auth.currentUser;
const HomeScreen = () => {
  const mapRef = useRef(null);
  const navigation = useNavigation()

  // get current Region
  const [region, setRegion] = useState({
    latitude: 51.5079145,
    longitude: -0.0899163,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,

  });

  // SignOut Stuff; NICHT löschen
  const handleSignOut = () => {
    // const auth = getAuth();
    signOut(auth)
    .then(() => {
      navigation.replace("Login")
    })
    .catch(error => alert(error.message))

  }

  const addDataToCollection = async () => {
    await setDoc(doc(db, "users", user.email.toString()), {
      uid: user.uid,
      user_email: user.email,
      markers: {
        latitude: 4,
        longitude: 4
      }
    });
  }

  // MARKER zur DB hinzufügen
  const addMarkerToDB = async() => {
    let userID = auth.currentUser.uid.toString()
    await setDoc(doc(db, "markers", userID ), {
      markers: {
        name: eventNameInput,
        description: eventDescInput,
        latitude: userMarkerLatitude,
        longitude: userMarkerLongitude,
      }
    });
    const alerta_title = "Marker has been Set"
    const alerta_msg = "Latitude: " + userMarkerLatitude.toString() + "\nLongitude" + userMarkerLongitude.toString()
    Alert.alert(alerta_title,alerta_msg);
    setRegion(userMarker);
  }

  // MARKER von DB ablesen
  const q = query(collection(db,"markers"));

  
  const readMarkerFromDB = onSnapshot(q, (QuerySnapshot) => {
    const db_markers = [];  
    //setMarkers([]);
    QuerySnapshot.forEach( (doc) => {
      db_markers.push(doc.data().markers);
      //addMarker(doc.data().markers);
    } );    
    //setMarkers(db_markers);
    markers = db_markers;
    //readMarkerFromDB();
  })

  const addMarker = markerInput => {
    // check if inputRegion is already in the array or not
    if ( !markers.includes(markerInput) )
    {
      setMarkers( markers => [...markers, markerInput] );
    }
    else
    {
      //console.log("The Region ",inputRegion," is already taken!");
    }
  }

  const updateUserMarker = newInputRegion => {
    setUserMarker([newInputRegion])
    userMarkerLatitude = newInputRegion.latitude
    userMarkerLongitude = newInputRegion.longitude
  }

  //const [markers, setMarkers] = useState([]);

  const [userMarker, setUserMarker] = useState([hawRegion]);

  const createMarker = (inputRegion, title, desc) => {
    /*newRegion = {
      name: title,
      description: desc,
      color: 'hotpink',
      latitude: inputRegion.latitude,
      longitude: inputRegion.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };*/
    onChangeLatInput(inputRegion.latitude)
    onChangeLongInput(inputRegion.longitude)
    //addMarkerToDB();
    //addMarker(newRegion);
  }

  const randomMarker = () =>{

    randRegion = {
      name: 'Random Region',
      color: 'green',
      latitude: Math.random(),
      longitude: Math.random(),
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    return(randRegion);
  }

  const [eventNameInput, onChangeEventInput] = useState("");
  const [eventDescInput, onChangeDescInput] = useState("");
  const [eventLongInput, onChangeLongInput] = useState("");
  const [eventLatInput, onChangeLatInput] = useState("");

  return (
    <View style={styles.map_container}>
      <MapView
        provider = {PROVIDER_GOOGLE}
        ref= {mapRef}
        style={styles.map}
        initialRegion={hawRegion}
        showsUserLocation={true}
        followsUserLocation={true}
        onPress = {(e) => updateUserMarker(e.nativeEvent.coordinate)}
        //onRegionChangeComplete runs when the user stops dragging MapView
        onRegionChangeComplete={(region) => setRegion(region)}

      >
      {/* DB Markers */}
      {
        markers.map((val, index) => 
          {
            //console.log(index, val.name, val);
            return (
            <Marker key={index} coordinate={val} pinColor={val.color} tracksViewChanges={true} /*image={require("./assets/haw logo.png")}*/>
              <Callout>
                <Text key={Math.random().toString()}> {val.name} </Text>
                <Text key={Math.random().toString()}> {val.description} </Text>
              </Callout>
          </Marker>); 
          }
        )
      }

       
      {/* User Marker */}
      {
        userMarker.map((val, index) => 
          {
            //console.log(index, val.name, val);
            return (
            <Marker key={index} coordinate={val} pinColor='blue' draggable={false} tracksViewChanges={true}>
              <Callout >
                  <Text key={Math.random().toString()}> {eventNameInput} </Text>
                  <Text key={Math.random().toString()}> {eventDescInput} </Text>
              </Callout>
          </Marker>); 
          }
        )
      }

      </MapView>
      {/* MARKER ERSTELLEN */}
      <TextInput style={styles.input} placeholder='EVENT NAME' value={eventNameInput} onChangeText={onChangeEventInput}></TextInput>
      <TextInput style={styles.input} placeholder='DESCRIPTION' value={eventDescInput} onChangeText={onChangeDescInput}></TextInput>
      <TouchableOpacity
        onPress={addMarkerToDB}
        style={styles.button}
      >
        <Text style={styles.buttonText}>CREATE MARKER</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>
      
    </View>
  )
}

export default HomeScreen

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
   button: {
    backgroundColor: '#2B2D4295',
    width: '60%',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 40,
  },
  buttonText: {
    color: 'white',
    fontWeight: '700',
    fontSize: 16,
  },
  bubble: {
    backgroundColor: '#fff',
    borderRadius: 6,
    borderColor: '#ccc',
    borderWidth: 0.5,
    padding: 15,
    width: 1500,
    height:1500,
  },
  map_container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
  },  
  input: {
    backgroundColor: '#fff',
    height: 40,
    margin: 1,
    borderWidth: 1,
    padding: 5,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
})