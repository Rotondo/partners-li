import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const BUCKET_NAME = 'partner-documents';

/**
 * Upload a file to partner-documents bucket
 * Structure: {user_id}/{category}/{filename}
 */
export async function uploadToPartnerDocuments(
  filePath: string, 
  file: File
): Promise<{ path: string; error: Error | null }> {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      throw new Error("Usuário não autenticado");
    }

    // Ensure path includes user_id for RLS
    const fullPath = `${user.id}/${filePath}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(fullPath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error("Upload error:", error);
      throw error;
    }

    return { path: data.path, error: null };
  } catch (error) {
    console.error("Error in uploadToPartnerDocuments:", error);
    return { 
      path: '', 
      error: error instanceof Error ? error : new Error("Erro desconhecido ao fazer upload") 
    };
  }
}

/**
 * Get a signed URL for a private file
 * Use this for secure downloads from private bucket
 */
export async function getSignedUrl(path: string, expiresIn: number = 3600): Promise<string | null> {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .createSignedUrl(path, expiresIn);

    if (error) {
      console.error("Error creating signed URL:", error);
      toast.error("Erro ao gerar link de download");
      return null;
    }

    return data.signedUrl;
  } catch (error) {
    console.error("Error in getSignedUrl:", error);
    toast.error("Erro ao gerar link de download");
    return null;
  }
}

/**
 * Get public URL for a file
 * Note: Only use if bucket is public. Otherwise use getSignedUrl()
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage
    .from(BUCKET_NAME)
    .getPublicUrl(path);
  
  return data.publicUrl;
}

/**
 * Delete a file from storage
 */
export async function deleteFromStorage(path: string): Promise<boolean> {
  try {
    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([path]);

    if (error) {
      console.error("Error deleting file:", error);
      toast.error("Erro ao deletar arquivo");
      return false;
    }

    return true;
  } catch (error) {
    console.error("Error in deleteFromStorage:", error);
    toast.error("Erro ao deletar arquivo");
    return false;
  }
}

/**
 * List files in a directory
 */
export async function listFiles(prefix: string) {
  try {
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .list(prefix, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      });

    if (error) {
      console.error("Error listing files:", error);
      return [];
    }

    return data || [];
  } catch (error) {
    console.error("Error in listFiles:", error);
    return [];
  }
}

/**
 * Ensure storage bucket exists and create if needed
 * Call this on app initialization
 */
export async function ensureStorageBucketExists(): Promise<boolean> {
  try {
    // Check if bucket exists
    const { data: buckets } = await supabase.storage.listBuckets();
    const bucketExists = buckets?.some(b => b.name === BUCKET_NAME);

    if (!bucketExists) {
      console.log("Creating partner-documents bucket...");
      
      // Create bucket via client (not migration)
      const { error } = await supabase.storage.createBucket(BUCKET_NAME, {
        public: false,
        fileSizeLimit: 52428800, // 50MB
        allowedMimeTypes: [
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'image/jpeg',
          'image/png',
          'image/webp',
          'text/plain'
        ]
      });

      if (error) {
        console.error("Error creating bucket:", error);
        return false;
      }

      toast.success("Bucket de documentos criado com sucesso");
    }

    return true;
  } catch (error) {
    console.error("Error ensuring bucket exists:", error);
    return false;
  }
}
