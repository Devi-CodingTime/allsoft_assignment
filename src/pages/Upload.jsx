import React from 'react'
import { useRef, useState } from 'react';
import { saveDocumentEntry } from '../api/documentApi';
import { useAuth } from '../context/AuthContext';
import { MAJOR_HEADS, minorHeadOptions } from '../mockData';
import TagInput from '../components/TagInput';

const ACCEPTED_TYPES = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
const MAX_SIZE_MB = 10;
const emptyForm = { documentDate: new Date().toISOString().slice(0, 10), majorHead: '', minorHead: '', tags: [], remarks: '' };

function Upload() {
  const { userId } = useAuth();
  const [form, setForm] = useState(emptyForm);
  const [file, setFile] = useState(null);
  const [fileError, setFileError] = useState('');
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const minorOptions = minorHeadOptions(form.majorHead);

  const validateFile = (candidate) => {
    if (!candidate) return 'Please choose a file to upload.';
    if (!ACCEPTED_TYPES.includes(candidate.type)) return 'Only image (PNG/JPG/WEBP) and PDF files are allowed.';
    if (candidate.size > MAX_SIZE_MB * 1024 * 1024) return `File must be smaller than ${MAX_SIZE_MB}MB.`;
    return '';
  };

  const handleFileChosen = (candidate) => {
    const err = validateFile(candidate);
    setFileError(err);
    setFile(err ? null : candidate);
  };

  const handleDrop = (e) => { e.preventDefault(); setDragOver(false); handleFileChosen(e.dataTransfer.files?.[0]); };

  const updateField = (key, value) => {
    setForm((prev) => {
      const next = { ...prev, [key]: value };
      if (key === 'majorHead') next.minorHead = '';
      return next;
    });
  };

  const validateForm = () => {
    const errs = {};
    if (!form.documentDate) errs.documentDate = 'Required';
    if (!form.majorHead) errs.majorHead = 'Required';
    if (!form.minorHead) errs.minorHead = 'Required';
    const fileErr = validateFile(file);
    if (fileErr) setFileError(fileErr);
    setFormErrors(errs);
    return Object.keys(errs).length === 0 && !fileErr;
  };

  const resetForm = () => {
    setForm(emptyForm); setFile(null); setFileError(''); setFormErrors({});
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus(null);
    if (!validateForm()) return;

    const [y, m, d] = form.documentDate.split('-');
    const metadata = {
      major_head: form.majorHead,
      minor_head: form.minorHead,
      document_date: `${d}-${m}-${y}`,
      document_remarks: form.remarks,
      tags: form.tags.map((tag_name) => ({ tag_name })),
      user_id: userId || 'guest',
    };

    setSubmitting(true);
    try {
      await saveDocumentEntry(file, metadata);
      setStatus({ type: 'success', message: 'Document uploaded and filed successfully.' });
      resetForm();
    } catch (err) { setStatus({ type: 'error', message: err.message }); }
    finally { setSubmitting(false); }
  }
  return (
    <div className="row-2" style={{ alignItems: 'start' }}>
      <div className="card card-pad">
        <div className="eyebrow">New entry</div>
        <h2>Document details</h2>
        <p>Tell us what this is and where it belongs — the file gets tagged and indexed for search.</p>

        {status && <div className={`alert ${status.type === 'success' ? 'alert-success' : 'alert-danger'}`}>{status.message}</div>}

        <form onSubmit={handleSubmit} noValidate>
          <div className="row-2">
            <div className="field">
              <label htmlFor="documentDate">Document date</label>
              <input id="documentDate" type="date" className={`input${formErrors.documentDate ? ' invalid' : ''}`} value={form.documentDate} onChange={(e) => updateField('documentDate', e.target.value)} />
            </div>
            <div className="field">
              <label htmlFor="majorHead">Category</label>
              <select id="majorHead" className={`select${formErrors.majorHead ? ' invalid' : ''}`} value={form.majorHead} onChange={(e) => updateField('majorHead', e.target.value)}>
                <option value="">Select category</option>
                {MAJOR_HEADS.map((h) => <option key={h} value={h}>{h}</option>)}
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="minorHead">{form.majorHead === 'Personal' ? 'Name' : form.majorHead === 'Professional' ? 'Department' : 'Name / Department'}</label>
            <select id="minorHead" className={`select${formErrors.minorHead ? ' invalid' : ''}`} value={form.minorHead} onChange={(e) => updateField('minorHead', e.target.value)} disabled={!form.majorHead}>
              <option value="">{form.majorHead ? 'Select an option' : 'Choose a category first'}</option>
              {minorOptions.map((opt) => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>

          <div className="field">
            <label>Tags</label>
            <TagInput value={form.tags} onChange={(tags) => updateField('tags', tags)} />
            <p className="field-hint">Start typing to reuse an existing tag, or add a new one.</p>
          </div>

          <div className="field">
            <label htmlFor="remarks">Remarks</label>
            <textarea id="remarks" className="input" value={form.remarks} onChange={(e) => updateField('remarks', e.target.value)} placeholder="Any notes about this document…" />
          </div>

          <div className="field">
            <label>File</label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current?.click()}
              style={{ border: `1.5px dashed ${dragOver ? 'var(--teal)' : 'var(--line)'}`, borderRadius: 8, padding: '22px 16px', textAlign: 'center', cursor: 'pointer', background: dragOver ? 'var(--teal-tint)' : 'transparent', transition: 'all 0.15s ease' }}
            >
              <input ref={fileInputRef} type="file" accept=".pdf,image/png,image/jpeg,image/webp" style={{ display: 'none' }} onChange={(e) => handleFileChosen(e.target.files?.[0])} />
              {file ? (
                <div><strong>{file.name}</strong><div style={{ fontSize: '0.78rem', color: 'var(--slate)' }}>{(file.size / 1024).toFixed(0)} KB · click to replace</div></div>
              ) : (
                <div><div style={{ fontWeight: 600 }}>Drop a file here, or click to browse</div><div style={{ fontSize: '0.78rem', color: 'var(--slate)' }}>PDF, PNG, JPG or WEBP · up to {MAX_SIZE_MB}MB</div></div>
              )}
            </div>
            {fileError && <p className="field-hint" style={{ color: 'var(--danger)' }}>{fileError}</p>}
          </div>

          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting && <span className="spinner" />} Upload document
          </button>
        </form>
      </div>

      <div className="card card-pad">
        <div className="eyebrow">Preview</div>
        <h2>How this will be filed</h2>
        <table className="dms-table">
          <tbody>
            <tr><td style={{ color: 'var(--slate)', width: '38%' }}>Date</td><td>{formatDisplayDate(form.documentDate)}</td></tr>
            <tr><td style={{ color: 'var(--slate)' }}>Category</td><td>{form.majorHead || '—'}</td></tr>
            <tr><td style={{ color: 'var(--slate)' }}>{form.majorHead === 'Personal' ? 'Name' : 'Department'}</td><td>{form.minorHead || '—'}</td></tr>
            <tr>
              <td style={{ color: 'var(--slate)' }}>Tags</td>
              <td>{form.tags.length ? <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>{form.tags.map((t) => <span className="badge badge-teal" key={t}>{t}</span>)}</div> : '—'}</td>
            </tr>
            <tr><td style={{ color: 'var(--slate)' }}>File</td><td>{file ? file.name : '—'}</td></tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Upload

function formatDisplayDate(iso) {
  if (!iso) return '—';
  const [y, m, d] = iso.split('-');
  return `${d}-${m}-${y}`;
}