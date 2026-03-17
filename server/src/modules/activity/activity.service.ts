import { ActivityModel } from "./activity.model.js"

export const createActivity = async (
  publicId: string,
  userId: string,
  action: string
) => {
  return ActivityModel.create({
    publicId,
    userId,
    action,
  })
}

export const getActivities = async (publicId: string) => {
  return ActivityModel
    .find({ publicId })
    .sort({ createdAt: -1 })
    .limit(20)
}