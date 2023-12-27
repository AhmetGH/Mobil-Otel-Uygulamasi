import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { collection, doc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';

const RoomResult = ({ route }) => {
  const userId = route.params?.userId;
  const selectedRoomIds = route.params?.availableRooms;
  const selectedRoomType = route.params?.selectedRoom;
  const [selectedRooms, setSelectedRooms] = useState([]);

  useEffect(() => {
    const getSelectedRooms = async () => {
      const selectedRoomsData = [];

      for (const roomId of selectedRoomIds) {
        const roomDocRef = doc(db, selectedRoomType, roomId);
        const roomDocSnapshot = await getDoc(roomDocRef);

        if (roomDocSnapshot.exists()) {
          const roomData = roomDocSnapshot.data();
          selectedRoomsData.push(roomData);
        }
      }

      setSelectedRooms(selectedRoomsData);
    };

    if (userId && selectedRoomIds) {
      getSelectedRooms();
    }
  }, [userId, selectedRoomIds, selectedRoomType]);

  const getAvailableRooms = async () => {
    const roomType = turkishToEnglishRoomMap[route.params.selectedRoomType]; // selectedRoomType'ı kullanın
    const availableRoomsRef = collection(db, roomType);
    const availableRoomsQuery = query(availableRoomsRef, ...selectedDays.map(day => where(day, '==', '')));
  
    const querySnapshot = await getDocs(availableRoomsQuery);
    const availableRoomsData = querySnapshot.docs.map(doc => doc.id);
  
    console.log('Uygun Odaların Verisi:', availableRoomsData); // Hata ayıklama log'u
  
    setAvailableRooms(availableRoomsData);
  };
  const handleReservation = async () => {
    // Burada rezervasyon yapma işlemlerini gerçekleştirin
    const userDocRef = doc(db, 'users', userId);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const tcNo = userDocSnapshot.data().tcNo;

      for (const roomId of selectedRoomIds) {
        const roomDocRef = doc(db, selectedRoomType, roomId);
        const roomDocSnapshot = await getDoc(roomDocRef);

        if (roomDocSnapshot.exists()) {
          const roomData = roomDocSnapshot.data();
          const updatedDays = {};

          // Türkçe gün adlarından İngilizce gün adlarına çevirme
          const turkishToEnglishDayMap = {
            'Pazartesi': 'Monday',
            'Salı': 'Tuesday',
            'Çarşamba': 'Wednesday',
            'Perşembe': 'Thursday',
            'Cuma': 'Friday',
            'Cumartesi': 'Saturday',
            'Pazar': 'Sunday',
          };

          for (const turkishDay in roomData) {
            const englishDay = turkishToEnglishDayMap[turkishDay];
            updatedDays[englishDay] = selectedRooms[0][englishDay] === tcNo ? tcNo : roomData[turkishDay];
          }

          await updateDoc(roomDocRef, updatedDays);
        }
      }

      console.log('Rezervasyon başarıyla yapıldı!');
    } else {
      console.error('Kullanıcı bilgisi bulunamadı.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Seçilen Odalar</Text>
      {selectedRooms.map((room, index) => (
        <TouchableOpacity key={index} style={styles.roomContainer} onPress={() => console.log('Seçildi')}>
          <Text style={styles.roomType}>{selectedRoomType}</Text>
          <Text style={styles.roomInfo}>Oda No: {room.roomNo}</Text>
          <Text style={styles.roomInfo}>Ücret: {room.Cost}</Text>
        </TouchableOpacity>
      ))}
      <TouchableOpacity style={styles.reserveButton} onPress={handleReservation}>
        <Text style={styles.reserveButtonText}>Rezervasyon Yap</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  roomContainer: {
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    margin: 10,
    backgroundColor: 'lightgrey',
  },
  roomType: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  roomInfo: {
    fontSize: 14,
    marginBottom: 3,
  },
  reserveButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  reserveButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});

export default RoomResult;
