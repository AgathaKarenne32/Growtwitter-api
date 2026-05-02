import { Router } from "express";

import { TweetsRoutes } from "./tweets.routes"; 
import { UsersRoutes } from "./users.routes";
import { AuthRoutes } from "./auth.routes";
import { LikesRoutes } from "./likes.routes";
import { FollowersRoutes } from "./followers.routes";

const router = Router();

// O erro na linha 11 deve sumir agora
router.use("/tweets", TweetsRoutes);
router.use("/users", UsersRoutes);
router.use("/auth", AuthRoutes);
router.use("/likes", LikesRoutes);
router.use("/followers", FollowersRoutes);

export default router;