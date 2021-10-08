import { model, Schema } from "mongoose";

const userSchema = new Schema(
   {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["user","member","admin"],
      default: "user",
    },
    status: {
      type: String,
      enum: ["public", "private"],
      default: "public",
    },
    profilePicture: String,
    uploaddate: {
        type: Date,
        default: Date.now(),
    },
    verified: {
      type: Boolean,
    }
  },
  { timestamps: true }
);

const userModel = model("user", userSchema);

export default userModel;
