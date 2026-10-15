import mongoose, { Document, Schema, Model } from 'mongoose';

export interface IUser extends Document {
  name?: string;
  phone?: string;
  email: string;
  emailNormalized: string;
  password?: string;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      trim: true,
      default: '',
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    email: {
      type: String,
      required: true,
      trim: true,
    },
    emailNormalized: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      trim: true,
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export const UserModel: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', userSchema);
