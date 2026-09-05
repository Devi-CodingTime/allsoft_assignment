import { useEffect, useRef, useState } from 'react';
import { fetchDocumentTags } from '../api/documentApi';

export default function TagInput({ value, onChange, placeholder = 'Add a tag and press Enter' }) {
  const [inputValue, setInputValue] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const debounceRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setShowSuggestions(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      try {
        const res = await fetchDocumentTags(inputValue);
        const raw = res?.data?.data || res?.data?.tags || res?.data || [];
        const names = (Array.isArray(raw) ? raw : [])
          .map((t) => (typeof t === 'string' ? t : t.tag_name || t.label || ''))
          .filter(Boolean)
          .filter((name) => !value.includes(name));
        setSuggestions(names.slice(0, 8));
      } catch { setSuggestions([]); }
    }, 250);
    return () => clearTimeout(debounceRef.current);
  }, [inputValue]);

  const addTag = (tag) => {
    const clean = tag.trim();
    if (!clean || value.includes(clean)) return;
    onChange([...value, clean]);
    setInputValue('');
    setShowSuggestions(false);
  };
  const removeTag = (tag) => onChange(value.filter((t) => t !== tag));

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); addTag(inputValue); }
    else if (e.key === 'Backspace' && !inputValue && value.length) removeTag(value[value.length - 1]);
  };

  return (
    <div className="tag-suggestions" ref={wrapRef}>
      <div className="tag-input-shell">
        {value.map((tag) => (
          <span className="chip" key={tag}>
            {tag}
            <button type="button" onClick={() => removeTag(tag)} aria-label={`Remove ${tag}`}>×</button>
          </span>
        ))}
        <input
          value={inputValue}
          placeholder={value.length ? '' : placeholder}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onKeyDown={handleKeyDown}
        />
      </div>
      {showSuggestions && suggestions.length > 0 && (
        <div className="tag-suggestions-list">
          {suggestions.map((s) => (
            <button type="button" key={s} onClick={() => addTag(s)}>{s}</button>
          ))}
        </div>
      )}
    </div>
  );
}