import { useState, useEffect } from 'react';
import { Bell, Download, LayoutGrid, RefreshCw } from 'lucide-react';
import { fetchDashboard } from './lib/api';
import OverviewView  from './components/views/OverviewView';
import FreeTextView  from './components/views/FreeTextView';
import SuggestionsView from './components/views/SuggestionsView';
import BuyerRequisitionView from './components/views/BuyerRequisitionView';

const TABS = [
  { id: 'overview',     label: 'Overview'             },
  { id: 'matched',      label: 'Matched Catalog'      },
  { id: 'nonmatched',   label: 'Contract Suggestion'  },
  { id: 'requisition',  label: 'Buyer Requisition'    },
];

export default function App() {
  const [active, setActive] = useState('overview');
  const [DATA, setDATA] = useState(null);

  useEffect(() => {
    fetchDashboard()
      .then(data => { console.log('n8n response:', JSON.stringify(data, null, 2)); setDATA(data); })
      .catch(() => {}); // n8n not ready yet — views fall back to their own mock data
  }, []);

  return (
    <div className="fc-page">
      <header className="fc-header">
        <div className="fc-main-nav__inner">
          {/* Brand */}
          <div className="ofi-logo">
            <span style={{ fontWeight: 900, fontSize: 18, color: 'var(--ofi-gold)', letterSpacing: '-1px' }}>
              <sup style={{ fontSize: 9, verticalAlign: 'super' }}>™</sup>imec
            </span>
          </div>

          {/* Tabs */}
          <nav className="fc-nav">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setActive(t.id)}
                className={`fc-nav__item${active === t.id ? ' fc-nav__item--active' : ''}`}
              >
                {t.label}
              </button>
            ))}
          </nav>

          {/* Actions */}
          <div className="fc-nav__right">
            <button className="fc-nav__icon-btn"><RefreshCw size={13} /></button>
            <button className="fc-nav__icon-btn"><LayoutGrid size={13} /></button>
            <span style={{
              fontSize: 11, fontWeight: 700, color: 'var(--ofi-gold)',
              border: '1px solid var(--ofi-gold)', borderRadius: 20, padding: '3px 10px',
            }}>100%</span>
            <button className="fc-nav__icon-btn"><Bell size={13} /></button>
            <button className="fc-nav__icon-btn"><Download size={13} /></button>
          </div>
        </div>
      </header>

      <div className="fc-page__body">
        <main className="fc-page__main">
          {active === 'overview'   && <OverviewView   data={DATA?.overview} />}
          {active === 'matched'      && <FreeTextView         data={DATA?.matched} />}
          {active === 'nonmatched'   && <SuggestionsView      data={DATA?.nonmatched} />}
          {active === 'requisition'  && <BuyerRequisitionView />}
        </main>
      </div>
    </div>
  );
}
