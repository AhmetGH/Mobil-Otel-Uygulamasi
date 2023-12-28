// RoomResult.js
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const turkishToDbDayMap = {
  'Pazartesi': 'Monday',
  'Salı': 'Tuesday',
  'Çarşamba': 'Wednesday',
  'Perşembe': 'Thursday',
  'Cuma': 'Friday',
  'Cumartesi': 'Saturday',
  'Pazar': 'Sunday',
};

const turkishRoomTypes = {
  'singleRoom': 'Tek Kişilik Oda',
  'doubleRoom': 'Çift Kişilik Oda',
  'doubleRoomWithChild': 'Çocuklu Çift Kişilik Oda',
};

const RoomResult = ({ route }) => {
  const { userId } = route.params;
  const [reservationData, setReservationData] = useState([]);

  useEffect(() => {
    const fetchReservationData = async () => {
      try {
        // Tüm odaların koleksiyonlarını gezip, userId ile eşleşen rezervasyonları bul
        const rooms = ['singleRoom', 'doubleRoom', 'doubleRoomWithChild'];
        const reservations = [];

        for (const roomType of rooms) {
          const roomRef = collection(db, roomType);
          const querySnapshot = await getDocs(roomRef);

          querySnapshot.forEach(doc => {
            const roomData = doc.data();

            // Eğer userId ile eşleşen bir rezervasyon varsa, bu bilgileri reservations listesine ekle
            if (roomData[turkishToDbDayMap['Pazartesi']] === userId || roomData[turkishToDbDayMap['Salı']] === userId ||
                roomData[turkishToDbDayMap['Çarşamba']] === userId || roomData[turkishToDbDayMap['Perşembe']] === userId ||
                roomData[turkishToDbDayMap['Cuma']] === userId || roomData[turkishToDbDayMap['Cumartesi']] === userId ||
                roomData[turkishToDbDayMap['Pazar']] === userId) {
              reservations.push({
                roomType: turkishRoomTypes[roomType],
                roomNo: roomData.roomNo,
                days: Object.keys(turkishToDbDayMap).filter(day => roomData[turkishToDbDayMap[day]] === userId),
              });
            }
          });
        }

        setReservationData(reservations);
      } catch (error) {
        console.error('Error fetching reservation data:', error);
      }
    };

    fetchReservationData();
  }, [userId]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Rezervasyon Bilgileriniz</Text>
      <FlatList
        data={reservationData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemContainer}>
            <View style={styles.frame}>
              <Text style={styles.itemText}>Oda Tipi: {item.roomType}</Text>
              <Text style={styles.itemText}>Oda Numarası: {item.roomNo}</Text>
              <Text style={styles.itemText}>Günler: {item.days.join(', ')}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  itemContainer: {
    marginBottom: 16,
  },
  frame: {
    borderColor: 'black',
    borderWidth: 2,
    borderRadius: 8,
    padding: 16,
  },
  itemText: {
    fontSize: 16,
    marginBottom: 8,
  },
});

export default RoomResult;
