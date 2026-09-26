import mongoose from 'mongoose';

// Field names are snake_case here while Product's are camelCase. That
// inconsistency is not a mistake - it is the contract the existing frontend
// already speaks (InquiryRecord in frontend/src/services/api/backend.ts reads
// company_name, product_id and created_at), and the frontend is frozen.
const inquirySchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'name is required'], trim: true },
    // Email is optional: every public form already requires a phone number,
    // and collecting a second mandatory contact channel is more than the
    // enquiry needs (DPDP Act 2023 s.6 - data minimisation).
    email: { type: String, trim: true, lowercase: true, default: '' },
    phone: { type: String, required: [true, 'phone is required'], trim: true },
    company_name: { type: String, trim: true },
    product_id: { type: String, trim: true },
    quantity: { type: String, trim: true },
    message: { type: String, required: [true, 'message is required'] },
    source: {
      type: String,
      required: [true, 'source is required'],
      enum: {
        values: ['contact', 'bulk', 'modal', 'quick_quote'],
        message: 'source must be one of contact, bulk, modal, quick_quote'
      }
    },
    status: {
      type: String,
      enum: {
        values: ['new', 'contacted', 'quoted', 'closed'],
        message: 'status must be one of new, contacted, quoted, closed'
      },
      default: 'new'
    },
    notes: { type: String },
    // DPDP Act 2023 s.6/s.7: consent must be free, specific, informed and
    // recorded. The route refuses submissions without it, and the timestamp
    // plus policy version let us prove what the person agreed to and when.
    consent_given: { type: Boolean, required: [true, 'consent is required'] },
    consent_at: { type: Date },
    consent_version: { type: String, trim: true }
  },
  {
    // The frontend sorts and displays `created_at`, so the timestamp is stored
    // under that name rather than Mongoose's default createdAt.
    timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' },
    strict: true,
    versionKey: false
  }
);

// Backs the 5-minute duplicate-submission check on POST /api/inquiries.
inquirySchema.index({ phone: 1, created_at: -1 });
// Backs the dashboard's default listing order.
inquirySchema.index({ created_at: -1 });
// Backs the dashboard's status-filtered lead views.
inquirySchema.index({ status: 1, created_at: -1 });
// Retention (DPDP Act 2023 s.8(7)): once a lead is closed it is purged 24
// months after its last update. Open leads are never touched - the partial
// filter keeps the TTL from deleting an enquiry that is still being worked.
inquirySchema.index(
  { updated_at: 1 },
  { expireAfterSeconds: 730 * 24 * 60 * 60, partialFilterExpression: { status: 'closed' } }
);

inquirySchema.set('toJSON', {
  transform(_doc, ret) {
    ret.id = String(ret._id);
    return ret;
  }
});

export const Inquiry = mongoose.models.Inquiry || mongoose.model('Inquiry', inquirySchema);
