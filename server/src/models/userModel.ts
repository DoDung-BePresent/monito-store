/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

/**
 * Utils
 */
import { comparePassword, hashPassword } from '../utils/bcryptjs';

export interface UserDocument extends Document {
  name: string;
  email: string;
  password: string;
  avatarUrl: string | null;
  role: 'admin' | 'staff' | 'customer';
  isActive: boolean;
  lastLogin: Date | null;
  comparePassword(value: string): Promise<boolean>;
}

const userSchema = new Schema<UserDocument>(
  {
    name: {
      type: String,
      trim: true,
      required: [true, 'Username is required'],
      maxLength: [50, 'Username must be less than 50 characters'],
      unique: [true, 'Username must be unique'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: [true, 'Email must be unique'],
      maxLength: [50, 'Email must be less than 50 characters'],
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      trim: true,
    },
    avatarUrl: {
      type: String,
      trim: true,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    role: {
      type: String,
      required: [true, 'Role is required'],
      enum: {
        values: ['admin', 'staff', 'customer'],
        message: '{VALUE} is not supported',
      },
      default: 'customer',
    },
    lastLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
      },
    },
    methods: {
      comparePassword(value: string) {
        return comparePassword(value, this.password);
      },
    },
  },
);

userSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    if (this.password) {
      this.password = await hashPassword(this.password);
    }
  }
  next();
});

const UserModel = mongoose.model<UserDocument>('User', userSchema);
export default UserModel;
