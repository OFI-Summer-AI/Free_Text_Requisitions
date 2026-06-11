import { useState } from 'react';
import { Send, FileText, CheckCircle, AlertCircle, Loader, User, Mail, MapPin } from 'lucide-react';
import { submitBuyerRequisition } from '../../lib/api';
import { C } from '../../lib/colors';

const PLANTS = [
  'AR - IMEC LEUVEN',
  'VMO - VAN MOER',
  'FI01 – IMEC FINLAND',
  'PXR - NIPPON GASSES',
  'HOT - IMEC FINLAND',
  'ADI',
  'VZW',
];

const FIELD_LABEL = {
  fontSize: 12, fontWeight: 700, color: C.textSec,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8,
};

export default function BuyerRequisitionView() {
  const [form, setForm] = useState({
    description: '',
    buyer_name:  '',
    email:       '',
    plant:       '',
  });
  const [status, setStatus] = useState(null); // null | 'loading' | 'success' | 'error'
  const [errMsg, setErrMsg] = useState('');

  const set = (key, val) => {
    setForm(f => ({ ...f, [key]: val }));
    if (status) setStatus(null);
  };

  const isValid = form.description.trim() && form.buyer_name.trim() && form.email.trim() && form.plant;

  const handleSubmit = async () => {
    if (!isValid) return;
    setStatus('loading');
    setErrMsg('');
    try {
      await submitBuyerRequisition({
        description:      form.description.trim(),
        raw_body:         form.description.trim(),
        buyer_name:       form.buyer_name.trim(),
        sender:           form.buyer_name.trim(),
        email:            form.email.trim(),
        requester_email:  form.email.trim(),
        client_name:      form.plant,
        plant:            form.plant,
      });
      setStatus('success');
      setForm({ description: '', buyer_name: '', email: '', plant: '' });
    } catch (err) {
      setStatus('error');
      setErrMsg(err.message);
    }
  };

  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '32px 0' }}>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 28 }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: C.goldDim, border: `1px solid ${C.goldRing}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <FileText size={18} color={C.gold} />
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: C.textPri, margin: 0 }}>
            Buyer Requisition
          </h2>
          <p style={{ fontSize: 12, color: C.textSec, margin: 0 }}>
            Describe what you need in plain language — our system will process it automatically
          </p>
        </div>
      </div>

      {/* Form card */}
      <div style={{ background: C.surface, border: `1px solid ${C.border}`, borderRadius: 14, padding: '24px', display: 'flex', flexDirection: 'column', gap: 20 }}>

        {/* Request Description */}
        <div>
          <label style={FIELD_LABEL}>
            <FileText size={12} color={C.textSec} /> Request Description
          </label>
          <textarea
            value={form.description}
            onChange={e => set('description', e.target.value)}
            placeholder="e.g. I need 20 units of lab-grade isopropanol 5L for cleanroom use, required by end of next week. Preferred supplier is VWR International."
            rows={6}
            className="form-input"
            style={{ resize: 'vertical', lineHeight: 1.6, fontSize: 13 }}
          />
          <span style={{ fontSize: 11, color: C.muted, marginTop: 4, display: 'block' }}>
            {form.description.trim().length} characters
          </span>
        </div>

        {/* Two-col row: Name + Email */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>

          {/* Your Name */}
          <div>
            <label style={FIELD_LABEL}>
              <User size={12} color={C.textSec} /> Your Name
            </label>
            <input
              type="text"
              value={form.buyer_name}
              onChange={e => set('buyer_name', e.target.value)}
              placeholder="e.g. Jan De Smedt"
              className="form-input"
              style={{ fontSize: 13 }}
            />
          </div>

          {/* Your Email */}
          <div>
            <label style={FIELD_LABEL}>
              <Mail size={12} color={C.textSec} /> Your Email
            </label>
            <input
              type="email"
              value={form.email}
              onChange={e => set('email', e.target.value)}
              placeholder="e.g. jan.desmedt@imec.be"
              className="form-input"
              style={{ fontSize: 13 }}
            />
          </div>
        </div>

        {/* Plant / Location */}
        <div>
          <label style={FIELD_LABEL}>
            <MapPin size={12} color={C.textSec} /> Plant / Location
          </label>
          <select
            value={form.plant}
            onChange={e => set('plant', e.target.value)}
            className="form-input"
            style={{ fontSize: 13, cursor: 'pointer' }}
          >
            <option value="">Select a plant...</option>
            {PLANTS.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: C.border }} />

        {/* Submit row */}
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            className="btn btn-primary"
            onClick={handleSubmit}
            disabled={!isValid || status === 'loading'}
            style={{ gap: 8, minWidth: 200 }}
          >
            {status === 'loading'
              ? <><Loader size={14} style={{ animation: 'spin 1s linear infinite' }} /> Submitting...</>
              : <><Send size={14} /> Submit Requisition</>
            }
          </button>
        </div>

        {/* Feedback */}
        {status === 'success' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)',
            borderRadius: 8, padding: '12px 16px',
          }}>
            <CheckCircle size={16} color={C.green} />
            <span style={{ fontSize: 13, color: C.green, fontWeight: 600 }}>
              Requisition submitted successfully — your request is being processed.
            </span>
          </div>
        )}

        {status === 'error' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 10,
            background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
            borderRadius: 8, padding: '12px 16px',
          }}>
            <AlertCircle size={16} color={C.red} />
            <span style={{ fontSize: 13, color: C.red }}>
              Failed to submit: {errMsg || 'Please try again.'}
            </span>
          </div>
        )}
      </div>

      {/* Helper tips */}
      <div style={{ marginTop: 16, padding: '16px 20px', background: C.surface, border: `1px solid ${C.border}`, borderRadius: 10 }}>
        <p style={{ fontSize: 11, fontWeight: 700, color: C.textSec, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>
          Tips for a good requisition
        </p>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
          {[
            'Include the item name, quantity, and unit (e.g. "50 units of nitrogen gas cylinder 50L")',
            'Mention the preferred supplier or brand if known',
            'Specify urgency or required delivery date',
            'Add intended use or cost centre if relevant',
          ].map(tip => (
            <li key={tip} style={{ display: 'flex', gap: 8, fontSize: 12, color: C.textSec }}>
              <span style={{ color: C.gold, fontWeight: 700, flexShrink: 0 }}>·</span>
              {tip}
            </li>
          ))}
        </ul>
      </div>

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}
