import React from "react";
import { TouchableOpacity, View, StyleSheet} from 'react-native';
import { Avatar, Button, Modal, Portal} from 'react-native-paper';
import * as ImagePicker from 'expo-image-picker';
import Ionicons from "@expo/vector-icons/Ionicons";

export default function AvatarImagePicker(){
    const [modalOpen, setModalOpen] = React.useState(false);

    const [image, setImage] = React.useState(null);
    const launchImageLibrary = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

      const launchCamera = async () => {
        let result = await ImagePicker.launchCameraAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.All,
          allowsEditing: true,
          aspect: [4, 3],
          quality: 1,
        });
    
        console.log(result);
    
        if (!result.canceled) {
          setImage(result.assets[0].uri);
        }
      };

      
      return <View>
      <TouchableOpacity onPress={() => setModalOpen(true)} >
      <Avatar.Image size={100} className='mr-7 bg-c-block' source={{ uri: image }} />
      </TouchableOpacity>

      <Portal>
      <Modal visible={modalOpen} animationType='slide'>
        <View className="bg-white  w-3/5 m-auto rounded-2xl">
          <Ionicons 
            name='close'
            size={24} 
            style={{...styles.modalToggle, ...styles.modalClose}} 
            onPress={() => setModalOpen(false)} 
          />
          <Button textColor="#45C7C9" className='m-auto w-44 mb-5' mode='elevated' onPress={launchImageLibrary}>Choose from Library</Button>
          <Button textColor="#45C7C9" className='m-auto w-44 mb-5' mode='elevated' onPress={launchCamera}>Take a picture</Button>
        </View>
      </Modal>
      </Portal>
      </View>
}

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
      marginTop: 10,
     
      marginBottom: 20,
    },
    modalContent: {
      flex: 1,
    }
  });