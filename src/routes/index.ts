import { Router } from "express";

import { TweetsRoutes } from "./tweets.routes";
import { UsersRoutes } from "./users.routes";
import { AuthRoutes } from "./auth.routes";
import { LikesRoutes } from "./likes.routes";
import { FollowersRoutes } from "./followers.routes";

const router = Router();

router.use("/tweets", TweetsRoutes);
router.use("/users", UsersRoutes);
router.use("/auth", AuthRoutes);
router.use("/likes", LikesRoutes);
router.use("/followers", FollowersRoutes);
router.use("/login", AuthRoutes);

export default router;