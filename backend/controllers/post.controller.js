import Post from "../models/post.model.js";
import cloudinary from "../lib/cloudinary.js";
import Notification from "../models/notification.model.js";

export const getFeedPosts = async (req,res)=>{
    try {
        const posts = await Post.find({author:{$in:[...req.user.connections, req.user._id]}}).sort({createdAt:-1})
        .populate("author","first_name last_name profilePic headline")
        .populate("comments.user","first_name last_name profilePic")
        .populate({
        path: "originalPost",
        populate: {
          path: "author",
          select: "first_name last_name username profilePic headline"
        }
      });

        res.status(200).json(posts);
    } catch (error) {
        console.log("error in getFeedPosts",error);
        res.status(500).json({message:"something went wrong"});
    }
}

export const createPost = async (req,res)=>{
    try {
        const {content,image} = req.body;   
        let newPost;

        if(image){
            const result = await cloudinary.uploader.upload(image);
                newPost = new Post({
                    content,
                    image:result.secure_url,
                    author:req.user._id
               });
            
        }else{
            newPost = new Post({
                content,
                author:req.user._id
            });

        }
        await newPost.save();
        res.status(201).json(newPost);

    } catch (error) {
        console.log("error in createPost",error);
        res.status(500).json({message:"something went wrong"});
    }
}

export const deletePost = async (req,res)=>{
    try {
        const postId=req.params.id;
        const userId=req.user._id;
        const post = await Post.findById(postId);

         if(!post){
            return res.status(404).json({message:"post not found"});
         }

         if(post.author.toString()!==userId.toString()){
            return res.status(403).json({message:"unauthorized"});
         }
         if(post.image){
          await cloudinary.uploader.destroy(post.image.split("/").pop().split(".")[0]);
         } // deleting the image in cloudinary

         await Post.findByIdAndDelete(postId);

        res.status(200).json({message:"post deleted successfully"});

    } catch (error) {

        console.log("error in deletePost",error);
        res.status(500).json({message:"something went wrong"});
    }
}

export const getPostById = async (req,res)=>{
    try {
        const post = await Post.findById(req.params.id)
        .populate("author","first_name last_name profilePic headline")
        .populate("comments.user","first_name last_name profilePic username headline")
        .populate('originalPost')
        
        if(!post){
            return res.status(404).json({message:"post not found"});
        }

        res.status(200).json(post);

    } catch (error) {
        console.log("error in getPostById",error);
        res.status(500).json({message:"something went wrong"});
    }
}

export const createComment = async (req,res)=>{
    try {
        const postId= req.params.id;
        const {content} = req.body;

        if (!content || content.trim() === "") {
            return res.status(400).json({ message: "comment content is required" });
        }

        const post =await Post.findByIdAndUpdate(
            postId,
            {
                $push:{comments:{user:req.user._id,content}}
            },
            {new:true}).populate("author" , "username first_name last_name headline profilePic");
        
        if(post.author._id.toString() !== req.user._id.toString() ){
            const newNotification = new Notification({
                recipient:post.author,
                type:"comment",
                relatedUser:req.user._id,
                relatedPost:postId
            })
            await newNotification.save()   
        }
        res.status(200).json(post)

    } catch (error) {
        console.log("error creating the comment",error);
        res.status(500).json({message:"something went wrong"});
    }

}

export const likePost = async (req,res)=>{
    try {
        const postId = req.params.id
        const post = await Post.findById(postId)
        const userId = req.user._id
        let liked;

        if (!post) {
            return res.status(404).json({ message: "Post not found" });
        }

        if(post.likes.includes(userId)){
            post.likes = post.likes.filter((id)=>id.toString() !== userId.toString()) //unlike the post
            liked=false
        }else{
            post.likes.push(userId) // like the post
            liked=true
            if(post.author.toString() !== userId.toString()){
                const newNotification = new Notification({
                    recipient: post.author._id,
                    type:"like",
                    relatedUser:userId,
                    relatedPost:postId
                })
                await newNotification.save()
            }
        }

        await post.save()
        res.status(200).json({post,liked})

    } catch (error) {
        console.log("error liking the post",error);
        res.status(500).json({message:"something went wrong"});
    }
}



export const sharePost = async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost) {
      return res.status(404).json({ message: "Original post not found" });
    }

    // Create a new post based on original, but with current user as author
    const sharedPost = new Post({
      content: originalPost.content,
      image: originalPost.image,
      author: req.user._id,
      isShared: true,
      originalPost: originalPost._id, // to track source (optional)
    });

    await sharedPost.save();

    res.status(201).json(sharedPost);
  } catch (error) {
    console.log("error in sharePost", error);
    res.status(500).json({ message: "something went wrong" });
  }
};