import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export function guessFileName(doc, index = 0) {
  if (doc.file_name) return doc.file_name;
  const ext = (doc.mime_type || '').includes('pdf') ? 'pdf' : 'jpg';
  return `document-${doc.id || index}.${ext}`;
}

export async function downloadSingleFile(url, fileName) {
    console.log('Downloading file:', url, 'as', fileName);
  const response = await fetch(url);
  if (!response.ok) throw new Error('Could not download this file.');
  const blob = await response.blob();
  saveAs(blob, fileName);
}

export async function downloadAllAsZip(documents, onProgress) {
  const zip = new JSZip();
  let completed = 0;
  await Promise.all(documents.map(async (doc, i) => {
    try {
      const response = await fetch(doc.file_url || doc.url);
      if (response.ok) zip.file(guessFileName(doc, i), await response.blob());
    } catch { /* skip a file that fails to fetch rather than aborting the archive */ }
    finally { completed += 1; onProgress?.(completed, documents.length); }
  }));
  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `documents-${new Date().toISOString().slice(0, 10)}.zip`);
}