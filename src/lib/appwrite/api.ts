import { ID, Query } from "appwrite";
import { INewPost, INewUser, IUpdatePost, IUpdateUser } from "../types";
import { account, appwriteConfig, avatar, database, storage } from "./config";
import { URL } from "url";

interface PostData {
  $id: string;
  // Add other properties if necessary
}

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

export async function createPost(post: INewPost) {
  try {
    //upload storage
    const uploadedFile = await uploadFile(post.file[0]);
    if (!uploadedFile) throw new Error("Failed to upload file");

    //Get fileurl
    const fileurl = await getFilePreview(uploadedFile.$id);

    if (!fileurl) {
      await deleteFile(uploadedFile.$id);
      throw new Error("Failed to get file URL");
    }
    // Convert tags into array
    // Prepend # symbol to each tag using map
    const processedTags = post.tags?.replace(/ /g, "").split(",") || []; // Ensure array structure
    const tagsWithHash = processedTags.map((tag) => {
      const trimmedTag = tag.replace(/^(#)+/, "#"); // Replace leading # symbols with one #
      return trimmedTag;
    });
    // Create post
    const newPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      ID.unique(),
      {
        creator: post.userId,
        caption: post.caption,
        imageUrl: fileurl,
        imageid: uploadedFile.$id,
        location: post.location,
        tags: tagsWithHash,
      }
    );

    if (!newPost) {
      await deleteFile(uploadedFile.$id);
      throw Error;
    }

    return newPost;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function uploadFile(file: File) {
  try {
    const uploadedFile = await storage.createFile(
      appwriteConfig.storageId,
      ID.unique(),
      file
    );
    return uploadedFile;
  } catch (error) {
    console.log(error);
    throw Error;
  }
}

export function getFilePreview(fileId: string) {
  try {
    const fileurl = storage.getFilePreview(
      appwriteConfig.storageId,
      fileId,
      2000,
      2000,
      "top",
      100
    );
    return fileurl;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function deleteFile(fileId: string) {
  try {
    await storage.deleteFile(appwriteConfig.storageId, fileId);
    return { status: "ok" };
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getRecentPost() {
  await new Promise((resolve) => setTimeout(resolve, 15000));
  const posts = await database.listDocuments(
    appwriteConfig.databaseId,
    appwriteConfig.postCollectionId,
    [Query.orderDesc(`$createdAt`), Query.limit(20)]
  );
  if (!posts) throw new Error("Get post failed");

  return posts;
}

export async function likePost(
  postId: string,
  likesArray: string[]
): Promise<PostData> {
  try {
    const updatedPost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId,
      {
        likes: likesArray,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost as PostData;
  } catch (error) {
    console.log(error);
    return error as PostData;
  }
}

export async function savePost(postId: string, userId: string) {
  try {
    const updatedPost = await database.createDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      ID.unique(),
      {
        user: userId,
        post: postId,
      }
    );
    if (!updatedPost) throw Error;
    return updatedPost;
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function deleteSavedPost(savedRecordId: string) {
  try {
    const statusCode = await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.savesCollectionId,
      savedRecordId
    );
    if (!statusCode) throw Error;
    return { status: "ok" };
  } catch (error) {
    console.log(error);
    return error;
  }
}

export async function getPostById(postId: string) {
  try {
    const getPost = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return getPost || {};
  } catch (error) {
    console.log(error);
  }
}

export async function updatePost(post: IUpdatePost) {
  const hasFileToUpdate = post.file.length > 0;

  try {
    let image = {
      imageUrl: post.imageUrl,
      imageId: post.imageId,
    };

    if (hasFileToUpdate) {
      //upload file to storage
      const uploadedFile = await uploadFile(post.file[0]);
      if (!uploadedFile) throw new Error("Failed to upload file");

      //get file url
      const fileurl = getFilePreview(uploadedFile.$id);

      if (!fileurl) {
        deleteFile(uploadedFile.$id);
        throw Error;
      }
      image = { ...image, imageUrl: image.imageUrl, imageId: uploadedFile.$id };
    }

    // Convert tags into array

    const tags = post.tags?.replace(/ /g, "").split(",") || [];

    // Add # symbol to each tag element using map
    const processedTags = tags.map((tag) => {
      const trimmedTag = tag.replace(/^(#)+/, "#"); // Replace leading # symbols with one #
      return trimmedTag;
    });

    const updatePost = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      post.postId,
      {
        caption: post.caption,
        imageUrl: image.imageUrl,
        imageid: image.imageId,
        location: post.location,
        tags: processedTags,
      }
    );
    if (!updatePost) {
      await deleteFile(post.imageId);
      throw Error;
    }
    return updatePost;
  } catch (error) {
    console.log(error);
  }
}

export async function deletePost(postId: string, imageId: string) {
  try {
    if (!postId || imageId) throw Error;
    await database.deleteDocument(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      postId
    );
    return { status: "post deleted successfully" };
  } catch (error) {
    console.log(error);
  }
}

export async function getInfinitePosts({ pageParam }: { pageParam: number }) {
  const queries: any[] = [Query.orderDesc("$updatedAt"), Query.limit(10)];
  if (pageParam) {
    queries.push(Query.cursorAfter(pageParam.toString()));
  }
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      queries
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

export async function searchPostS(searchTerm: string) {
  try {
    const posts = await database.listDocuments(
      appwriteConfig.databaseId,
      appwriteConfig.postCollectionId,
      [Query.search("caption", searchTerm)]
    );
    if (!posts) throw Error;
    return posts;
  } catch (error) {
    console.log(error);
  }
}

// export async function getSavePost(userId?: string) {
//   if (!userId) return;
//   try {
//     const savedPost = await database.listDocuments(
//       appwriteConfig.databaseId,
//       appwriteConfig.savesCollectionId,
//       [Query.equal("user", userId), Query.orderDesc("$createdAt")]
//     );
//     if (!savedPost) throw Error;
//     return savedPost;
//   } catch (error) {
//     console.error("Error fetching saved posts:", error);
//     throw new Error("Failed to fetch saved posts");
//   }
// }

export async function getUserById(userId: string) {
  try {
    const user = await database.getDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      userId
    );
    if (!user) throw new Error("User cannot be found");
    return user;
  } catch (error) {
    console.log(error);
  }
}

export async function updateUser(user: IUpdateUser) {
  const hasFileToUpdate = user.file.length > 0;
  try {
    let image = {
      imageUrl: user.imageUrl,
      imageId: user.imageId,
    };

    if (hasFileToUpdate) {
      //upload the file to appwrite storage
      const uploadedFile = await uploadFile(user.file[0]);
      if (!uploadedFile) throw new Error('File upload failed');

      //Get new file url
      const fileurl = await getFilePreview(uploadedFile.$id);
      if (!fileurl) {
        await deleteFile(uploadedFile.$id);
        throw Error;
      }

      image = { ...image, imageUrl: fileurl?.toString(), imageId: uploadedFile.$id };
    }


    //update user

    const updateUser = await database.updateDocument(
      appwriteConfig.databaseId,
      appwriteConfig.userCollectionId,
      user.userId,
      {
        name: user.name,
        bio: user.bio,
        imageId: image.imageId,
        imageUrl: image.imageId,
      }
    );

    //if failed to update
    if (!updateUser) {

      //delete new file that has been recently updated
      if (hasFileToUpdate) {
        await deleteFile(image.imageId);
      }

      //if no file uploaded
      throw Error;
    }

    // Safely delete old file after successful update
    if (user.imageId && hasFileToUpdate) {
      await deleteFile(user.imageId);
    }
    return updateUser;
  } catch (error) {
    console.log(error);
  }
}
