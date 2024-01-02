//appointment.js

import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';
import Swiper from 'react-native-swiper';

const Appointment = ({ route }) => {
  const userId = route.params?.userId;
  const navigation = useNavigation();

  const rooms = [
    {
      roomType: 'Tek kişilik oda',
      images: [
        require('../assets/singleRoom1.jpg'),
        require('../assets/singleRoom2.jpg'),
        require('../assets/singleRoom3.jpg'),
      ],
    },
    {
      roomType: 'Çift kişilik oda',
      images: [
        require('../assets/doubleroom1.jpg'),
        require('../assets/doubleroom2.jpg'),
        require('../assets/doubleroom3.jpg'),
      ],
    },
    {
      roomType: 'Çocuklu çift kişilik oda',
      images: [
        require('../assets/doubleroomwithchild1.jpg'),
        require('../assets/doubleroomwithchild2.jpg'),
        require('../assets/doubleroomwithchild3.jpg'),
      ],
    },
  ];

  const roomTypes = [
    'Tek Kişilik Oda',
    'Çift Kişilik Oda',
    'Çocuklu Çift Kişilik Oda',
  ];

  const handleRoomSelection = async (index) => {
    const selectedRoomType = roomTypes[index];
    console.log('selectedRoom', selectedRoomType);
    // Kullanıcı ID'si ve seçilen oda bilgileri ile Room sayfasına yönlendirme
    navigation.navigate('Room', { userId, selectedRoomType });
    
  };

  useEffect(() => {
    if (userId) {
      // userId'yi kullanarak gerekli işlemleri gerçekleştirin
      console.log('User ID:', userId);
    }
  }, [userId]);

  return (
    <View style={styles.container}>
      {rooms.map((room, roomIndex) => (
        <View key={roomIndex} style={styles.roomContainer}>
          <Text style={styles.roomType}>{room.roomType}</Text>
          <Swiper style={styles.swiper} showsButtons={false} loop={false}>
            {room.images.map((image, imageIndex) => (
              <TouchableOpacity
                key={imageIndex}
                style={styles.square}
                onPress={() => handleRoomSelection(roomIndex, imageIndex)}
              >
                <Image source={image} style={styles.image} />
              </TouchableOpacity>
            ))}
          </Swiper>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical:265,
  },
  roomContainer: {
    marginBottom: 0,
  },
  roomType: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 0,
    marginTop:5,
  },
  swiper: {
    height: 350,
  },
  square: {
    aspectRatio: 1,
    borderRadius: 10,
    overflow: 'hidden',
    margin: 5,
    width: 500, // Genişlik
    height: 400, // Yükseklik
  },
  image: {
    width: '100%',
    height: '50%',
    resizeMode: 'cover',

  },
});

export default Appointment;