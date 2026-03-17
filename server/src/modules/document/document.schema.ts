import { z } from "zod";

/**
 * Create Document Schema
 */
export const createDocumentSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title too long")
    .optional(),
});

/**
 * Update Document Schema
 */
export const updateDocumentSchema = z.object({
  title: z
    .string()
    .min(1, "Title cannot be empty")
    .max(200, "Title too long")
    .optional(),
  content: z.string().optional(),
});

/**
 * Route Param Validation (publicId)
 */
export const documentParamSchema = z.object({
  id: z.string().min(1, "Document ID is required"),
});