import { type StorageFile } from "@shared/schema";

export interface IStorage {
  // No database storage needed - using Supabase Storage only
}

export class MemStorage implements IStorage {
  constructor() {
    // Minimal storage interface since we're using Supabase Storage directly
  }
}

export const storage = new MemStorage();
