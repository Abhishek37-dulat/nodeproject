import subpostIdeaModel from "../models/subpostIdeaModel";
import { addItem, deleteItem, editItem, getAllItems } from "../utils";


// SubIdea-----------------------------------------
export const getAllSubIdea = async (_req, res) => {
    const populate = "name";
    await getAllItems(subpostIdeaModel, res, populate);
  };
  
  export const addSubIdea = async (req, res) => {
    const { postid, userid, content, uploaddate, image, comments } =
      req.body;
    const inputItem = {
        postid, 
        userid, 
        content, 
        uploaddate, 
        image, 
        comments
    };
    await addItem(subpostIdeaModel, inputItem, res);
  };
  
  export const updateSubIdea = async (req, res) => {
    const index = req.params.id;
    const { updateItem } = req.body;
    await editItem(subpostIdeaModel, index, updateItem, res);
  };
  
  export const deleteSubIdea = async (req, res) => {
    const { id } = req.params;
    await deleteItem(subpostIdeaModel, id, res);
  };
  