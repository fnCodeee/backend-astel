import { Router } from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import authController from "../controllers/auth.controller.js";
import profilesController from "../controllers/profiles.controller.js";
import postController from "../controllers/post.controller.js";
import skillModel from "../model/skill.model.js";
import collabController from "../controllers/collab.controller.js";
import applicationController from "../controllers/application.controller.js";
import optionalAuth from "../middlewares/optionalAuth.middlware.js";

const router = Router();

router.get("/", (req, res) => res.json("hallo"));

// AUTH 
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// PROFILES
router.get("/profiles/me", authMiddleware, authController.me);
router.put("/profiles/me", authMiddleware, profilesController.updateProfile);

router.get("/profiles/:userId", authMiddleware, profilesController.getProfile);

// ENDPOINT:POST
router.get("/profiles/:userId/posts", authMiddleware, postController.getMyPosts);
router.get("/posts/:postId", authMiddleware, postController.getPostDetail);
router.get("/posts", optionalAuth, postController.showCase); // tidak perlu authMiddleware
router.post("/posts", authMiddleware, postController.createPost);
router.put("/posts/:postId", authMiddleware, postController.updatePosts);
router.delete("/posts/:postId", authMiddleware, postController.deletePost);
// Like : masuk ke POST
router.post("/posts/:postId/like", authMiddleware, postController.likePost);
router.delete("/posts/:postId/unlike", authMiddleware, postController.unlikePost);
// Comment: masuk ke POST
router.post("/posts/:postId/comments", authMiddleware, postController.createComment);
router.get("/posts/:postId/comments", authMiddleware, postController.getComments);
router.delete("/delete/comments/:commentId", authMiddleware, postController.deleteComment);

// COLLAB :
router.get("/profiles/:userId/collab", authMiddleware, collabController.yourCollabPost)
router.get("/collab", authMiddleware, collabController.showCollab)
router.get("/collab/inbox", authMiddleware, applicationController.getApplicants);
router.get("/collab/:id", authMiddleware, collabController.getCollabDetail)
router.post("/collab", authMiddleware, collabController.addCollab);
router.put("/collab/:id", authMiddleware, collabController.updateCollab);
router.delete("/collab/:id", authMiddleware, collabController.deleteCollab);

// FETCH ALL SKLL
router.get("/skills", authMiddleware, async (req, res) => {
  const result = await skillModel.find();
  res.status(200).json({
    success: true,
    message: "Semua Skill!",
    data: result,
  });
});


// APPLICATION
router.get("/myapplications", authMiddleware, applicationController.myApplications);
router.get("/myapplications/:applicationId", authMiddleware, applicationController.myApplicationDetail);

router.post("/collab/:collabId/applications", authMiddleware, applicationController.applyCollab);
router.put("/collab/applications/:applicationId/accept", authMiddleware, applicationController.acceptApplicant);
router.put("/collab/applications/:applicationId/reject", authMiddleware, applicationController.rejectApplicant);

export default router;
