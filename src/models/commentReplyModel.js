import { model, Schema, Types } from "mongoose";

const ReplySchema = new Schema(
  {
    commentid:{
        type: String,
        required: true,  
    },
    userid: {
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
  },
  { timestamps: true }
);

const ReplyModel = model("reply", ReplySchema);

export default ReplyModel;