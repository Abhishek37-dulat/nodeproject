import { model, Schema, Types } from "mongoose";

const postIdeaSchema = new Schema(
  {
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
    image: {
      type: String
    },
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