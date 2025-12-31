const mongoose = require("mongoose");

const articleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    originalContent: { type: String, required: true },
    updatedContent: { type: String, default: "" },
    sourceUrl: { type: String },
    publishedDate: { type: Date },
    isUpdated: { type: Boolean, default: false },
    references: { type: [String], default: [] }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
