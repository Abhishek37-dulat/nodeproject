import ReplyModel from "../models/commentReplyModel";
import { addItem, deleteItem, editItem, getAllItems } from "../utils";


// reply------------------------------

export const getAllReply = async (_req, res) => {
    await getAllItems(ReplyModel, res);
  };
  
  export const addReply = async (req, res) => {
    const { commentid, userid, content, uploaddate } =
      req.body;
    const inputReply = {
        commentid, 
        userid, 
        content, 
        uploaddate
    };
    await addItem(ReplyModel, inputReply, res);
  };
  
  export const deleteReply = async (req, res) => {
    const { id } = req.params;
    await deleteItem(ReplyModel, id, res);
  };