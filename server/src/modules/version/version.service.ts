import { VersionModel } from "./version.model.js"

export async function createVersion(
  publicId: string,
  content: any
) {
  const latest = await VersionModel.findOne({ publicId }).sort({ createdAt: -1 })
  const now = Date.now()

  // If the latest version was created within the last 30 minutes, 
  // just update its content so we don't spam the database
  if (latest && (now - latest.createdAt.getTime() < 30 * 60 * 1000)) {
    latest.content = content
    return latest.save()
  }

  // Otherwise, create a new 30-minute block
  return VersionModel.create({
    publicId,
    content,
  })
}

export async function getVersions(publicId: string) {
  return VersionModel
    .find({ publicId })
    .sort({ createdAt: -1 })
    .limit(20)
}
