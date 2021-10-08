import { Router } from "express";
import {
  addIdea, 
  updateIdea, 
  deleteIdea, 
  getAllIdea, 
  addSubIdea,
  updateSubIdea, 
  deleteSubIdea, 
  getAllSubIdea, 
} from "../controllers/userController";
import Auth from "../middlewares/Auth";

const postideaRouter = Router();

postideaRouter.post("/addidea",Auth, addIdea);
postideaRouter.post("/updateidea",Auth, updateIdea);
postideaRouter.post("/deleteidea",Auth, deleteIdea);
postideaRouter.get("/getallidea",Auth, getAllIdea);
postideaRouter.post("/addsubidea",Auth, addSubIdea);
postideaRouter.post("/updatesubidea",Auth, updateSubIdea);
postideaRouter.post("/deletesubidea",Auth, deleteSubIdea);
postideaRouter.get("/getallsubidea",Auth, getAllSubIdea);
export default postideaRouter;
