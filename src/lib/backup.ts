import { collection, getDocs, doc, setDoc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

/** Collections that are fully backed up / restored. */
export const BACKUP_COLLECTIONS = [
  'products',
  'categories',
  'banners',
  'coupons',
  'orders',
  'users',
] as const;

export interface BackupFile {
  app: string;
  version: number;
  exportedAt: string;
  settings: Record<string, any> | null;
  collections: Record<string, Array<{ id: string; data: any }>>;
}

/** Read every backup collection + the settings doc and build a single JSON object. */
export async function exportAllData(): Promise<BackupFile> {
  const collections: BackupFile['collections'] = {};
  for (const name of BACKUP_COLLECTIONS) {
    const snap = await getDocs(collection(db, name));
    collections[name] = snap.docs.map(d => ({ id: d.id, data: d.data() }));
  }
  const settingsSnap = await getDoc(doc(db, 'settings', 'app'));
  return {
    app: 'ecommerce-backup',
    version: 1,
    exportedAt: new Date().toISOString(),
    settings: settingsSnap.exists() ? settingsSnap.data() : null,
    collections,
  };
}

/** Trigger a browser download of the backup JSON. */
export async function downloadBackup() {
  const data = await exportAllData();
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
  a.download = `backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
  return data;
}

export interface ImportResult {
  written: number;
  collections: Record<string, number>;
  settings: boolean;
}

/** Restore documents from a parsed backup file. Existing docs with same id are overwritten. */
export async function importAllData(backup: BackupFile): Promise<ImportResult> {
  if (!backup || !backup.collections) throw new Error('Invalid backup file');
  const result: ImportResult = { written: 0, collections: {}, settings: false };

  for (const name of BACKUP_COLLECTIONS) {
    const docs = backup.collections[name];
    if (!Array.isArray(docs)) continue;
    let count = 0;
    for (const entry of docs) {
      if (!entry?.id) continue;
      await setDoc(doc(db, name, entry.id), entry.data ?? {}, { merge: true });
      count++;
      result.written++;
    }
    result.collections[name] = count;
  }

  if (backup.settings) {
    await setDoc(doc(db, 'settings', 'app'), backup.settings, { merge: true });
    result.settings = true;
  }
  return result;
}
