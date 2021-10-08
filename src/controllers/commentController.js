import commentModel from "../models/commentModel";
import { addItem, deleteItem, editItem, getAllItems } from "../utils";


// comment-----------------------------------------

export const getAllComments = async (_req, res) => {
    await getAllItems(commentModel, res);
  };
  
  export const addComment = async (req, res) => {
    const { postid, subid, userid, content, uploaddate, comments } =
      req.body;
    const inputComment = {
        postid, 
        subid, 
        userid, 
        content, 
        uploaddate, 
        comments
    };
    await addItem(commentModel, inputComment, res);
  };
  
  export const deleteComment = async (req, res) => {
    const { id } = req.params;
    await deleteItem(commentModel, id, res);
  };
