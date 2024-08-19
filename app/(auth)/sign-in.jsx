import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import FormField from '../../components/FormField'
import CustomButton from '../../components/CustomButton'
import { Link, router } from 'expo-router'
import { signIn } from '../../lib/appwrite'
import { useGlobalContext } from '../../context/GlobalProvider'
const SignIn = () => {
  const [form, setFrom]= useState({
    email:'',
    password:''
  })
  const [isSubmitting, setIsSubmitting]= useState(false);

  const {setUser, setIsLoggedIn}= useGlobalContext();
  const onSubmit=async () => {

    if(!form.email || !form.password){
      Alert.alert('Error', 'Please fill all the fields')
    }

    setIsSubmitting(true);

    try {
     const result=await signIn(form.email, form.password);
      // set it to global state...
      setUser(result);
      setIsLoggedIn(true);
      Alert.alert("Success", "User signed in successfully");
      router.replace('/home');
    } catch (error) {
      Alert.alert('Error', error.message);
    }finally{
      setIsSubmitting(false);
    }

  }
  return (
    <SafeAreaView className="bg-primary h-full">
      <ScrollView>
        <View className="w-full justify-center min-h-[85vh] px-4 my-6">
          <Image source={images.logo} resizeMode='contain' className="w-[115px] h-[35px]"/>
          <Text className="text-2xl text-white text-semibold mt-10 font-psemibold">
            Log in to Aora
          </Text>
          <FormField
          title="Email"
          value={form.email}
          handleChangeText={(e) => setFrom({...form, email:e})}
          otherStyles="mt-7"
          keyboardType="email-address"
          />
          <FormField
          title="Password"
          value={form.password}
          handleChangeText={(e) => setFrom({...form, password:e})}
          otherStyles="mt-7"
          />
          <CustomButton
            title="Sign In"
            handlePress={onSubmit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100 font-pregular"> Don't have account?</Text>
            <Link href={"/sign-up"} className='text-lg font-psemibold text-secondary'>Sign Up</Link>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default SignIn

const styles = StyleSheet.create({})