import { DocumentModel } from "./document.model.js"
import { nanoid } from "nanoid"


export const createDocument = async (title?: string, ownerId?: string) => {

  const document = await DocumentModel.create({
    publicId: nanoid(10),
    title: title || "Untitled Document",
    ownerId: ownerId || undefined,
  });

  return document;
};


export const getDocumentByPublicId = async (
  publicId: string
) => {

  return DocumentModel.findOne({ publicId })

}


export const updateDocument = async (
  publicId: string,
  data: { title?: string; content?: string }
) => {

  return DocumentModel.findOneAndUpdate(
    { publicId },
    data,
    { new: true }
  )

}

export const updateDocumentForOwner = async (
  publicId: string,
  ownerId: string,
  data: { title?: string; content?: string }
) => {
  return DocumentModel.findOneAndUpdate(
    { publicId, ownerId },
    data,
    { new: true }
  )
}


export const getDocuments = async (ownerId: string) => {

  return DocumentModel
    .find({ ownerId })
    .sort({ updatedAt: -1 })
    .limit(50)
    .select("publicId title updatedAt")
    .lean()
}

export const deleteDocument = async (publicId: string, ownerId: string) => {
  return DocumentModel.findOneAndDelete({ publicId, ownerId })
}