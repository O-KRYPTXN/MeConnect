import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserNotifications  , markNotificationAsRead , deleteNotification , sendContactMessage} from "../controllers/notification.controller.js";

const router = express.Router();

router.get("/",protectRoute,getUserNotifications);
router.put("/:id/read",protectRoute,markNotificationAsRead);
router.delete("/:id",protectRoute,deleteNotification);

router.post("/contact/:recipientId",protectRoute,sendContactMessage);

export default router;