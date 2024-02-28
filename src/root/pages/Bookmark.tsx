import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { useUserContext } from "@/context/AuthContext";
import { useGetSavedPosts } from "@/lib/react-query/queryAndMutation";
import { Models } from "appwrite";

const Bookmark = () => {
  const { user } = useUserContext();
  const {
    data: posts,
    isFetching: isFetchingSavedPosts,
    isError: isErrorSavedPosts,
  } = useGetSavedPosts(user.id);

  let content;

  if (isErrorSavedPosts) {
    content = (
      <p className="items-center justify-center text-3xl">
        Something went wrong
      </p>
    );
  } else if (isFetchingSavedPosts) {
    // Use a placeholder array for loading state
    content = <Loader />;
  } else {
    content = posts?.documents.map((post: Models.Document) => (
      <GridPostList posts={[post]} key={post.$id} showStats={false} showUser={false}/>
    ));
  }
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

      <ul className="w-full flex justify-center max-w-5xl gap-9">{posts && content}</ul>
    </div>
  );
};

export default Bookmark;
