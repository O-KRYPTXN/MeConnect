import axiosInstance from "../lib/axios";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { Loader, Trash ,Heart , MessageCircle , Share ,Send, Share2 } from "lucide-react";
import { Link } from "react-router-dom";
import PostAction from "./PostAction";
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
    console.log(post);
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments , setComments]= useState(post.comments || []);
    const isOwner = authUser && authUser._id === post.author._id;
    const isLiked = post.likes.includes(authUser?._id);

    
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
            <div className="bg-secondary rounded-2xl shadow-md mb-6 overflow-hidden">
            <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                {/* User Info */}
                <div className="flex items-start space-x-3">
                    <Link to={`/profile/${post?.author?._id}`}>
                    <img
                        className="w-12 h-12 rounded-full border border-base-100"
                        src={post.author.profilePic || "/avatar.png"}
                        alt={post.author.username}
                    />
                    </Link>
                    <div>
                    <Link to={`/profile/${post?.author?._id}`} className="hover:underline">
                        <h3 className="font-semibold text-base">
                        {post.author.first_name + " " + post.author.last_name}
                        </h3>
                    </Link>
                    {/* <p className="text-sm text-gray-400">{post.author.headline}</p> */}
                    <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</p>
                    </div>
                </div>

                {/* Delete Button */}
                {isOwner && (
                    <button
                    className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition"
                    onClick={handleDeletePost}
                    >
                    {isDeletePending ? (
                        <Loader size={18} className="animate-spin" />
                    ) : (
                        <Trash size={18} />
                    )}
                    </button>
                )}
                </div>

                {/* Post Content */}
                <p className="text-base mb-3 text-gray-200">{post.content}</p>

                {/* Post Image */}
                {post.image && (
                <img
                    src={post.image}
                    alt="Post"
                    className="w-full rounded-lg border border-base-100 mb-2"
                />
                )}
                <div className="flex justify-between text-info">
                    <PostAction
                    icon={<Heart size={18} className={isLiked ? "text-red-500" : ""} /> }
                    text={post.likes.length}
                    onClick={handleLikePost}
                    isPending={isLikePending}
                    />

                    <PostAction
                    icon={<MessageCircle/>}
                    text={post.comments.length}
                    onClick={() => setShowComments(!showComments)}
                    />

                    <PostAction
                    icon={<Share2/>}
                    />
                </div>
             </div>
            {showComments && (
				<div className='px-4 pb-4'>
					<div className='mb-4 max-h-60 overflow-y-auto'>
						{comments.map((comment) => (
							<div key={comment._id} className='mb-2 bg-base-100 p-2 rounded flex items-start'>
								<img
									src={comment.user.profilePic || "/avatar.png"}
									alt={comment.user.username}
									className='w-8 h-8 rounded-full mr-2 flex-shrink-0'
								/>
								<div className='flex-grow'>
									<div className='flex items-center mb-1'>
										<span className='font-semibold mr-2'>{comment.user.first_name + " " + comment.user.last_name}</span>
										<span className='text-xs text-info'>
											{formatDistanceToNow(new Date(comment.createdAt))}
										</span>
									</div>
									<p>{comment.content}</p>
								</div>
							</div>
						))}
					</div>

					<form onSubmit={handleAddComment} className='flex items-center'>
						<input
							type='text'
							value={newComment}
							onChange={(e) => setNewComment(e.target.value)}
							placeholder='Add a comment...'
							className='flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary'
						/>

						<button
							type='submit'
							className='bg-primary text-white p-2 rounded-r-full hover:bg-primary-dark transition duration-300'
							disabled={isCommentPending}
						>
							{isCommentPending ? <Loader size={18} className='animate-spin' /> : <Send size={18} />}
						</button>
					</form>
				</div>
			)}
        </div>

    
  )
}

export default Post
