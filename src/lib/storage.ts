// Simple in-memory storage for surprises
// This will persist as long as the server is running.

export interface SurpriseData {
  shortId: string;
  receiverName: string;
  senderName?: string;
  customMessage?: string;
  theme: string;
  mode: string;
  experienceType: 'fun' | 'serious';
  expiresAt: Date;
}

// Using a global variable to persist across HMR in development if possible
const globalForStorage = global as unknown as {
  surprises: Map<string, SurpriseData>;
};

export const surprises = globalForStorage.surprises || new Map<string, SurpriseData>();

if (process.env.NODE_ENV !== 'production') {
  globalForStorage.surprises = surprises;
}

export function saveSurprise(data: SurpriseData) {
  surprises.set(data.shortId, data);
}

export function getSurprise(id: string) {
  const surprise = surprises.get(id);
  if (!surprise) return null;

  // Check for expiry
  if (new Date() > surprise.expiresAt) {
    surprises.delete(id);
    return null;
  }

  return surprise;
}
