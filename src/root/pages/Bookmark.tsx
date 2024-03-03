import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useGetCurrentUser } from "@/lib/react-query/queryAndMutation";
import { Models } from "appwrite";




const Bookmark = () => {

  const {data:currentUser } = useGetCurrentUser()
  console.log(currentUser, "currentuser")
  
  const savedPosts = currentUser?.save.map(({post} : {post: Models.Document}) => ({
    ...post,
    creator: {
      imageUrl: currentUser.imageUrl
    }
  })).reverse()


  console.log(savedPosts, "savedpost")
  return (
    <div className="saved-container">
      <div className="flex gap-2 w-full max-w-5xl">
        <img
          src="/assets/icons/save.svg"
          width={36}
          height={36}
          alt="edit"
          className="invert-white"
        />
        <h2 className="h3-bold md:h2-bold text-left w-full">Saved Posts</h2>
      </div>

    {!currentUser ? (
      <Loader />
    ): (
       <ul className="w-full flex justify-center max-w-5xl gap-9">
          {savedPosts.length === 0 ? (
            <p className="text-light-4">No saved posts.</p>
          ):(
            <GridPostList posts={savedPosts} showStats={false}/>
          )}
       </ul> 
    )}
    </div>
  );
};

export default Bookmark;



  // const { user } = useUserContext();
  // const {
  //   data: posts,
  //   isPending: isPendingSavedPosts,
  //   isError: isErrorSavedPosts,
  // } = useGetSavedPosts(user.id);

  // let content;

  // const transformedPosts: Models.Document[] = posts ? posts.documents : [];

  // console.log(posts)

  // if (isErrorSavedPosts) {
  //   content = (
  //     <p className="items-center justify-center text-3xl">
  //       Something went wrong
  //     </p>
  //   );
  // } else if (isPendingSavedPosts) {
  //   // Use a placeholder array for loading state
  //   content = <Loader />;
  // }else if(!posts){
  //   content = (
  //     <p className="items-center justify-center text-3xl">
  //       No saved posts found
  //     </p>
  //   );
  // }
  //  else {
  //   content = <GridPostList posts={transformedPosts}  showStats={false} showUser={false}/>
  // }