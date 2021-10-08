import { model, Schema } from "mongoose";

const PasswordResetSchema = new Schema({
  userId: String,
  resetString: String,
  createdAt: Date,
  expiresAt: Date,
});

const PasswordReset = model("PasswordReset", PasswordResetSchema);

module.exports = PasswordReset;