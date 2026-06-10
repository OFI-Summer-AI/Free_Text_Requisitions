import { useState, useRef } from 'react';
import {
  Send, Sparkles, Trash2, Plus, FileText,
  CheckCircle, Clock, AlertCircle, ChevronDown, X,
} from 'lucide-react';

/* ── Submission history mock ───────────────────────────────── */
const STATUS_ICON = {
  pending:   <Clock   size={13} style={{ color: '#F59E0B' }} />,
  approved:  <CheckCircle size={13} style={{ color: '#22C55E' }} />,
  rejected:  <AlertCircle size={13} style={{ color: '#EF4444' }} />,
};

const INITIAL_HISTORY = [
  { id: 1, text: '50 units of 6" silicon wafers, 300 Ω·cm, double-side polished',  status: 'approved', date: '09 Jun 2026', category: 'Lab Equipment'   },
  { id: 2, text: 'Nitrogen gas cylinder, 99.999% purity, size T',                  status: 'pending',  date: '10 Jun 2026', category: 'Chemicals & Gases' },
  { id: 3, text: 'Anti-static gloves, size M, cleanroom class 10',                  status: 'rejected', date: '08 Jun 2026', category: 'PPE & Safety'      },
];

const SUGGESTIONS = [
  'Silicon wafers 6" 300 Ω·cm double-side polished',
  'Photoresist AZ1512 1L bottle',
  'HF acid 49% 2.5L bottle',
  'Cleanroom wipes 12"×12" box of 150',
  'Tweezers wafer grade ESD safe',
  'IPA 99.9% purity 4L',
];

export default function BuyerView() {
  const [text, setText]             = useState('');
  const [history, setHistory]       = useState(INITIAL_HISTORY);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted]   = useState(false);
  const [showSugg, setShowSugg]     = useState(false);
  const [charCount, setCharCount]   = useState(0);
  const [filterStatus, setFilter]   = useState('all');
  const textareaRef = useRef(null);

  const MAX_CHARS = 1000;

  const handleChange = (e) => {
    const val = e.target.value;
    if (val.length > MAX_CHARS) return;
    setText(val);
    setCharCount(val.length);
    setShowSugg(val.length > 0 && val.length < 30);
  };

  const handleSuggest = (s) => {
    setText(s);
    setCharCount(s.length);
    setShowSugg(false);
    textareaRef.current?.focus();
  };

  const handleSubmit = () => {
    if (!text.trim()) return;
    setSubmitting(true);
    setTimeout(() => {
      setHistory(prev => [{
        id: Date.now(),
        text: text.trim(),
        status: 'pending',
        date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
        category: 'Uncategorised',
      }, ...prev]);
      setText('');
      setCharCount(0);
      setSubmitting(false);
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    }, 1200);
  };

  const handleDelete = (id) => setHistory(prev => prev.filter(r => r.id !== id));

  const filtered = filterStatus === 'all'
    ? history
    : history.filter(r => r.status === filterStatus);

  return (
    <div className="buyer-view">

      {/* ── Header ─────────────────────────────────────────── */}
      <div className="buyer-view__header">
        <div className="buyer-view__header-left">
          <div className="buyer-view__header-icon">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="buyer-view__title">Buyer Requisition</h1>
            <p className="buyer-view__subtitle">Submit a free-text purchase requisition for review</p>
          </div>
        </div>
        <div className="buyer-view__badge">
          <Sparkles size={12} />
          AI-Assisted Matching
        </div>
      </div>

      {/* ── Composer Card ──────────────────────────────────── */}
      <div className="buyer-composer">
        <div className="buyer-composer__label">
          <FileText size={13} />
          New Requisition
        </div>

        <div className="buyer-composer__textarea-wrap">
          <textarea
            ref={textareaRef}
            className="buyer-composer__textarea"
            placeholder="Describe what you need to purchase…&#10;e.g. '100 units of 150mm p-type silicon wafers, 1-10 Ω·cm resistivity, single-side polished, grade prime'"
            value={text}
            onChange={handleChange}
            rows={6}
            onFocus={() => setShowSugg(charCount > 0 && charCount < 30)}
            onBlur={() => setTimeout(() => setShowSugg(false), 200)}
          />

          {/* Quick-suggest dropdown */}
          {showSugg && (
            <div className="buyer-suggest">
              <div className="buyer-suggest__label">
                <Sparkles size={11} /> Quick suggestions
              </div>
              {SUGGESTIONS.filter(s =>
                s.toLowerCase().includes(text.toLowerCase())
              ).slice(0, 5).map(s => (
                <button
                  key={s}
                  className="buyer-suggest__item"
                  onMouseDown={() => handleSuggest(s)}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer row */}
        <div className="buyer-composer__footer">
          <span className={`buyer-composer__charcount${charCount > MAX_CHARS * 0.9 ? ' buyer-composer__charcount--warn' : ''}`}>
            {charCount} / {MAX_CHARS}
          </span>
          <div className="buyer-composer__actions">
            <button
              className="btn btn-outline btn-sm"
              onClick={() => { setText(''); setCharCount(0); }}
              disabled={!text}
            >
              <Trash2 size={13} /> Clear
            </button>
            <button
              className={`btn btn-primary btn-sm buyer-composer__submit${submitting ? ' buyer-composer__submit--loading' : ''}`}
              onClick={handleSubmit}
              disabled={!text.trim() || submitting}
            >
              {submitting ? (
                <span className="buyer-spinner" />
              ) : submitted ? (
                <><CheckCircle size={13} /> Submitted!</>
              ) : (
                <><Send size={13} /> Submit Requisition</>
              )}
            </button>
          </div>
        </div>

        {/* Success toast */}
        {submitted && (
          <div className="buyer-toast">
            <CheckCircle size={15} />
            Requisition submitted successfully — pending AI matching &amp; approval.
          </div>
        )}
      </div>

      {/* ── History ────────────────────────────────────────── */}
      <div className="buyer-history">
        <div className="buyer-history__header">
          <h2 className="buyer-history__title">My Requisitions</h2>

          {/* Status filter */}
          <div className="buyer-filter">
            {['all', 'pending', 'approved', 'rejected'].map(f => (
              <button
                key={f}
                className={`buyer-filter__btn${filterStatus === f ? ' buyer-filter__btn--active' : ''}`}
                onClick={() => setFilter(f)}
              >
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="buyer-empty">
            <Plus size={28} style={{ color: 'var(--ofi-gold)' }} />
            <p>No requisitions {filterStatus !== 'all' ? `with status "${filterStatus}"` : 'yet'}.</p>
          </div>
        ) : (
          <div className="buyer-history__list">
            {filtered.map((req, i) => (
              <div
                key={req.id}
                className="buyer-req-card fade-in-up"
                style={{ animationDelay: `${i * 0.06}s` }}
              >
                <div className="buyer-req-card__left">
                  <div className={`buyer-req-card__status buyer-req-card__status--${req.status}`}>
                    {STATUS_ICON[req.status]}
                    {req.status.charAt(0).toUpperCase() + req.status.slice(1)}
                  </div>
                  <p className="buyer-req-card__text">{req.text}</p>
                  <div className="buyer-req-card__meta">
                    <span className="source-chip">{req.category}</span>
                    <span className="buyer-req-card__date">{req.date}</span>
                  </div>
                </div>
                <button
                  className="buyer-req-card__delete"
                  onClick={() => handleDelete(req.id)}
                  title="Remove"
                >
                  <X size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
