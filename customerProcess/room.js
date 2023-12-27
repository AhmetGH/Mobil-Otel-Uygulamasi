// room.js
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet,FlatList } from 'react-native';
import { collection, addDoc, getDocs, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../firebase';

const Room = ({ route }) => {
  const { userId, selectedRoom } = route.params;
  const [availableDays, setAvailableDays] = useState([]);
  const [singleRoomData, setSingleRoomData] = useState([]);

  useEffect(() => {
    const getSingleRoomData = async () => {
      // "singleRoom" koleksiyonundaki verileri getir
      const singleRoomRef = collection(db, 'singleRoom');
      const querySnapshot = await getDocs(singleRoomRef);
      const singleRoomList = querySnapshot.docs.map(doc => doc.data());
      setSingleRoomData(singleRoomList);
    };

    getSingleRoomData();

  }, [selectedRoom.roomType]);

  const handleDaySelection = (room, day) => {
    // Seçilen gün ve oda bilgilerini console'a yazdır
    console.log('Selected Day:', day);
    console.log('Selected Room:', room);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>{selectedRoom.roomType}</Text>
      {/* Diğer içerik... */}
      <View style={styles.roomListContainer}>
        <Text style={styles.roomListHeader}>Single Room List</Text>
        {singleRoomData.map((room, index) => (
          <View key={index} style={styles.roomListItem}>
            <Text>Room No: {room.roomNo}</Text>
            <Text>Cost: {room.cost}</Text>
            <Text>Days:</Text>
            <FlatList
              horizontal
              data={['Pt', 'S', 'Ç', 'Pşb', 'C', 'Ct', 'P']}
              keyExtractor={(day) => day}
              renderItem={({ item: day }) => (
                <TouchableOpacity
                  style={[
                    styles.dayButton,
                    { backgroundColor: room.days && room.days.includes(day) ? 'red' : 'white' },
                  ]}
                  disabled={!room.days || !room.days.includes(day)}
                  onPress={() => handleDaySelection(room, day)}
                >
                  <Text style={{ color: room.days && room.days.includes(day) ? 'white' : 'black' }}>
                    {day}
                  </Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ))}
      </View>
    </View>
  );
}

// Diğer stil ve fonksiyonlar...

const styles = StyleSheet.create({
  // Diğer stiller...
  roomListContainer: {
    marginTop: 20,
  },
  roomListHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roomListItem: {
    marginBottom: 20,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    margin: 5,
    borderWidth: 1,
  },
});


export default Room;
