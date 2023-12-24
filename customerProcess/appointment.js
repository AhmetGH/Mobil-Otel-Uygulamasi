import React from 'react';
import { View, Text } from 'react-native';

const Appointment = ({ route }) => {
  const { userId } = route.params;

  // userId'yi kullanarak gerekli işlemleri gerçekleştirin

  return (
    <View>
      <Text>Appointment Page - User ID: {userId}</Text>
      {/* ... Diğer içerikler ... */}
    </View>
  );
};

export default Appointment;