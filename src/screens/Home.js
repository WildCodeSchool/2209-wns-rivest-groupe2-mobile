/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import { React, useState} from "react";
import { View, Image, StyleSheet } from 'react-native';
import {Picker} from '@react-native-picker/picker';





function Home() {
  const [selectedCity, setSelectedCity] = useState(require('../../assets/paris-map.png'));
  const [image, setImage] =useState()
    return  <View style={styles.container}>
            <Picker style={styles.picker} mode='dropdown' placeholder="Please choose a city"
  selectedValue={selectedCity}
  onValueChange={(itemValue) =>
   {setSelectedCity(itemValue)
   if(itemValue ==='bordeaux'){
    setImage(require('../../assets/bodeaux-map.png'))
   }
   if(itemValue ==='paris'){
    setImage(require('../../assets/paris-map.png'))
   }
} 
  }>
  <Picker.Item label="Paris" value="paris" />
  <Picker.Item label="Bordeaux" value="bordeaux" />
</Picker>
        <View style={styles.imageContainer}>
     
     <Image source={image} style={styles.image}>
 
 
     </Image>
    
   </View>
    </View>
    
    
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
     
    },
    imageContainer:{
      flex: 1,
      alignItems:'center'

    },
    image: {
      flex: 1,
      resizeMode:"contain"
    },
    picker: {
      color: 'white',
      backgroundColor: '#45C7C9',
      opacity:0.9
    },
  });
  
export default  Home;