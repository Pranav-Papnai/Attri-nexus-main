import mongoose from 'mongoose';

// One document per (limiter, client, fixed window). Shared by every server
// instance, so limits hold on serverless platforms and survive restarts.
const rateLimitHitSchema = new mongoose.Schema(
  {
    _id: { type: String },
    hits: { type: Number, default: 0 },
    expiresAt: { type: Date, required: true }
  },
  { versionKey: false }
);

rateLimitHitSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const RateLimitHit = mongoose.models.RateLimitHit || mongoose.model('RateLimitHit', rateLimitHitSchema);
