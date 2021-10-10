import postIdeaModel from "../models/postIdeaModel";
import { addItem, deleteItem, editItem, getAllItems } from "../utils";

// Idea-----------------------------------------

export const getAllIdea = async (_req, res) => {
  const populate = "name";
  await getAllItems(postIdeaModel, res, populate);
};

export const addIdea = async (req, res) => {
  const { createrid, title, content, uploaddate, image, comments } =
    req.body;
  const inputIdea = {
    createrid, 
    title, 
    content, 
    image, 
    uploaddate, 
    comments    
  };
  await addItem(postIdeaModel, inputIdea, res);
};

export const updateIdea = async (req, res) => {
  const index = req.params.id;
  const { updateIdeas } = req.body;
  await editItem(postIdeaModel, index, updateIdeas, res);
};

export const deleteIdea = async (req, res) => {
  const { id } = req.params;
  await deleteItem(postIdeaModel, id, res);
};



