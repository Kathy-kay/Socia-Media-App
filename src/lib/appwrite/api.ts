import { ID, Query } from "appwrite";
import { INewUser } from "../types";
import { account, appwriteConfig, avatar, database } from "./config";
import { URL } from "url";


export async function createUserAccount(user: INewUser){
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name,
        );
        if(!newAccount) throw Error;
        const avatarUrl = avatar.getInitials(user.name)
        const newUser = await saveUserToDB({
            accountid: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl
        })
        return newUser;
    } catch (error) {
        console.log(error);
        return error;
    }
}

//SAVING USER TO DATABASE
export async function saveUserToDB(user: {
    accountid:string;
    name:string;
    email: string;
    username: string;
    imageUrl: URL;
}) {
   try {
    const newUser = await database.createDocument(
        appwriteConfig.databaseid,
        appwriteConfig.userCollectionId,
        ID.unique(),
        user
    )
    return newUser
    console.log(newUser);
   } catch (error) {
    console.log(error);
    return error
   } 
}

//SIGNING IN
export async function SignInAccount(user: { 
    email: string;
    password: string
}) {
    try {
        const session = await account.createEmailSession(user.email, user.password) 
        return session;
    } catch (error) {
        console.log(error);
        return error;
    }
}   

//GET  THE CURRENT USER
export async function getCurrentUser(){
    try {
        const currentAccount = await account.get()
        if (!currentAccount)  throw Error("Current account not found");

        const currentUser = await database.listDocuments(
            appwriteConfig.databaseid,
            appwriteConfig.userCollectionId,
            [Query.equal('accountid', currentAccount.$id)]
        )
        if(!currentUser) throw Error("Current user not found");
        return currentUser.documents[0];
    } catch (error) {
        console.log("error fetching current user: ", error)
    }
}

export async function signOutAccount() {
    try {
        const session = await account.deleteSession('current');
        return session;
    } catch (error) {
       console.log(error);
       return error 
    }
}