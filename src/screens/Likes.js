/* eslint-disable no-undef */
/* eslint-disable @typescript-eslint/no-var-requires */
import * as React from "react";
import { View, StyleSheet, ScrollView } from 'react-native';
import {Picker} from '@react-native-picker/picker';
import { Card, Text, Button } from 'react-native-paper';

function Home() {
    const [selectedCity, setSelectedCity] = React.useState();

  
    return (
    <ScrollView className='bg-white flex-1'>
        <View style={styles.picker}>
            <Picker mode='dropdown' placeholder="Please choose a city"
                selectedValue={selectedCity}
                onValueChange={(itemValue) =>
                    {setSelectedCity(itemValue)
                } 
             }>
                <Picker.Item label="Default" value="default" />
                <Picker.Item label="Best Rating" value="bestRating" />
                <Picker.Item label="Most recent" value="mostRecent" />
            </Picker>

        </View>


    <Card className='bg-white w-80 ml-auto mr-auto mb-10'>
    <Card.Title title="POI name" subtitle="POI description" />
    <Card.Cover style={{width:300, marginRight:'auto', marginLeft:'auto'}} source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Actions>
      <Button>Edit</Button>
    </Card.Actions>
    </Card>

    <Card className='bg-white w-80 ml-auto mr-auto mb-10'>
    <Card.Title title="POI name" subtitle="POI description" />
    <Card.Cover style={{width:300, marginRight:'auto', marginLeft:'auto'}} source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Actions>
      <Button>Edit</Button>
    </Card.Actions>
    </Card>

    <Card className='bg-white w-80 ml-auto mr-auto mb-10'>
    <Card.Title title="POI name" subtitle="POI description" />
    <Card.Cover style={{width:300, marginRight:'auto', marginLeft:'auto'}} source={{ uri: 'https://picsum.photos/700' }} />
    <Card.Actions>
      <Button>Edit</Button>
    </Card.Actions>
    </Card>

    
    </ScrollView>
    )
}


  
const styles = StyleSheet.create({
picker:{
        width:200, 
        marginTop:10,
        marginLeft:'auto', 
        marginRight:15, 
        marginBottom:30,
        borderRadius: 30, 
        borderStyle:"solid", 
        borderWidth:1, 
        backgroundColor: 'white', 
        borderColor:'white', 
        shadowColor: "#000",
        shadowOffset: {
	        width: 0,
	        height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,},
        
    })

export default  Home;