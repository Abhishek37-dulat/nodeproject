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
  } from "../controllers/commentReplyController";
import Auth from "../middlewares/Auth";

const commentRouter = Router();

commentRouter.post("/addcomment", addComment);
commentRouter.post("/deletecomment", deleteComment);
commentRouter.get("/getallcomments", getAllComments);
commentRouter.post("/addreply", addReply);
commentRouter.post("/deletereply", deleteReply);
commentRouter.get("/getallreply", getAllReply);
export default commentRouter;
