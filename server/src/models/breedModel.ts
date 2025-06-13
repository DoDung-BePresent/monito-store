/**
 * Node modules
 */
import mongoose, { Document, Schema } from 'mongoose';

export interface BreedDocument extends Document {
  name: string;
  description?: string;
  isActive: boolean;
  createdBy: mongoose.Types.ObjectId;
}

const breedSchema = new Schema<BreedDocument>(
  {
    name: {
      type: String,
      required: [true, 'Breed name is required'],
      unique: true,
      trim: true,
      maxLength: [100, 'Breed name must be less than 100 characters'],
    },
    description: {
      type: String,
      trim: true,
      maxLength: [500, 'Description must be less than 500 characters'],
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Creator is required'],
    },
  },
  {
    timestamps: true,
  },
);

breedSchema.index({ name: 1 });
breedSchema.index({ isActive: 1 });

const BreedModel = mongoose.model<BreedDocument>('Breed', breedSchema);
export default BreedModel;
