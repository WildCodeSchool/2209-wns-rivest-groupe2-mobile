import  * as React from "react";
import { View } from 'react-native';
import { Formik } from 'formik';
import { TextInput, Button } from 'react-native-paper';


function EditProfile({updatedUser, user}) {

return  <View className="flex-1 bg-white">
  
  <Formik
className='bg-white'
initialValues={user}
onSubmit={(values) => {
  updatedUser(values);
  console.log(values)
}}

>
{({ handleChange, handleBlur, handleSubmit, values }) => (
 <View className="w-80 ml-auto mr-auto mt-10">
    <TextInput 
    label='First Name'
    className="mb-5"
    mode="outlined"
      onChangeText={handleChange('firstName')}
      onBlur={handleBlur('firstName')}
      value={values.firstName}
    />
    <TextInput
    label='Last Name'
    className="mb-5"
    mode="outlined"
      onChangeText={handleChange('lastName')}
      onBlur={handleBlur('lastName')}
      value={values.lastName}
    />
    <TextInput
    label='Email'
    className="mb-5"
    mode="outlined"
      onChangeText={handleChange('email')}
      onBlur={handleBlur('email')}
      value={values.email}
    />
    <TextInput
    label='Phone Number'
    className="mb-5"
    mode="outlined"
      onChangeText={handleChange('phoneNumber')}
      onBlur={handleBlur('phoneNumber')}
      value={values.phoneNumber}
    />
    <Button className='w-36 m-auto' mode='elevated' onPress={handleSubmit}  textColor="#45C7C9">Submit</Button>
    </View>
)}
</Formik>
</View>
    
    
}
export default EditProfile;