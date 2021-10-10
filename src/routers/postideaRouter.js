import { Router } from "express";
import {
  addIdea, 
  updateIdea, 
  deleteIdea, 
  getAllIdea,  
} from "../controllers/postController";
import {
  addSubIdea,
  updateSubIdea, 
  deleteSubIdea, 
  getAllSubIdea, 
} from "../controllers/postSubideaController";
import Auth from "../middlewares/Auth";

const postideaRouter = Router();

postideaRouter.post("/addidea", addIdea);
postideaRouter.post("/updateidea", updateIdea);
postideaRouter.post("/deleteidea", deleteIdea);
postideaRouter.get("/getallidea", getAllIdea);
postideaRouter.post("/addsubidea", addSubIdea);
postideaRouter.post("/updatesubidea", updateSubIdea);
postideaRouter.post("/deletesubidea", deleteSubIdea);
postideaRouter.get("/getallsubidea", getAllSubIdea);
export default postideaRouter;
