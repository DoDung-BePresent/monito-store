/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface ColorDocument extends Document {
  name: string;
  hexCode: string;
  description?: string;
  isActive: boolean;
}

const colorSchema = new Schema<ColorDocument>(
  {
    name: {
      type: String,
      required: [true, 'Color name is required'],
      unique: [true, 'Color name must be unique'],
      trim: true,
      maxLength: [50, 'Color name must be less than 50 characters'],
    },
    hexCode: {
      type: String,
      required: [true, 'Hex Code is required'],
      unique: [true, 'Hex Code must be unique'],
      trim: true,
      match: [/^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/, 'Invalid hex color code'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [200, 'Description must be less than 200 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  },
);

colorSchema.index({ name: 1 });
colorSchema.index({ isActive: 1 });

const ColorModel = mongoose.model<ColorDocument>('Color', colorSchema);
export default ColorModel;
