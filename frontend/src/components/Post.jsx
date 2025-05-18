import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader, Trash ,Heart , MessageCircle , Share ,Send, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import PostAction from "./PostAction";
import SharePostButton from "./SharePostButton";
import {formatDistanceToNow} from "date-fns";


const Post = ({post}) => {

    const queryClient = useQueryClient();

    const { data: authUser } = useQuery({
    queryKey: ['authUser'],
    queryFn: async () => {
      try {
        const res = await axiosInstance.get('/auth/me');
        return res.data;
      } catch (error) {
        if (error.response && error.response.status === 401) {
          return null;
        }
        //toast.error(error.response?.data?.message || 'Something went wrong');
      }
    },
  });
    //console.log(post);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments , setComments]= useState(post.comments || []);
    const isOwner = authUser && authUser._id === post.author._id;
    const isLiked = post.likes.includes(authUser?._id);

    const [isEditing, setIsEditing] = useState(false);
    const [editedContent, setEditedContent] = useState(post.content);   

    
    const {mutate: deletePost ,isPending:isDeletePending}=useMutation({

        mutationFn:async () => {await axiosInstance.delete(`/posts/delete/${post._id}`)},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Post deleted successfully");
        },
        onError: (err) => {
            toast.error(err.response.data.message || "error deleting the post");
        },

    });

    const {mutate:createComment ,isPending:isCommentPending}=useMutation({

        mutationFn: async (newComment) => {await axiosInstance.post(`/posts/${post._id}/comment`,{content:newComment})},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            toast.success("Comment added !");
        },
        onError: (err) => {
            toast.error(err.response.data.message || "error adding the comment");
        },
    })


    const {mutate:likePost ,isPending:isLikePending}=useMutation({

        mutationFn: async () => {await axiosInstance.post(`/posts/${post._id}/like`)},
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["posts"] });
            //toast.success("liked!");
        },
        onError: (err) => {
            toast.error(err.response.data.message || "error liking the post");
        },
    })

    const { mutate: updatePost } = useMutation({
        mutationFn: async () => {
            await axiosInstance.put(`/posts/${post._id}`, { content: editedContent });
        },
        onSuccess: () => {
            toast.success("Post updated");
            setIsEditing(false);
           queryClient.invalidateQueries({ queryKey: ["posts"] });
        },
        onError: () => {
            toast.error("Failed to update post");
        }
        });

    const handleSaveEdit = () => {
        updatePost();
    };



    const handleDeletePost=()=>{
        if(window.confirm("Are you sure you want to delete this post?")){
            deletePost();
        }else{
            return;
        }
    }

    const handleLikePost= async()=>{
        if(isLikePending) return;
        likePost(); 
    }

    	const handleAddComment = async (e) => {
		e.preventDefault();
		if (newComment.trim()) {
			createComment(newComment);
			setNewComment("");
			setComments([
				...comments,
				{
					content: newComment,
					user: {
						_id: authUser._id,
						first_name: authUser.first_name,
                        last_name: authUser.last_name,
						profilePic: authUser.profilePic,
					},
					createdAt: new Date(),
				},
			]);
		}
	};

    




return (
  <div className="bg-[#1e1e2f] text-gray-200 rounded-2xl shadow-lg mb-6 overflow-hidden border border-[#2a2a3d]">
    <div className="p-5">
      <div className="flex justify-between items-start mb-4">
        {/* User Info */}
        <div className="flex items-start gap-3">
          <Link to={`/profile/${post?.author?._id}`}>
            <img
              className="w-12 h-12 rounded-full border border-gray-600"
              src={post.author.profilePic || "/avatar.png"}
              alt={post.author.username}
            />
          </Link>
          <div>
            <Link to={`/profile/${post?.author?.username}`} className="hover:underline text-white">
              <h3 className="font-semibold text-base">
                {post.author.first_name + " " + post.author.last_name}
              </h3>
            </Link>
            <p className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 items-start">
          {isOwner && (
            isEditing ? (
              <>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition"
                  onClick={handleSaveEdit}
                >
                  Save
                </button>
                <button
                  className="bg-gray-700 text-white px-3 py-1 rounded hover:bg-gray-600 transition"
                  onClick={() => {
                    setIsEditing(false);
                    setEditedContent(post.content);
                  }}
                >
                  Cancel
                </button>
              </>
            ) : (
              <button
                className="bg-[#1e1e1e] text-white px-3 py-1 rounded hover:bg-[#383838] transition"
                onClick={() => setIsEditing(true)}
              >
                Edit
              </button>
            )
          )}

          {(isOwner || authUser?.username === "admin") && (
            <button
              className="bg-red-600 text-white p-2 rounded hover:bg-red-700 transition"
              onClick={handleDeletePost}
            >
              {isDeletePending ? (
                <Loader size={15} className="animate-spin" />
              ) : (
                <Trash size={15} />
              )}
            </button>
          )}
        </div>
      </div>

      {/* Shared Post */}
      {post.isShared ? (
        post.originalPost ? (
          <div className="bg-[#2b2b3d] border border-blue-500 rounded-lg p-4 mb-4">
            <p className="italic text-sm text-blue-400 mb-2">
              Shared post from{" "}
              <Link to={`/profile/${post.originalPost.author.username}`} className="underline">
                {post.originalPost.author.first_name + " " + post.originalPost.author.last_name}
              </Link>
            </p>
            <Link to={`/posts/${post.originalPost._id}`} className="block hover:underline mb-2 text-white">
              {post.originalPost.content}
            </Link>
            {post.originalPost.image && (
              <img
                src={post.originalPost.image}
                alt="Shared post"
                className="w-full rounded-lg border border-gray-600"
              />
            )}
          </div>
        ) : (
          <p className="italic text-sm text-gray-400">Original post not available</p>
        )
      ) : (
        <>
          {isEditing ? (
            <textarea
              className="w-full p-3 bg-[#2d2d3d] text-white rounded-md border border-gray-600"
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
            />
          ) : (
            <p className="text-base mb-3 text-gray-300">{post.content}</p>
          )}

          {post.image && (
            <img
              src={post.image}
              alt="Post"
              className="w-full rounded-lg border border-gray-600 mb-3"
            />
          )}
        </>
      )}

      {/* Post Actions */}
      <div className="flex justify-between items-center text-gray-400 mt-2">
        <PostAction
          icon={<Heart size={18} className={isLiked ? "text-red-500" : ""} />}
          text={post.likes.length}
          onClick={handleLikePost}
          isPending={isLikePending}
        />

        <PostAction
          icon={<MessageCircle size={18} />}
          text={post.comments.length}
          onClick={() => setShowComments(!showComments)}
        />

        {!post.isShared && (
          <div>
            <SharePostButton postId={post._id} />
          </div>
        )}
      </div>
    </div>

    {/* Comments */}
    {showComments && (
      <div className="px-5 pb-5">
        <div className="mb-4 max-h-60 overflow-y-auto space-y-2">
          {comments.map((comment) => (
            <div key={comment._id} className="bg-[#2c2c3c] p-2 rounded flex items-start">
              <img
                src={comment.user.profilePic || "/avatar.png"}
                alt={comment.user.username}
                className="w-8 h-8 rounded-full mr-3 flex-shrink-0 border border-gray-600"
              />
              <div className="flex-grow">
                <div className="flex items-center mb-1">
                  <span className="font-semibold mr-2 text-white">
                    {comment.user.first_name + " " + comment.user.last_name}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatDistanceToNow(new Date(comment.createdAt))}
                  </span>
                </div>
                <p className="text-sm text-gray-300">{comment.content}</p>
              </div>
            </div>
          ))}
        </div>

        <form onSubmit={handleAddComment} className="flex items-center gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Add a comment..."
            className="flex-grow p-2 rounded-l-full bg-[#2d2d3d] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            type="submit"
            className="bg-blue-600 text-white p-2 rounded-r-full hover:bg-blue-700 transition duration-300"
            disabled={isCommentPending}
          >
            {isCommentPending ? <Loader size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </form>
      </div>
    )}
  </div>
);

}

export default Post
