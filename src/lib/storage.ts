/**
 * storage.ts — stub para modo local.
 * Upload de arquivos não disponível no modo local.
 * Logos podem ser armazenados como base64 no localStorage via savePartnerLogo().
 */

export async function uploadToPartnerDocuments(
  _filePath: string,
  _file: File
): Promise<{ path: string; error: Error | null }> {
  return { path: '', error: new Error("Upload de arquivos não disponível no modo local") };
}

export async function getSignedUrl(_path: string, _expiresIn?: number): Promise<string | null> {
  return null;
}

export function getPublicUrl(path: string): string {
  // If stored as base64 in localStorage, return it directly
  if (path.startsWith('data:')) return path;
  const stored = localStorage.getItem('prm_file_' + path);
  return stored || '';
}

export async function deleteFromStorage(path: string): Promise<boolean> {
  localStorage.removeItem('prm_file_' + path);
  return true;
}

export async function listFiles(_prefix: string) {
  return [];
}

export async function ensureStorageBucketExists(): Promise<boolean> {
  return true;
}

/** Save a logo as base64 in localStorage */
export async function saveLogoBase64(partnerId: string, file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const base64 = reader.result as string;
      const path = `logo_${partnerId}`;
      localStorage.setItem('prm_file_' + path, base64);
      resolve(base64);
    };
    reader.onerror = () => reject(new Error("Erro ao ler arquivo"));
    reader.readAsDataURL(file);
  });
}
