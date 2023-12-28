import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Button, Alert } from 'react-native';
import { collection, getDocs, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => {
    return {
              shouldPlaySound: false,
              shouldSetBadge:false,
              shouldShowAlert: true 
    };
  }
});

const turkishToEnglishRoomMap = {
  'Tek Kişilik Oda': 'singleRoom',
  'Çift Kişilik Oda': 'doubleRoom',
  'Çocuklu Çift Kişilik Oda': 'doubleRoomWithChild',
};
const turkishToDbDayMap = {
  'Pt': 'Monday',
  'S': 'Tuesday',
  'Ç': 'Wednesday',
  'Pşb': 'Thursday',
  'C': 'Friday',
  'Ct': 'Saturday',
  'P': 'Sunday',
};

const Room = ({ route }) => {
  const { userId, selectedRoomType } = route.params;
  const [availableDays, setAvailableDays] = useState([]);
  const [roomN, setRoomN] = useState('');
  const [roomData, setRoomData] = useState([]);
  const [selectedDays, setSelectedDays] = useState({});
  const navigation = useNavigation();


  const triggerNotificationHandler = () => {
    Notifications.scheduleNotificationAsync({
      content: {
        title: 'Rezervasyon İşleminiz Başarılı.',
        body: 'Rezervasyon işleminiz gerçekleşmiştir. Gerekli bilgiler e-posta adresinize gönderilmiştir. Bizi tercih ettiğiniz için teşekkür ederiz.'
      },
      trigger: {
        seconds: 3,
      },
    });
  };

  useEffect(() => {
    const getRoomData = async () => {
      const englishRoomType = turkishToEnglishRoomMap[selectedRoomType];
      const roomRef = collection(db, englishRoomType);
      const querySnapshot = await getDocs(roomRef);
      const roomList = querySnapshot.docs.map(doc => doc.data());
      setRoomData(roomList);
    };

    getRoomData();
  }, [selectedRoomType]);

  const handleDaySelection = (room, day) => {
    const dbDay = turkishToDbDayMap[day];
    const isDayEmpty = !room[dbDay] || room[dbDay] === '';

    setSelectedDays(prevState => ({
      ...prevState,
      [room.roomNo]: {
        ...prevState[room.roomNo],
        [dbDay]: !prevState[room.roomNo]?.[dbDay],
      },
    }));
  };

  const handleReservation = async () => {
    try {
      const roomRef = collection(db, turkishToEnglishRoomMap[selectedRoomType]);
      const querySnapshot = await getDocs(roomRef);

      // Her bir oda için ayrı ayrı güncelleme yap
      querySnapshot.docs.forEach(async doc => {
        const roomData = doc.data();
        const updatedRoomData = { ...roomData };
        const roomNo = roomData.roomNo;

        // Eğer bu odaya ait kayıtlar varsa temizle
        if (selectedDays[roomNo]) {
          Object.keys(selectedDays[roomNo]).forEach(day => {
            updatedRoomData[day] = '';
          });

          // Seçilen günleri veritabanına ekleyebilirsiniz.
          Object.keys(selectedDays[roomNo]).forEach(day => {
            if (selectedDays[roomNo][day]) {
              updatedRoomData[day] = userId;
            }
          });

          // Veritabanındaki belgeyi güncelle
          await updateDoc(doc.ref, updatedRoomData);
        }
      });

      // Seçilen günleri sıfırla
      setSelectedDays({});
      Alert.alert('Bildirim', 'Rezervasyon işleminiz gerçekleştirilmiştir.');
      triggerNotificationHandler();

      navigation.navigate('RoomResult', { userId});
      
    } catch (error) {
      console.error('Error updating reservation:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.roomListContainer}>
        <Text style={styles.roomListHeader}>Uygun {selectedRoomType}lar listesi</Text>
        {roomData.map((room, index) => (
          <View key={index} style={styles.roomListItem}>
            <Text>Oda numarası: {room.roomNo}</Text>
            <Text>Ücret: {room.Cost}</Text>
            <Text>Günler:</Text>
            <FlatList
              horizontal
              data={['Pt', 'S', 'Ç', 'Pşb', 'C', 'Ct', 'P']}
              keyExtractor={(day) => day}
              renderItem={({ item: day }) => {
                const dbDay = turkishToDbDayMap[day];
                const isDayEmpty = !room[dbDay] || room[dbDay] === '';

                return (
                  <TouchableOpacity
                    style={[
                      styles.dayButton,
                      {
                        backgroundColor: isDayEmpty
                          ? selectedDays[room.roomNo]?.[dbDay]
                            ? 'lightblue'
                            : 'white'
                          : 'red',
                        opacity: isDayEmpty ? 1 : 0.5,
                      },
                    ]}
                    disabled={!isDayEmpty}
                    onPress={() => handleDaySelection(room, day)}
                  >
                    <Text style={{ color: isDayEmpty ? (selectedDays[room.roomNo]?.[dbDay] ? 'white' : 'black') : 'white' }}>
                      {day}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />

          </View>
        ))}
        <Button
          title="Rezervasyon Yap"
          onPress={handleReservation}
          disabled={Object.keys(selectedDays).length === 0}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
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
