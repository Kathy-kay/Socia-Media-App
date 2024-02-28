import GridPostList from "@/components/shared/GridPostList";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";
import { useUserContext } from "@/context/AuthContext";
import { useGetUserId } from "@/lib/react-query/queryAndMutation";
import { Link, Outlet, Route, Routes, useLocation, useParams } from "react-router-dom";
import LikedPost from "./LikedPost";

interface StabBlockProps {
  value: string | number;
  label: string;
}

const StatBlock = ({ value, label }: StabBlockProps) => (
  <div className="flex-center gap-2">
    <p className="small-semibold lg:body-bold text-primary-500">{value}</p>
    <p className="small-medium lg:base-medium text-light-2">{label}</p>
  </div>
);

const Profile = () => {
  const { user } = useUserContext();
  const { id } = useParams();
  const { data: userData } = useGetUserId(id || "");
  const {pathname} = useLocation()

  if (!userData) {
    return (
      <div className="flex-center w-full h-full ">
        <Loader />
      </div>
    );
  }

  // console.log(userData)

  return (
    <div className="profile-container">
      <div className="profile-inner_container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img
            src={userData.imageUrl || "/assets/images/profile.png"}
            alt="profile image"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full"
          />
          <div className="flex flex-col flex-1 justify-between md:mt-2">
            <div className="flex flex-col w-full">
              <h1 className="text-center xl:text-left h3-bold md:h1-semibold w-ful">
                {userData.name}
              </h1>
              <p className="small-regular md:body-medium text-light-3 text-center xl:text-left">
                @{userData.username}
              </p>
            </div>

            <div className="gap-8 mt-10 flex items-center justify-center xl:justify-start flex-wrap z-20">
              <StatBlock value={userData.posts.length} label="Posts" />
              <StatBlock value={20} label="Followers" />
              <StatBlock value={20} label="Following" />
            </div>
            <p className="small-medium md:base-medium text-center xl:text-left mt-7 max-w-screen-sm">
              {userData.bio}
            </p>
          </div>

          <div className="flex justify-center gap-4">
            <div className={`${user.id !== userData.$id && "hidden"}`}>
              <Link
                to={`/update-profile/${userData.$id}`}
                className={`h-12 bg-dark-4 px-5 text-light-1 flex-center gap-2 rounded-lg ${
                  user.id !== userData.$id && "hidden"
                }`}
              >
                <img
                  src={"/assets/icons/edit.svg"}
                  alt="edit"
                  width={20}
                  height={20}
                />
                <p className="flex whitespace-nowrap small-medium">
                  Edit Profile
                </p>
              </Link>
            </div>
            <div className={`${user.id === id && "hidden"}`}>
              <Button type="button" className="shad-button_primary px-8">
                Follow
              </Button>
            </div>
          </div>
        </div>
      </div>
       
     
        <div className="flex max-w-5xl w-full">
          <Link
            to={`/profile/${id}`}
            className={`profile-tab rounded-l-lg ${
              pathname === `/profile/${id}` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/posts.svg"}
              alt="posts"
              width={20}
              height={20}
            />
            Posts
          </Link>
          {userData.$id === user.id && (
          <Link
            to={`/profile/${id}/liked-posts`}
            className={`profile-tab rounded-r-lg ${
              pathname === `/profile/${id}/liked-posts` && "!bg-dark-3"
            }`}>
            <img
              src={"/assets/icons/like.svg"}
              alt="like"
              width={20}
              height={20}
            />
            Liked Posts
          </Link>
           )}
        </div>
     
      <Routes>
        <Route
          index
          element={<GridPostList posts={userData.posts} showUser={false} />}
        />
        {userData.$id === user.id && (
          <Route path="/liked-posts" element={<LikedPost />} />
        )}
      </Routes>
      <Outlet />
    </div>
  );
};

export default Profile;
