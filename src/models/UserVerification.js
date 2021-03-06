import { model, Schema } from "mongoose";

const UserVerificationSchema = new Schema(
   {
    userId: {
      type: String,
    },
    uniqueString: {
      type: String,
    },
    createdAt: {
        type: Date,
    },
    expiresAt:{
        type: Date,
    }
  }
);

const UserVerification = model("UserVerification", UserVerificationSchema);

export default UserVerification;
