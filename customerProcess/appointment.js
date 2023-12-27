import { View, TouchableOpacity, Image, StyleSheet, Text, ScrollView } from 'react-native';
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

const Appointment = ({ route }) => {
  const userId = route.params?.userId;
  const navigation = useNavigation();

  const images = [
    require('../assets/singleRoom.jpg'),
    require('../assets/doubleroom.jpg'),
    require('../assets/doubleroomwithchild.jpg'),
  ];

  const roomTypes = [
    'Tek kişilik oda',
    'Çift kişilik oda',
    'Çocuklu çift kişilik oda',
  ];

  const handleRoomSelection = async (index) => {
    const selectedRoom = {
      roomType: roomTypes[index],
      image: images[index],
    };

    // Kullanıcı ID'si ve seçilen oda bilgileri ile Room sayfasına yönlendirme
    navigation.navigate('Room', { userId, selectedRoom });
    
  };

  useEffect(() => {
    if (userId) {
      // userId'yi kullanarak gerekli işlemleri gerçekleştirin
      console.log('User ID:', userId);
    }
  }, [userId]);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {images.map((image, index) => (
        <View key={index} style={styles.squareContainer}>
          <TouchableOpacity
            style={styles.square}
            onPress={() => handleRoomSelection(index)}
          >
            <Image source={image} style={styles.image} />
            <View style={styles.textContainer}>
              <Text style={styles.roomType}>{roomTypes[index]}</Text>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};


const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
  },
  squareContainer: {
    marginBottom: 10,
    width: '100%',
    alignItems: 'center',
  },
  square: {
    width: 200,
    height: 200,
    backgroundColor: 'lightblue',
    borderRadius: 10,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  textContainer: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
  },
  roomType: {
    color: 'white',
    fontSize: 14,
    textAlign: 'center',
  },
});

export default Appointment;