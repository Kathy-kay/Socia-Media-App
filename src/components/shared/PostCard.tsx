import { Models } from "appwrite";
import { Link } from "react-router-dom";


interface PostCardProps {
    post: Models.Document;
  }

const PostCard= ({post}: PostCardProps) => {
  return (
    <div className="post-card">
        <div className="flex-between">
            <div className="flex items-center gap-3">
                <Link to={`/profile/${post.creator.$id}`}>
                    <img src={post?.creator?.imageUrl || '/assets/icons/profile'} alt={post.creator}/>
                </Link>
            </div>
        </div>
    </div>
  )
}

export default PostCard