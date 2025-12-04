import mongoose, { Schema, model } from "mongoose";

// Define user schema
const userSchema = new Schema(
  {
    name: { type: String, required: true, trim: true }, // Trim whitespace
    email: { type: String, required: true, unique: true, lowercase: true }, // Convert to lowercase
    password: { type: String, required: true },
    cartData: { type: Object, default: {} }, // Use 'Object' instead of 'object'
  },
  { minimize: false }
);

// Create user model
const User = model("User", userSchema);

export default User;