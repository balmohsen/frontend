const mongoose = require('mongoose');

const COCSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  submissionDate: { type: Date, default: Date.now },
  department: { type: String, required: true },
  comments: { type: String },
  agreeToTerms: { type: Boolean, required: true },
  submittedBy: { type: String }, // Username from JWT
}, { timestamps: true });

module.exports = mongoose.model('COC', COCSchema);
