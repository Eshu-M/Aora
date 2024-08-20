import { FlatList, Image, RefreshControl, StyleSheet, Text, View } from 'react-native'
import React, {useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import {images} from '../../constants'
import SearchInput from '../../components/SearchInput'
import Trending from '../../components/Trending'
import Empty from '../../components/Empty'
import { getAllPosts, getLatestPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useGlobalContext } from '../../context/GlobalProvider'

//npm install react-native-animatable expo-av

const Home = () => {
  const {user, setUser, setIsLoggedIn}=useGlobalContext();
  const { data: postsData, refetch } = useAppwrite(getAllPosts);
  const { data: latestPosts } = useAppwrite(getLatestPosts);
  const [refreshing, setRefreshing] = useState(false);
  
  const onRefresh = async () => {
    setRefreshing(true);
    // recall videos to see if there are any new videos
    await refetch();
    setRefreshing(false);
  }
console.log("user >>", user);
console.log("posts >>", postsData?.creator?.username);
  return (
    <SafeAreaView className="bg-primary h-full">
      <FlatList 
        data={postsData}
        keyExtractor={(item) => item.$id}
        renderItem={({item})=>(
          <VideoCard video={item}/>
        )} 
        ListHeaderComponent={()=> (
          <View className="my-6 px-4 space-y-6">
            <View className="justify-between items-start flex-row mb-6">
              <View>
                <Text className="font-pmedium text-sm text-gray-100">Welcome Back,</Text>
                <Text className="text-2xl font-psemibold text-white">{user?.name}</Text>
              </View>
              <View className="mt-1.5">
                <Image source={images.logoSmall} className="w-9 h-10" resizeMode='contain'/>
              </View>
            </View>
            <SearchInput/>
            <View className="w-full flex-1 pt-5 pb-8">
              <Text className="text-gray-100 text-lg font-pregular mb-3">Trending videos</Text>
            </View>
            <Trending posts={latestPosts}/>
          </View>
        )}
        ListEmptyComponent={() => (
          <Empty title="No videos Found" subtitle="Be the first one to upload a video"/>
        )}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
      />
    </SafeAreaView>
  )
}

export default Home
