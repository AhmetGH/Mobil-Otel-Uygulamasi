import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';

const turkishToEnglishDayMap = {
  'Pazartesi': 'Monday',
  'Salı': 'Tuesday',
  'Çarşamba': 'Wednesday',
  'Perşembe': 'Thursday',
  'Cuma': 'Friday',
  'Cumartesi': 'Saturday',
  'Pazar': 'Sunday',
};

const turkishToEnglishRoomMap = {
  'Tek kişilik oda': 'singleRoom',
  'Çift kişilik oda': 'doubleroom',
  'Çocuklu çift kişilik oda': 'doubleroomwithchild',
}

const Room = ({ route }) => {
  const userId = route.params?.userId;
  const selectedRoom = route.params?.selectedRoom;
  const [selectedDays, setSelectedDays] = useState([]);
  const [availableRooms, setAvailableRooms] = useState([]);
  const navigation = useNavigation();

  const handleDaySelection = (day) => {
    const englishDay = turkishToEnglishDayMap[day];
    if (selectedDays.includes(englishDay)) {
      setSelectedDays(selectedDays.filter((selectedDay) => selectedDay !== englishDay));
    } else {
      setSelectedDays([...selectedDays, englishDay]);
    }
  };

  const getAvailableRooms = async () => {
    const roomType = turkishToEnglishRoomMap[route.params.selectedRoom.roomType];
    const availableRoomsRef = collection(db, roomType);
  
    // Seçilen günlerde hiçbir odanın dolu olup olmadığını kontrol etme
    const availableRoomsQuery = query(availableRoomsRef, 
      ...selectedDays.map(day => where(day, '==', ''))
    );
  
    const querySnapshot = await getDocs(availableRoomsQuery);
    const availableRoomsData = querySnapshot.docs
      .filter(doc => {
        const roomData = doc.data();
        return Object.values(roomData).some(value => value !== ''); // Odanın en az bir günü dolu olmayanları filtrele
      })
      .map(doc => doc.id);
  
    console.log('Uygun Odaların Verisi:', availableRoomsData);
  
    setAvailableRooms(availableRoomsData);
  };
  
  
  
  const handleSubmit = () => {
    console.log('Seçilen Günler:', selectedDays);
    console.log('Seçilen Oda:', { ...selectedRoom, roomType: turkishToEnglishRoomMap[selectedRoom.roomType] });
    console.log('Kullanıcı ID:', userId);
    console.log('Uygun Odalar:', availableRooms);
    // Gerçek işlemleri buraya ekleyin
    navigation.navigate('RoomResult', {
      userId: userId,
      selectedRoom:turkishToEnglishRoomMap[selectedRoom.roomType],
      availableRooms: availableRooms,
    });
  };

  useEffect(() => {
    if (selectedDays.length > 0) {
      getAvailableRooms();
    }
  }, [selectedDays]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.roomType}>{turkishToEnglishRoomMap[selectedRoom.roomType]}</Text>
      <View style={styles.imageContainer}>
        <Image source={selectedRoom.image} style={styles.image} />
      </View>
      <Text style={styles.sectionTitle}>Haftanın Günleri</Text>
      <View style={styles.daysContainer}>
        {['Pazartesi', 'Salı', 'Çarşamba', 'Perşembe', 'Cuma', 'Cumartesi', 'Pazar'].map((day, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.dayButton, selectedDays.includes(turkishToEnglishDayMap[day]) && styles.selectedDay]}
            onPress={() => handleDaySelection(day)}
          >
            <Text style={styles.dayButtonText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Seçimi Tamamla</Text>
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
  roomType: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  imageContainer: {
    width: '100%',
    height: 200,
    marginBottom: 20,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    marginBottom: 20,
  },
  dayButton: {
    padding: 10,
    margin: 5,
    borderWidth: 1,
    borderRadius: 5,
  },
  selectedDay: {
    backgroundColor: 'lightblue',
  },
  dayButtonText: {
    fontSize: 16,
  },
  submitButton: {
    backgroundColor: 'lightblue',
    padding: 10,
    borderRadius: 5,
  },
  submitButtonText: {
    fontSize: 16,
    color: 'white',
    textAlign: 'center',
  },
});

export default Room;
