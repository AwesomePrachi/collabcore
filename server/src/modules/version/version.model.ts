import mongoose from "mongoose"

const versionSchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
    },
    content: {
      type: Object,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const VersionModel = mongoose.model(
  "Version",
  versionSchema
)
