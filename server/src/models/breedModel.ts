/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface BreedDocument extends Document {
  name: string;
  description?: string;
  isActive: boolean;
}

const breedSchema = new Schema<BreedDocument>(
  {
    name: {
      type: String,
      required: [true, 'Breed name is required'],
      unique: [true, 'Breed name must be unique'],
      trim: true,
      maxLength: [50, 'Breed name must be less than 50 characters'],
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

breedSchema.index({ isActive: 1 });

const BreedModel = mongoose.model<BreedDocument>('Breed', breedSchema);
export default BreedModel;
