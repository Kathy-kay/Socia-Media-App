import PostCard from "@/components/shared/PostCard";
import SkeletonHomeCard from "@/components/shared/skeleton/SkeletonHomeCard";
import { useGetRecentPost } from "@/lib/react-query/queryAndMutation";
import { Models } from "appwrite";

const Home = () => {
  const {
    data: posts,
    isPending: isPostLoading,
    isError: isErrorPosts,
  } = useGetRecentPost();
  let content;

  if (isErrorPosts) {
    content = (
      <p className="items-center justify-center text-3xl">
        Something went wrong
      </p>
    );
  } else if (isPostLoading  && !posts) {
    // Use a placeholder array for loading state
    content = Array(3).fill(null).map((_, index) => (
      <SkeletonHomeCard key={`skeleton-${index}`} />
    ));
  } else {
    content = posts?.documents.map((post: Models.Document) => (
      <PostCard post={post} key={post.caption} />
    ));
  }

  return (
    <div className="flex flex-1">
      <div className="home-container">
        <div className="home-posts">
          <h2 className="h3-bold md:h2-bold text-left w-full">Feeds</h2>

          <ul className="flex flex-col flex-1 gap-9 w-full">{content}</ul>
        </div>
      </div>
    </div>
  );
};

export default Home;
