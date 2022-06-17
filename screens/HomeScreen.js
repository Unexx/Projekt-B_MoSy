import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { auth, db } from '../firebase/firebase-config'
import { signOut } from 'firebase/auth'
import { collection, getDoc, setDoc, addDoc, doc } from "firebase/firestore"; 



const HomeScreen = () => {
  const navigation = useNavigation()

  const handleSignOut = () => {
    // const auth = getAuth();
    signOut(auth)
    .then(() => {
      navigation.replace("Login")
    })
    .catch(error => alert(error.message))
  }

  const addDataToCollection = async () => {
    // Add a new document in collection "cities"
    await setDoc(doc(db, "users", ), {
      name: "San Francisco ",
      state: "CA",
      country: "USA"
    });
  }

  return (
    <View style={styles.container}>
      <Text>Email: {auth.currentUser?.email}</Text>
      <TouchableOpacity
        onPress={handleSignOut}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Sign out</Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={addDataToCollection}
        style={styles.button}
      >
        <Text style={styles.buttonText}>Add data to collection</Text>
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
    backgroundColor: '#0782F9',
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
})