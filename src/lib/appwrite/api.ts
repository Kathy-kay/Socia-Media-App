import { ID, Query } from "appwrite";
import { INewPost, INewUser } from "../types";
import { account, appwriteConfig, avatar, database, storage } from "./config";
import { URL } from "url";

// interface UploadedFile {
//     $id: string;
   
// }

export async function createUserAccount(user: INewUser) {
  try {
    const newAccount = await account.create(
      ID.unique(),
      user.email,
      user.password,
      user.name
    );
    if (!newAccount) throw Error;
    const avatarUrl = avatar.getInitials(user.name);
    const newUser = await saveUserToDB({
      accountid: newAccount.$id,
      name: newAccount.name,
      email: newAccount.email,
      username: user.username,
      imageUrl: avatarUrl,
    });
    return newUser;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//SAVING USER TO DATABASE
export async function saveUserToDB(user: {
  accountid: string;
  name: string;
  email: string;
  username: string;
  imageUrl: URL;
}) {
  try {
    const newUser = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      ID.unique(),
      user
    );
    return newUser;
    console.log(newUser);
  } catch (error) {
    console.log(error);
    return error;
  }
}

//SIGNING IN
export async function SignInAccount(user: { email: string; password: string }) {
  try {
    const session = await account.createEmailSession(user.email, user.password);
    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
}

//GET  THE CURRENT USER
export async function getCurrentUser() {
  try {
    const currentAccount = await account.get();
    if (!currentAccount) throw Error("Current account not found");

    const currentUser = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      [Query.equal("accountid", currentAccount.$id)]
    );
    if (!currentUser) throw Error("Current user not found");
    return currentUser.documents[0];
  } catch (error) {
    console.log("error fetching current user: ", error);
  }
}

export async function signOutAccount() {
  try {
    const session = await account.deleteSession("current");
    return session;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function createPost(post: INewPost){
  try {
    //upload storage
    const uploadedFile = await uploadFile(post.file[0]);
    if(!uploadedFile) throw new Error("Failed to upload file");

    //Get fileurl
    const fileurl = await getFilePreview(uploadedFile.$id)

    if(!fileurl){
      await deleteFile(uploadedFile.$id)
      throw new Error("Failed to get file URL");
    }
     // Convert tags into array  
     const tags = post.tags?.replace(/ /g, "").split(",") || [];

     // Create post
     const newPost = await database.createDocument(
       appwriteConfig.databaseId,
       appwriteConfig.postCollectionId,
       ID.unique(),
       {
         creator: post.userId,
         caption: post.caption,
         imageUrl: fileurl,
         imageId: uploadedFile.$id,
         location: post.location,
         tags: tags,
       }
     );
 
     if (!newPost) {
       await deleteFile(uploadedFile.$id);
       throw Error;
     }
 
     return newPost;
  } catch (error) {
    console.log(error);
    return error
  }
}

export async function uploadFile(file: File){
   try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    )
    return uploadedFile;
   } catch (error) {
    console.log(error);
    throw Error
   }
}

export async function getFilePreview(fileId: string){
  try {
    const fileurl =  await storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      'top',
      100
    );
    return fileurl;
  } catch (error) {
    console.log(error)
    return error
  }
}

export async function deleteFile(fileId: string){
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId)
    return {status: 'ok'}
  } catch (error) {
    console.log(error)
    return error
  }
}