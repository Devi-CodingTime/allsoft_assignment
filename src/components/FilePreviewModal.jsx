export default function FilePreviewModal({ document, onClose }) {
  if (!document) return null;
  const url = document.file_url || document.url || '';
  const isPdf = (document.mime_type || url).toLowerCase().includes('pdf');
  const isImage = /\.(png|jpe?g|webp|gif)$/i.test(url) || (document.mime_type || '').startsWith('image');

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <strong>{document.file_name || 'Document preview'}</strong>
            <div style={{ fontSize: '0.75rem', color: 'var(--slate)' }}>{document.major_head} · {document.minor_head}</div>
          </div>
          <button className="modal-close" onClick={onClose} aria-label="Close preview">×</button>
        </div>
        <div className="modal-body">
          {url && isPdf ? (
            <iframe className="preview-frame" src={url} title="PDF preview" />
          ) : url && isImage ? (
            <img src={url} alt={document.file_name || 'document'} style={{ width: '100%', borderRadius: 6 }} />
          ) : (
            <div className="empty-state"><h3>Preview not available</h3><p>This file type can't be previewed here. Download it to view the full contents.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}