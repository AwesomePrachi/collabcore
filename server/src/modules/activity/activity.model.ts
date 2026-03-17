import mongoose from "mongoose"

const activitySchema = new mongoose.Schema(
  {
    publicId: {
      type: String,
      required: true,
    },
    userId: {
      type: String,
      required: true,
    },
    action: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

export const ActivityModel = mongoose.model(
  "Activity",
  activitySchema
)