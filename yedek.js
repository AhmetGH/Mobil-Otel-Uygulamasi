import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View,TextInput,TouchableOpacity} from 'react-native';
import { useState } from 'react';
import {collection,doc,setDoc,addDoc,updateDoc,deleteDoc} from "firebase/firestore";
import { db } from './firebase';



export default function App() {
  const[username,setName]=useState('');
  const[email,setEmail]=useState('');


  const deleteDocument = async () => {
    const userId = 2;
    const docRef = doc(db, 'users', 'LA', userId.toString());

    try {
      await deleteDoc(docRef);
      console.log(`Document with ID ${userId} deleted successfully`);
    } catch (error) {
      console.error('Error deleting document:', error);
    }
  };
  /*function create(){
    setDoc(doc(db,"users","LA"),{
      username:username,
      email:email,
  
    }).then(()=>{
      console.log('data submitted');
  
    }).catch((error)=>{
      console.log(error);
    });
  }*/
  function create(){
    addDoc(collection(db,"users"),{
      username:username,
      email:email,
  
    }).then(()=>{
      console.log('data submitted');
  
    }).catch((error)=>{
      console.log(error);
    });
  }
  function update(){
    updateDoc(doc(db,"users",'LA'),{
      username:username,
      email:email,
  
    }).then(()=>{
      console.log('data submitted');
  
    }).catch((error)=>{
      console.log(error);
    });
  }

  

  return (
    <View style={styles.container}>
      <Text>Firebase crud</Text>
      <TextInput value={username} onChangeText={(username)=>{setName(username)}} placeholder="Username" style={styles.textBoxes}></TextInput>
      <TextInput value={email} onChangeText={(email)=>{setEmail(email)}} placeholder="Email" style={styles.textBoxes}></TextInput>
      <TouchableOpacity style={styles.button} onPress={deleteDocument}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'darkgrey',
    alignItems: 'center',
    justifyContent: 'center',
  },
  textBoxes:{
    width:'90%',
    fontSize:18,
    padding:12,
    borderColor:'gray',
    borderWidth:0.2,
    borderRadius:10
  },button: {
    width: 200,
    height: 50,
    backgroundColor: 'lightblue',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    marginTop:10
  },
  buttonText: {
    fontSize: 18,
    color: 'black',
  },
});
