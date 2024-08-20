import { FlatList, Image, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import Empty from '../../components/Empty'
import { getUserPosts, signOut } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import {useGlobalContext} from '../../context/GlobalProvider'
import { icons } from '../../constants'
import InfoBox from '../../components/InfoBox'
import { router } from 'expo-router'

//npm install react-native-animatable expo-av

const Profile = () => {
  const {user, setUser, setIsLoggedIn}=useGlobalContext()
  const { data: postsData } = useAppwrite(() => getUserPosts(user.$id));
 
  const logout =async () => {
    await signOut();
    setUser(null);
    setIsLoggedIn(false)
    router.replace('/sign-in');
  }
  
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={postsData}
        keyExtractor={(item) => item.$id}
        renderItem={({item})=>(
          <VideoCard video={item}/>
        )}
        ListHeaderComponent={()=> (
          <View className="w-full justify-center items-center mt-6 mb-12 px-4">
            <TouchableOpacity className="w-full items-end mb-18" onPress={logout}>
              <Image source={icons.logout} resizeMode='contain' className="w-6 h-6"/>
            </TouchableOpacity>
            <View className="w-16 h-16 border border-secondary rounded-lg justify-center items-center">
              <Image source={{ uri: user?.avatar}} resizeMode='cover'
              className="w-[90%] h-[90%] rounded-lg"/>
            </View>
            <InfoBox title={user?.name}
             containerStyles='mt-5'
             titleStyles="text-lg"
            />
            <View className="mt-5 flex-row">
            <InfoBox title={postsData.length || 0}
             subtitle="Posts"
             containerStyles='mr-10'
             titleStyles="text-xl"
            />
            <InfoBox title="1.2k"
             subtitle="Followers"
             titleStyles="text-xl"
            />

            </View>
          </View>
        )}
        ListEmptyComponent={() => (
          <Empty title="No videos Found" subtitle="No video found for this search query"/>
        )}
      />
    </SafeAreaView>
  )
}

export default Profile
