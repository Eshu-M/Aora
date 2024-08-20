import {Account, Avatars, Client, Databases, ID, Query, Storage} from 'react-native-appwrite';

export const config ={
    endpoint:'https://cloud.appwrite.io/v1',
    platform:'com.esham.aora',
    projectId:'66c1f614000bf0b915ba',
    databaseId:'66c1f80b003d5b4c6b79',
    userCollectionId:'66c1f843002097940b6c',
    videoCollectionId: '66c1f891002bd1fd7693',
    storageId:'66c1faf1000416dbdeea'
}
// npx expo install react-native-appwrite react-native-url-polyfill

const {
 endpoint, platform, projectId, databaseId, userCollectionId, videoCollectionId, storageId
}= config;

const client= new Client();

client
    .setEndpoint(config.endpoint)
    .setProject(config.projectId)
    .setPlatform(config.platform);

const account = new Account(client);
const avatars= new Avatars(client);
const databases= new Databases(client);
const storage= new Storage(client);

export const createUser =async (email,password,username) =>{
    try{
       const newAccount=await account.create(
            ID.unique(),
            email,
            password,
            username
        )

        if(!newAccount) throw Error;
        const avatarUrl= avatars.getInitials(username);

        await signIn(email, password);

        const newUser= await databases.createDocument(
            config.databaseId,
            config.userCollectionId,
            ID.unique(),
            {
                accountId: newAccount.$id,
                email,
                username,
                avatar: avatarUrl
            }
        )
        return newUser
    }catch(error){
        console.log(error);
        throw new Error(error);
    }
}

export const signIn= async(email, password)=>{
    try {
        const user= await account.get();
        if(user != null) return user;
        else {
            const session = await account.createEmailPasswordSession(email,password)
            console.log(" Sign In >>",session);
            return session;
        }
    } catch (error) {
        console.log(error);
        throw new Error(error);
    }
}

export async function getAccount() {
    try {
      const currentAccount = await account.get();
  
      return currentAccount;
    } catch (error) {
      throw new Error(error);
    }
  }

export const getCurrentUser = async()=> {
    try {
        const currentAccount= await getAccount();
        if(!currentAccount) throw Error;

        const currentUser = await databases.listDocuments(
            config.databaseId,
            config.userCollectionId,
            [Query.equal('accountId', currentAccount.$id)]
        )

        if(!currentUser) throw Error;

        return currentUser.documents[0];
    } catch (error) {
        throw new Error(error);
    }
}

export const getAllPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId
            [Query.orderDesc('$createdAt')]
        );
        return posts.documents;

    } catch (error) {
        throw new Error(error);
    }
}
export const getLatestPosts = async () => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.orderDesc('$createdAt', Query.limit(7))]
        );
        return posts.documents;

    } catch (error) {
        throw new Error(error);
    }
}
export const searchPosts = async (query) => {
    try {
        const posts = await databases.listDocuments(
            config.databaseId,
            config.videoCollectionId,
            [Query.search('title', query)]
        );
        return posts.documents;

    } catch (error) {
        throw new Error(error);
    }
}
export async function getUserPosts(userId) {
    try {
      const posts = await databases.listDocuments(
        config.databaseId,
        config.videoCollectionId,
        [Query.equal('creator', userId)]
      );
  
      return posts.documents;
    } catch (error) {
      throw new Error(error);
    }
  }
  
export const signOut = async () => {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
        throw new Error(error);
    }
}

export async function uploadFile(file, type) {
    if (!file) return;
  
    const { mimeType, ...rest } = file;
    const asset = { type: mimeType, ...rest };
  
    try {
      const uploadedFile = await storage.createFile(
        config.storageId,
        ID.unique(),
        asset
      );
  
      const fileUrl = await getFilePreview(uploadedFile.$id, type);
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function getFilePreview(fileId, type) {
    let fileUrl;
  
    try {
      if (type === "video") {
        fileUrl = storage.getFileView(config.storageId, fileId);
      } else if (type === "image") {
        fileUrl = storage.getFilePreview(
          config.storageId,
          fileId,
          2000,
          2000,
          "top",
          100
        );
      } else {
        throw new Error("Invalid file type");
      }
  
      if (!fileUrl) throw Error;
  
      return fileUrl;
    } catch (error) {
      throw new Error(error);
    }
  }

  export async function createVideoPost(form) {
    try {
      const [thumbnailUrl, videoUrl] = await Promise.all([
        uploadFile(form.tumbnail, "image"),
        uploadFile(form.video, "video"),
      ]);
  
      const newPost = await databases.createDocument(
        config.databaseId,
        config.videoCollectionId,
        ID.unique(),
        {
          title: form.title,
          tumbnail: thumbnailUrl,
          video: videoUrl,
          prompt: form.prompt,
          creator: form.userId,
        }
      );
  
      return newPost;
    } catch (error) {
      throw new Error(error);
    }
  }