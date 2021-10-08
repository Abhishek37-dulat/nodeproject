import { model, Schema, Types } from "mongoose";

const subpostIdeaSchema = new Schema(
  {
    postid:{
        type: String,
        required: true,  
    },
    userid:{
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

const subpostIdeaModel = model("subpostidea", subpostIdeaSchema);

export default subpostIdeaModel;