import {Account, Client, ID} from 'react-native-appwrite';

export const config ={
    endpoint:'http://cloud.appwrite.io/v1',
    platform:'com.esham.aora',
    projectId:'66c1f614000bf0b915ba',
    databaseId:'66c1f80b003d5b4c6b79',
    userCollectionId:'66c1f843002097940b6c',
    videoCollectionId: '66c1f891002bd1fd7693',
    storageId:'66c1faf1000416dbdeea'
}
// npx expo install react-native-appwrite react-native-url-polyfill


const client= new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform)

const account = new Account(client);
export const createUser =() =>{
    account.create(ID.unique(), 'me@example.com',
'password', 'Jane Doe')
.then(function (response){
    console.log(response);
}, function (error){
    console.log(error);
})
}