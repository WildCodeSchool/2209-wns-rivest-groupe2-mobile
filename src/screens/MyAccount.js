import React from "react";
import { View,  Modal, StyleSheet, TouchableOpacity} from 'react-native';
import { Avatar, Card, Text, IconButton} from 'react-native-paper';
import Ionicons from "@expo/vector-icons/Ionicons";
import EditProfile from "./EditProfile";
import AvatarImagePicker from "../components/ImagePicker";

function MyAccount() {

    const [modalOpen, setModalOpen] = React.useState(false);

    const [user, setUser]= React.useState({
        firstName: 'New',
        lastName:'NewLast',
        email:'qkfjkbgz@gmail.com',
        phoneNumber:'003442974824'
    }) 

    const updatedUser = (values)=>{
        setUser({
            firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        phoneNumber: values.phoneNumber
        })
    }
    
   
    return <View className="flex-1  bg-white" >

    <View className=" mt-6 ml-3 mb-6 flex-row items-center" >

    <AvatarImagePicker />
    
    <View>

    <View className=" flex-row">
    <Ionicons name="medal-outline" size={20}/><Text> User type</Text>
    </View>
    <View className=" flex-row">
    <Ionicons name="star-outline" size={20}/><Text> User rating</Text>
    </View>

    </View>

    </View>

    <Card type='elevated' className='w-96 self-center bg-white '>
    <Card.Title title="User Info" subtitle="User description" titleVariant="titleMedium" right={(props) => <IconButton {...props} icon="pencil" size={20} onPress={() => setModalOpen(true)}  />} className='flex-row items-center' />
    <Card.Content>
        <Text variant="bodyMedium"><Text className='font-bold'>User first name:</Text> {user.firstName}</Text>
        <Text variant="bodyMedium"><Text className='font-bold'>User last name:</Text> {user.lastName}</Text>
        <Text variant="bodyMedium"><Text className='font-bold'>User email:</Text> {user.email}</Text>
        <Text variant="bodyMedium"><Text className='font-bold'>User phone number:</Text> {user.phoneNumber}</Text>
        <Text variant="bodyMedium"><Text className='font-bold'>Interests:</Text> #keywords #keywords #keywords #keywords #keywords #keywords</Text>
    </Card.Content>
    </Card>

    <Modal visible={modalOpen} animationType='slide'>
        <View style={styles.modalContent}>
          <Ionicons 
            name='close'
            size={24} 
            style={{...styles.modalToggle, ...styles.modalClose}} 
            onPress={() => setModalOpen(false)} 
          />
          <EditProfile user={user} updatedUser={updatedUser}/>
        </View>
      </Modal>

    </View>
      
}
export default MyAccount;

const styles = StyleSheet.create({
    modalToggle: {
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 10,
      borderWidth: 1,
      borderColor: '#f2f2f2',
      padding: 10,
      borderRadius: 10,
      alignSelf: 'center',
    },
    modalClose: {
      marginTop: 20,
      marginBottom: 0,
    },
    modalContent: {
      flex: 1,
    }
  });