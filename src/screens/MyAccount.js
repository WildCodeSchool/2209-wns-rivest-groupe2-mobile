import React from "react";
import { View, Navigator} from 'react-native';
import { Avatar, Card, Text, IconButton} from 'react-native-paper';
import Ionicons from "@expo/vector-icons/Ionicons";


function MyAccount() {
    const handleAvatarChange = () => undefined
    const settingPage =  () => undefined

    return <View className="flex-1  bg-white" >

    <View className=" mt-6 ml-3 mb-6 flex-row items-center" >
    <Avatar.Image size={100} label="XD" className='mr-7 bg-c-block' color='white' onPress={handleAvatarChange} />

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
    <Card.Title title="User Info" subtitle="User description" titleVariant="titleMedium" right={(props) => <IconButton {...props} icon="pencil" size={20} onPress={() => {}} />} className='flex-row items-center' />

    <Card.Content>
        <Text variant="bodyMedium">User name:</Text>
        <Text variant="bodyMedium">User email:</Text>
        <Text variant="bodyMedium">User phone number:</Text>
        <Text variant="bodyMedium">Interests:</Text>
    </Card.Content>
    </Card>

    </View>
    
    
    
}
export default  MyAccount;