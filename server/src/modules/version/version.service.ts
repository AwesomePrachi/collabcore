import { VersionModel } from "./version.model.js"

export async function createVersion(
  publicId: string,
  content: any
) {
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
