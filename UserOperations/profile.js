import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Button, Alert,TouchableOpacity, } from 'react-native';
import { doc, getDoc, updateDoc,deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useNavigation } from '@react-navigation/native';


const Profile = ({ route }) => {
  const [userData, setUserData] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [age, setAge] = useState('');
  const [tcNo, setTcNo] = useState('');
  const [gender, setGender] = useState('');
  const [authority, setAuthority] = useState('');
  const [telNo, setTelNo] = useState('');
  const [password, setPassword] = useState('');
  const [adminAuthorityId,setAdminAuthorityId]=useState('');
  const navigation = useNavigation();

  const userId = route?.params?.userId;
  const adminId=route?.params?.adminId;

  const deleteUser = async () => {
    Alert.alert(
      'Kullanıcıyı Sil',
      'Bu kullanıcıyı silmek istediğinize emin misiniz?',
      [
        {
          text: 'İptal',
          style: 'cancel',
        },
        {
          text: 'Sil',
          onPress: async () => {
            try {
              const userRef = doc(db, 'users', userId);
              await deleteDoc(userRef);
              console.log('Kullanıcı başarıyla silindi.');
              navigation.navigate('Admin Paneli', { adminId});
              // Silme başarılı olduğunda kullanıcıyı yönlendirebilir veya başka bir işlem yapabilirsiniz.
            } catch (error) {
              console.error('Kullanıcı silinirken hata oluştu:', error);
              // Silme işlemi sırasında bir hata olursa uyarı gösterebilir veya başka bir işlem yapabilirsiniz.
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  useEffect(() => {
    if (!userId) {
      console.error('Kullanıcı Kimliği sağlanmadı.');
      return;
    }

    const userRef = doc(db, 'users', userId);

    const getUserData = async () => {
      try {
        const userDocSnapshot = await getDoc(userRef);
        if (userDocSnapshot.exists()) {
          setUserData(userDocSnapshot.data());
          setFirstName(userDocSnapshot.data().firstName);
          setLastName(userDocSnapshot.data().lastName);
          setEmail(userDocSnapshot.data().email);
          setAge(userDocSnapshot.data().age);
          setTcNo(userDocSnapshot.data().tcNo);
          setGender(userDocSnapshot.data().gender);
          setAuthority(userDocSnapshot.data().authority);
          setTelNo(userDocSnapshot.data().telNo);
          // Password'u çekmek için yeni satır
          setPassword(userDocSnapshot.data().password);
        } else {
          console.log('Kullanıcı belgesi bulunamadı.');
        }
      } catch (error) {
        console.error('Kullanıcı belgesi alınırken hata oluştu:', error);
      }
    };

    getUserData();
  }, [userId]);

  useEffect(() => {
    if (adminId) {
      // Belirli kullanıcının document referansını oluştur
      const adminRef = doc(db, 'users', adminId);
      // Belirli kullanıcının document'ini al
      const getAdminData = async () => {
        try {
          const adminDocSnapshot = await getDoc(adminRef);
  
          if (adminDocSnapshot.exists()) {
            const adminAuthorityValue = adminDocSnapshot.data().authority;
            setAdminAuthorityId(adminDocSnapshot.data().authority);
          } else {
            console.log('Admin belgesi bulunamadı.');
          }
        } catch (error) {
          console.error('Admin belgesi alınırken hata oluştu:', error);
        }
      };
  
      getAdminData();
    }
  }, [adminId]);

  const updateUserProfile = async () => {
    const userRef = doc(db, 'users', userId);

    if (password === '') {
      Alert.alert('Uyarı', 'Şifre boş bırakılamaz.');
      return;
    }

    try {
      await updateDoc(userRef, {
        firstName,
        lastName,
        email,
        age,
        tcNo,
        gender,
        authority,
        telNo,
        // Password'u güncellemek için yeni satır
        password,
      });
      console.log('Kullanıcı profili güncellendi.');
      // Güncelleme başarılı olduğunda uyarı göster
      Alert.alert('Başarılı', 'Kullanıcı profili başarıyla güncellendi.');
    } catch (error) {
      console.error('Kullanıcı profili güncellenirken hata oluştu:', error);
      // Hata durumunda uyarı göster
      Alert.alert('Hata', 'Kullanıcı profili güncellenirken hata oluştu.');
    }
  };

  if (!userData) {
    return (
      <View style={styles.container}>
        <Text>Yükleniyor...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Kullanıcı Profili</Text>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Ad:</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Ad"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Soyad:</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Soyad"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email:</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Yaş:</Text>
        <TextInput
          style={styles.input}
          value={age}
          onChangeText={setAge}
          editable={false}
          placeholder="Yaş"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>TC Kimlik No:</Text>
        <TextInput
          style={styles.input}
          value={tcNo}
          onChangeText={setTcNo}
          editable={false}
          placeholder="TC Kimlik No"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Cinsiyet:</Text>
        <TextInput
          style={styles.input}
          value={gender}
          onChangeText={setGender}
          editable={false}
          placeholder="Cinsiyet"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Telefon Numarası:</Text>
        <TextInput
          style={styles.input}
          value={telNo}
          onChangeText={setTelNo}
          placeholder="Telefon Numarası"
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Şifre:</Text>
          <TextInput
            style={styles.input}
            value={password}
            onChangeText={setPassword}
            placeholder="Şifre"
            secureTextEntry
          />
      </View>
      <View style={styles.inputContainer}>
       {adminAuthorityId === 'admin' && (
        <>
        <Text style={styles.label}>Kimlik:</Text>
        <TextInput
            style={styles.input}
            value={authority}
            onChangeText={setAuthority}
            placeholder="Kimlik"
        />
        </>
        )}
    </View>
    <View style={styles.buttonContainer}>
    {adminAuthorityId !== 'admin' && (
      <Button title="Güncelle" onPress={updateUserProfile} />
      )}
      {adminAuthorityId === 'admin' && (
        <TouchableOpacity onPress={deleteUser} style={styles.deleteButton}>
          <Text style={styles.deleteButtonText}>Hesabı Sil</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);
      }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {
    marginRight: 10,
    width: 60, // Adjust the width as needed
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    flex: 1, // Take the remaining width
  },
  buttonContainer: {
    flexDirection: 'row',
    marginTop: 20, // İhtiyaca göre ayarlayabilirsiniz
  },
  deleteButton: {
    marginLeft: 10, // İhtiyaca göre ayarlayabilirsiniz
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default Profile;
