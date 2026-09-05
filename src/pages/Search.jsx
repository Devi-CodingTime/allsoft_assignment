import React from 'react'
import { useState } from 'react';
import { searchDocumentEntry } from '../api/documentApi';
import { MAJOR_HEADS, minorHeadOptions } from '../mockData';
import TagInput from '../components/TagInput';
import FilePreviewModal from '../components/FilePreviewModal';
import { downloadAllAsZip, downloadSingleFile, guessFileName } from '../utils/download';

const emptyFilters = { majorHead: '', minorHead: '', fromDate: '', toDate: '', tags: [], keyword: '' };

function Search() {
   const [filters, setFilters] = useState(emptyFilters);
  const [results, setResults] = useState([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewDoc, setPreviewDoc] = useState(null);
  const [zipping, setZipping] = useState(false);
  const [zipProgress, setZipProgress] = useState(null);

  const minorOptions = minorHeadOptions(filters.majorHead);

  const updateField = (key, value) => {
    setFilters((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'majorHead') next.minorHead = '';
      return next;
    });
  };

  const runSearch = async (e) => {
    e?.preventDefault();
    setLoading(true); setError('');
    try {
      const payload = {
        major_head: filters.majorHead,
        minor_head: filters.minorHead,
        from_date: filters.fromDate ? toApiDate(filters.fromDate) : '',
        to_date: filters.toDate ? toApiDate(filters.toDate) : '',
        tags: filters.tags.map((tag_name) => ({ tag_name })),
        uploaded_by: '',
        start: 0,
        length: 25,
        filterId: '',
        search: { value: filters.keyword },
      };
      const res = await searchDocumentEntry(payload);
      const rows = res?.data?.data || res?.data?.documents || res?.data || [];
      setResults(Array.isArray(rows) ? rows : []);
      setHasSearched(true);
    } catch (err) { setError(err.message); setResults([]); }
    finally { setLoading(false); }
  };

  const clearFilters = () => { setFilters(emptyFilters); setResults([]); setHasSearched(false); setError(''); };

  const handleDownloadAll = async () => {
    setZipping(true); setZipProgress({ done: 0, total: results.length });
    try { await downloadAllAsZip(results, (done, total) => setZipProgress({ done, total })); }
    catch { setError('Could not build the ZIP archive.'); }
    finally { setZipping(false); setZipProgress(null); }
  };
  
  return (
  <div>
      <div className="card card-pad" style={{ marginBottom: 20 }}>
        <div className="eyebrow">Filters</div>
        <h2>Find a document</h2>
        <form onSubmit={runSearch}>
          <div className="row-2">
            <div className="field">
              <label htmlFor="majorHead">Category</label>
              <select id="majorHead" className="select" value={filters.majorHead} onChange={(e) => updateField('majorHead', e.target.value)}>
                <option value="">Any category</option>
                {MAJOR_HEADS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
            <div className="field">
              <label htmlFor="minorHead">{filters.majorHead === 'Personal' ? 'Name' : filters.majorHead === 'Professional' ? 'Department' : 'Name / Department'}</label>
              <select id="minorHead" className="select" value={filters.minorHead} onChange={(e) => updateField('minorHead', e.target.value)} disabled={!filters.majorHead}>
                <option value="">Any</option>
                {minorOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          <div className="row-2">
            <div className="field"><label htmlFor="fromDate">From date</label><input id="fromDate" type="date" className="input" value={filters.fromDate} onChange={(e) => updateField('fromDate', e.target.value)} /></div>
            <div className="field"><label htmlFor="toDate">To date</label><input id="toDate" type="date" className="input" value={filters.toDate} onChange={(e) => updateField('toDate', e.target.value)} /></div>
          </div>

          <div className="field">
            <label>Tags</label>
            <TagInput value={filters.tags} onChange={(tags) => updateField('tags', tags)} placeholder="Filter by tag…" />
          </div>

          <div className="field">
            <label htmlFor="keyword">Keyword</label>
            <input id="keyword" className="input" placeholder="Search remarks or file name…" value={filters.keyword} onChange={(e) => updateField('keyword', e.target.value)} />
          </div>

          <div style={{ display: 'flex', gap: 10 }}>
            <button type="submit" className="btn btn-primary" disabled={loading}>{loading && <span className="spinner" />} Search</button>
            <button type="button" className="btn btn-outline" onClick={clearFilters}>Clear filters</button>
          </div>
        </form>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {hasSearched && (
        <div className="card">
          <div className="card-header-row" style={{ padding: '18px 20px 0' }}>
            <h3 style={{ marginBottom: 0 }}>{results.length} {results.length === 1 ? 'result' : 'results'}</h3>
            {results.length > 0 && (
              <button className="btn btn-amber btn-sm" onClick={handleDownloadAll} disabled={zipping}>
                {zipping && <span className="spinner" />} {zipping ? `Zipping ${zipProgress?.done || 0}/${zipProgress?.total || 0}` : 'Download all as ZIP'}
              </button>
            )}
          </div>

          {results.length === 0 ? (
            <div className="empty-state"><h3>No documents matched</h3><p>Try widening the date range or removing a tag filter.</p></div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="dms-table">
                <thead><tr><th>File</th><th>Category</th><th>Date</th><th>Tags</th><th>Remarks</th><th></th></tr></thead>
                <tbody>
                  {results.map((doc, i) => (
                    <ResultRow key={doc.id || i} doc={doc} onPreview={() => setPreviewDoc(doc)} onDownload={() => downloadSingleFile(doc.file_url || doc.url, guessFileName(doc, i))} />
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <FilePreviewModal document={previewDoc} onClose={() => setPreviewDoc(null)} />
    </div>
  )
}

export default Search

function ResultRow({ doc, onPreview, onDownload }) {
  const isPdf = (doc.mime_type || doc.file_name || '').toLowerCase().includes('pdf');
  return (
    <tr>
      <td><div className="doc-file-cell"><div className={`doc-file-icon${isPdf ? ' pdf' : ''}`}>{isPdf ? 'PDF' : 'IMG'}</div><span>{doc.file_name || 'Untitled document'}</span></div></td>
      <td>{doc.major_head}{doc.minor_head ? ` · ${doc.minor_head}` : ''}</td>
      <td>{doc.document_date || '—'}</td>
      <td><div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>{(doc.tags || []).map((t, idx) => <span className="badge badge-teal" key={idx}>{typeof t === 'string' ? t : t.tag_name}</span>)}</div></td>
      <td>{doc.document_remarks || '—'}</td>
      <td><div style={{ display: 'flex', gap: 4 }}><button className="btn btn-ghost btn-sm" onClick={onPreview}>Preview</button><button className="btn btn-ghost btn-sm" onClick={onDownload}>Download</button></div></td>
    </tr>
  );
}

function toApiDate(iso) {
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}