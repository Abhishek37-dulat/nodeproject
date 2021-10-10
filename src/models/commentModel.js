import { model, Schema, Types } from "mongoose";

const commentSchema = new Schema(
  {
    postid:{
        type: String,
        required: true,  
    },
    subid: {
      type: String,
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    uploaddate: {
      type: Date,
      default: Date.now(),
    },
    comments:[{
        comment:{
            type: String,
            ref: 'reply',
        }
    }]
  },
  { timestamps: true }
);

const commentModel = model("comment", commentSchema);

export default commentModel;