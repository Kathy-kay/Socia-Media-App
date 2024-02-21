import {
  useDeleteSavedPost,
  useGetCurrentUser,
  useLikePost,
  useSavePost,
} from "@/lib/react-query/queryAndMutation";
import { checkIsLiked } from "@/lib/utils";
import { Models } from "appwrite";
import React,{ useEffect, useState } from "react";
import Loader from "./Loader";

type PostStatProps = {
  post: Models.Document;
  userId: string;
};

const PostStats = ({ post, userId }: PostStatProps) => {
  const likeList = post.likes.map((user: Models.Document) => user.$id);

  const [ likes, setLikes ] = useState(likeList);
  const [ isSave, setIsSave ] = useState(false);

  const { mutate: likePost } = useLikePost();
  const { mutate: savePost, isPending: isSavingPost } = useSavePost();
  const { mutate: deleteSavedPost, isPending: isDeletingPost } = useDeleteSavedPost();

  const { data: currentUser } = useGetCurrentUser();

  const handleLikePost = (e:React.MouseEvent) =>{
    e.stopPropagation();
    
    let  newLikes = [...likes]
    const hasUserLikedPost = newLikes.includes(userId)

    if(hasUserLikedPost){
      newLikes = newLikes.filter((id) => id !== userId)
    }
    else{
      newLikes.push(userId)
    }
    setLikes(newLikes);
    likePost({postId: post.$id, likesArray: newLikes})
  }
  const savedPostRecord = currentUser?.save.find((record: Models.Document) => record.post.$id === post.$id);
  useEffect(() =>{
    setIsSave(savedPostRecord ? true : false)
  },[currentUser])

  const handleSavePost = (e: React.MouseEvent) =>{
    e.stopPropagation();

    if(savedPostRecord){
      setIsSave(false)
      deleteSavedPost(savedPostRecord.$id);
      return
    }
    savePost({postId: post.$id, userId})
  }

  return (
    <div className="flex justify-between items-center z-20">
      <div className="flex gap-2 mr-5">
        <img
          src={`${
            checkIsLiked(likes, userId)
              ? "/assets/icons/liked.svg"
              : "/assets/icons/like.svg"
          }`}
          alt="like"
          width={20}
          height={20}
          onClick={handleLikePost}
          className="cursor-pointer"
        />
        <p className="small-medium lg:base-medium">{likes.length}</p>
      </div>
      <div className="flex gap-2 ">
        { isSavingPost || isDeletingPost ? <Loader /> :<img
          src={isSave ? "/assets/icons/saved.svg" : "/assets/icons/save.svg"}
          alt="like"
          width={20}
          height={20}
          onClick={handleSavePost}
          className="cursor-pointer"
        />}
      </div>
    </div>
  );
};

export default PostStats;
