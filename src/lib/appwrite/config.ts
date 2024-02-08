import {Client, Account, Databases, Storage, Avatars} from "appwrite"


export const appwriteConfig = {
    projectId: import.meta.env.VITE_APPWRITE_PROJECT_ID,
    url: import.meta.env.VITE_APPWRITE_URL,
}

export const client  = new Client();
client.setEndpoint(appwriteConfig.url)
client.setProject(appwriteConfig.projectId)



export const account = new Account(client);
export const database = new Databases(client)
export const storage  = new Storage(client)
export const avatar = new Avatars(client)
export {ID} from "appwrite"