import {useState, React} from "react";
import { StyleSheet} from 'react-native';
import {Picker} from '@react-native-picker/picker';


function CityPicker() {

const [selectedCity, setSelectedCity] = useState();

return  <Picker style={styles.picker} mode='dropdown' placeholder="Please choose a city"
  selectedValue={selectedCity}
  onValueChange={(itemValue) =>
   {setSelectedCity(itemValue)
   
} 
  }>
  <Picker.Item label="Paris" value="paris" />
  <Picker.Item label="Bordeaux" value="bordeaux" />
</Picker>
 
}

const styles = StyleSheet.create({
   
    picker: {
      color: 'white',
      backgroundColor: '#45C7C9',
      opacity:0.9
      
    },
  });
  
export default  CityPicker;