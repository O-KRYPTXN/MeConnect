import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getUserConnections , getConnectionRequests , getConnectionStatus ,
     sendConnectionRequest , acceptConnectionRequest , rejectConnectionRequest , 
     deleteConnection }
      from "../controllers/connection.controller.js";


const router = express.Router(); //

router.get("/",protectRoute,getUserConnections);
router.get("/requests",protectRoute,getConnectionRequests);
router.get("/status/:userId",protectRoute,getConnectionStatus);

router.post("/request/:id",protectRoute,sendConnectionRequest);

router.put("/accept/:id",protectRoute,acceptConnectionRequest);
router.put("/reject/:id",protectRoute,rejectConnectionRequest);

router.delete("/:userId",protectRoute,deleteConnection);

export default router;