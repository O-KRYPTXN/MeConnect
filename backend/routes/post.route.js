import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import {  getFeedPosts , createPost  , deletePost ,
          getPostById , createComment , likePost  ,
          sharePost , getPostsByUserId, updatePost} from "../controllers/post.controller.js";

const router = express.Router();  

router.get("/user/:userId", protectRoute, getPostsByUserId);
router.get("/",protectRoute,getFeedPosts);
router.post("/create",protectRoute,createPost);
router.delete("/delete/:id",protectRoute,deletePost);

router.post("/:id/comment",protectRoute, createComment);
router.post("/:id/like" , protectRoute , likePost)

router.post("/share/:id", protectRoute, sharePost);

router.put("/:id",protectRoute,updatePost)

router.get("/:id" , protectRoute , getPostById);

export default router;