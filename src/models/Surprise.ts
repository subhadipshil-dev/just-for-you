import mongoose, { Schema, Document } from 'mongoose';

export interface ISurprise extends Document {
  shortId: string;
  receiverName: string;
  senderName?: string;
  customMessage?: string;
  imageUrl?: string;
  theme: 'cute' | 'dark' | 'minimal' | 'gradient';
  mode: 'default' | 'advanced';
  experienceType: 'fun' | 'serious';
  createdAt: Date;
  expiresAt: Date;
}

const SurpriseSchema: Schema = new Schema({
  shortId: { type: String, required: true, unique: true },
  receiverName: { type: String, required: true },
  senderName: { type: String },
  customMessage: { type: String },
  imageUrl: { type: String },
  theme: { 
    type: String, 
    enum: ['cute', 'dark', 'minimal', 'gradient'], 
    default: 'cute' 
  },
  mode: { 
    type: String, 
    enum: ['default', 'advanced'], 
    default: 'default' 
  },
  experienceType: {
    type: String,
    enum: ['fun', 'serious'],
    default: 'fun'
  },
  createdAt: { type: Date, default: Date.now },
  expiresAt: { 
    type: Date, 
    default: () => new Date(+new Date() + 24 * 60 * 60 * 1000) // 24 hours from now
  },
});

// Add index for auto-deletion
SurpriseSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.Surprise || mongoose.model<ISurprise>('Surprise', SurpriseSchema);
