import { model, Schema, Types } from "mongoose";

const postIdeaSchema = new Schema(
  {
    createrid:{
        type: String,
        required: true,  
    },
    title: {
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
    image: String,
    comments:[{
        comment:{
            type: String,
            ref: 'comment',
        }
    }]
  },
  { timestamps: true }
);

const postIdeaModel = model("postidea", postIdeaSchema);

export default postIdeaModel;