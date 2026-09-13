import mongoose, { type Model, Schema } from "mongoose";

/**
 * User document interface
 */
export interface IUser {
  email: string;
  name?: string | null;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * User schema definition
 */
const userSchema = new Schema<IUser>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    name: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
  },
  {
    timestamps: true,
  }
);

/**
 * User model
 */
const User =
  (mongoose.models.User as Model<IUser> | undefined) ??
  mongoose.model<IUser>("User", userSchema);

export default User;
