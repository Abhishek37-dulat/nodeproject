import { Router } from "express";
import {
  addComment, 
  deleteComment, 
  getAllComments
} from "../controllers/commentController";
import {
    addReply,
    deleteReply,
    getAllReply
  } from "../controllers/commentReplyController.js";
import Auth from "../middlewares/Auth";

const commentRouter = Router();

commentRouter.post("/addcomment", addComment);
commentRouter.post("/deletecomment", deleteComment);
commentRouter.get("/getallcomments", getAllComments);
commentRouter.post("/addreply",Auth, addReply);
commentRouter.post("/deletereply",Auth, deleteReply);
commentRouter.get("/getallreply",Auth, getAllReply);
export default commentRouter;
