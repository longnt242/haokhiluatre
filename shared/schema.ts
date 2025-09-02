import { z } from "zod";

export const uploadContentSchema = z.object({
  kind: z.enum(["image", "video", "model"]),
  file: z.any(), // File object
  title: z.string().optional(),
  password: z.string(),
});

export const uploadResponseSchema = z.object({
  ok: z.boolean(),
  kind: z.string(),
  url: z.string(),
  path: z.string(),
  message: z.string().optional(),
});

export type UploadContent = z.infer<typeof uploadContentSchema>;
export type UploadResponse = z.infer<typeof uploadResponseSchema>;

export interface StorageFile {
  name: string;
  id: string;
  updated_at: string;
  created_at: string;
  last_accessed_at: string;
  metadata: {
    eTag: string;
    size: number;
    mimetype: string;
    cacheControl: string;
    lastModified: string;
    contentLength: number;
    httpStatusCode: number;
  };
}
