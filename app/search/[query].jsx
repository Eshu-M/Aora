import { FlatList, StyleSheet, Text, View } from 'react-native'
import React, {useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import SearchInput from '../../components/SearchInput'
import Empty from '../../components/Empty'
import { searchPosts } from '../../lib/appwrite'
import useAppwrite from '../../lib/useAppwrite'
import VideoCard from '../../components/VideoCard'
import { useLocalSearchParams } from 'expo-router'

//npm install react-native-animatable expo-av

const Search = () => {
  const { query } =useLocalSearchParams();
  const { data: postsData, refetch } = useAppwrite(() => searchPosts(query));
  
  useEffect(() => {
     refetch()
  },[query])

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
                <Text className="font-pmedium text-sm text-gray-100">Search results</Text>
                <Text className="text-2xl font-psemibold text-white">{query}</Text>
              </View>
            </View>
            <View className="mt-6 mb-8">
              <SearchInput initialQuery={query}/>
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

export default Search

const styles = StyleSheet.create({})