import mongoose from "mongoose";

const pasteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
      trim: true,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    maxViews: {
      type: Number,
      default: null,
    },
    viewCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export const Paste = mongoose.model("Paste", pasteSchema);
