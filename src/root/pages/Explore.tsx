import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import SearchResult from "@/components/shared/SearchResult";
import { Input } from "@/components/ui/input";
import useDebounce from "@/hooks/useDebounce";
import {
  useGetPost,
  useSearchPosts,
} from "@/lib/react-query/queryAndMutation";
import { useEffect, useState } from "react";
import { useInView } from 'react-intersection-observer';

const Explore = () => {
  const { data: posts, fetchNextPage, hasNextPage } = useGetPost();
  const {ref, inView} = useInView()

  const [searchValue, setSearchValue] = useState("");
  const debouncedValue = useDebounce(searchValue, 500);
  const { data: searchedPosts, isFetching: isSearchFetching } =
    useSearchPosts(debouncedValue);


  useEffect(() => {
    if(inView && !searchValue) fetchNextPage();
  }, [inView, searchValue])

  if (!posts) {
    return (
      <div className="flex-center h-full w-full">
        <Loader />
      </div>
    );
  }
  // console.log(posts)

  const showSearchResult = searchValue !== "";
  const shouldShowPost =
  !showSearchResult &&
  posts.pages.every((item) => {
    if (item && item.documents) {
      return item.documents.length === 0;
    } else {
      return true; // Consider appropriate handling for missing data
    }
  });

  
  return (
    <div className="explore-container">
      <div className="explore-inner_container">
        <h2 className="h3:bold md:h2-bold w-full">Search Posts</h2>
        <div className="flex gap-1 px-4 w-full rounded-lg bg-dark-4">
          <img
            src="/assets/icons/search.svg"
            alt="search"
            width={24}
            height={24}
          />
          <Input
            type="text"
            placeholder="search"
            className="explore-search"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          ></Input>
        </div>
      </div>
      <div className=" flex-between w-full max-w-5xl mt-16 mb-7">
        <h3 className="body-bold">Popular Posts</h3>
        <div className="flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer">
          <p className="small-medium md:base-medium text-light-2">All</p>
          <img
            src="/assets/icons/filter.svg"
            alt="filter"
            width={24}
            height={24}
          />
        </div>
      </div>
      <div className="flex flex-wrap gap-9 w-full max-w-5xl">
        {showSearchResult ? (
          <SearchResult searchedPosts={searchedPosts} isSearchFetching={isSearchFetching}/> // Render SearchResult component
        ) : shouldShowPost ? (
          <p className="text-light-4 mt-10 text-center w-full">End of post</p> // Always render empty text element
        ) : (
          posts.pages.map((item, index) => {
            if (item && item.documents) {
              return <GridPostList key={`page-${index}`} posts={item.documents} />;
            } else {
              return null; // Or a placeholder element
            }
          })
        )}
      </div>
      {hasNextPage && !searchValue && (
        <div ref={ref} className="mt-10"><Loader /></div>
      )}
    </div>
  );
};

export default Explore;
