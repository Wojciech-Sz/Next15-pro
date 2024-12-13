import { model, Schema, models, Document } from "mongoose";

export interface IUser {
  name: string;
  username: string;
  email: string;
  password: string;
  image?: string;
  bio?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
}

export interface UserDocument extends IUser, Document {}

const UserSchema = new Schema<IUser>(
  {
    name: { type: String, required: true },
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: { type: String, required: false },
    bio: { type: String },
    location: { type: String },
    portfolio: { type: String },
    reputation: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);

export default User;
