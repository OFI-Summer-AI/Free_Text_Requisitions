import { useState } from 'react';
import { ArrowUpDown, AlertTriangle, TrendingUp, FileText, Lightbulb, GitBranch, CheckCircle } from 'lucide-react';
import { C } from '../../lib/colors';

const MOCK_items = [
  { id:1, desc:'Industrial Vacuum Pump — Model V4',        vendor:'Pfeiffer Vacuum GmbH',  orders:47, spend:1165600, avgOrder:24800, rec:'contract_vendor',  insight:'You have placed 47 orders with this vendor for this item in the last 12 months. Logging a contract with Pfeiffer Vacuum GmbH is expected to unlock volume discounts.',                                                     saving:8.5,  priority:'High'   },
  { id:2, desc:'Lab Grade Isopropanol 5L × 20',            vendor:'VWR International',     orders:36, spend:115200,  avgOrder:3200,  rec:'similar_material', insight:'A similar catalogue material is already under contract. Consolidating under the existing VWR agreement removes the free-text overhead entirely.',                                                         saving:12.0, priority:'High',   similarMat:'CH-100010-6-2p — Isopropanol 2.5L' },
  { id:3, desc:'Nitrogen Gas Cylinder 50L (99.999%)',       vendor:'Air Liquide Belgium',   orders:29, spend:194300,  avgOrder:6700,  rec:'contract_vendor',  insight:'Recurring gas supply with a single vendor. A framework agreement with Air Liquide Belgium would guarantee pricing and reduce your procurement cycle time.',                                         saving:6.5,  priority:'High'   },
  { id:4, desc:'Deionised Water System DI-2000',            vendor:'Merck Millipore',       orders:24, spend:441600,  avgOrder:18400, rec:'similar_material', insight:'A near-identical model is already contracted. Extending that contract to cover this variant eliminates duplicate supplier negotiations.',                                                           saving:9.0,  priority:'Medium', similarMat:'CH-400046-0-De — DI Water System DI-1500' },
  { id:5, desc:'Cleanroom Gloves Class 10 XL (×1000)',      vendor:'Micronclean Ltd',       orders:19, spend:23560,   avgOrder:1240,  rec:'contract_vendor',  insight:'Consumable with a predictable demand profile. A blanket order would reduce individual PO overhead significantly.',                                                                              saving:5.0,  priority:'Medium' },
  { id:6, desc:'Reflow Oven Controller Board REF-4',        vendor:'Heller Industries',     orders:15, spend:618000,  avgOrder:41200, rec:'contract_vendor',  insight:'High-value item with consistent demand. Contract negotiation is projected to deliver a significant unit price reduction.',                                                                      saving:7.5,  priority:'Medium' },
  { id:7, desc:'High-Temperature Resistant Cable 10m',      vendor:'RS Components',         orders:12, spend:46200,   avgOrder:3850,  rec:'similar_material', insight:'A contracted shorter variant exists. Extending the current agreement to cover this length avoids duplicate supplier negotiations.',                                                           saving:4.5,  priority:'Low',    similarMat:'CH-400412-0-HT — HT Cable 5m' },
  { id:8, desc:'EKG Monitoring Module EK-32',               vendor:'Siemens Healthineers',  orders:10, spend:89000,   avgOrder:8900,  rec:'contract_vendor',  insight:'Single-source specialist equipment. Formalising a preferred supplier agreement ensures supply continuity and pricing stability.',                                                              saving:6.0,  priority:'Low'    },
];

const PRIORITY_STYLE = {
  High:   { background: C.gold,        color: '#000',     fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20 },
  Medium: { background: '#2a2a2a',     color: C.textSec,  fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: `1px solid ${C.border}` },
  Low:    { background: 'transparent', color: C.muted,    fontSize: 10, fontWeight: 600, padding: '3px 10px', borderRadius: 20, border: `1px solid ${C.border}` },
};

function CallingCard({ item, onAction }) {
  const savingEUR = Math.round(item.spend * item.saving / 100);
  const avgOrder  = item.avgOrder ?? (item.orders ? Math.round(item.spend / item.orders) : 0);
  const isVendor  = item.rec === 'contract_vendor';

  return (
    <div style={{
      background: C.surface, border: `1px solid ${C.border}`,
      borderLeft: `3px solid ${C.gold}`, borderRadius: 12,
      padding: '18px 20px', display: 'flex', flexDirection: 'column', gap: 14,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 13, color: C.textPri, lineHeight: 1.3 }}>{item.desc}</div>
          <div style={{ fontSize: 11, color: C.textSec, marginTop: 3 }}>{item.vendor}</div>
        </div>
        <span style={PRIORITY_STYLE[item.priority]}>{(item.priority ?? '').toUpperCase()}</span>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
        {[
          { l: 'Orders (12M)', v: item.orders,                            c: C.textPri },
          { l: 'Total Spend',  v: `€${(item.spend / 1000).toFixed(0)}K`, c: C.textPri },
          { l: 'Avg Order',    v: `€${avgOrder.toLocaleString()}`,         c: C.textSec },
        ].map(({ l, v, c }) => (
          <div key={l} style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: 9, color: C.muted, textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>{l}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: c }}>{v}</div>
          </div>
        ))}
      </div>

      <div style={{
        background: 'rgba(204,162,62,0.06)', border: `1px solid rgba(204,162,62,0.2)`,
        borderRadius: 8, padding: '12px 14px', display: 'flex', flexDirection: 'column', gap: 8,
      }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start' }}>
          {isVendor
            ? <AlertTriangle size={13} color={C.gold} style={{ flexShrink: 0, marginTop: 1 }} />
            : <GitBranch     size={13} color={C.gold} style={{ flexShrink: 0, marginTop: 1 }} />
          }
          <p style={{ fontSize: 12, color: C.textSec, lineHeight: 1.55, margin: 0 }}>
            {item.insight}
            {!isVendor && item.similarMat && (
              <span style={{ display: 'block', marginTop: 4, color: C.textSec }}>
                Similar contracted material: <span style={{ color: C.gold, fontWeight: 600 }}>{item.similarMat}</span>
              </span>
            )}
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, paddingTop: 4, borderTop: `1px solid rgba(204,162,62,0.15)` }}>
          <TrendingUp size={12} color={C.gold} />
          <span style={{ fontSize: 11, color: C.textPri }}>
            Expected benefit: <strong style={{ color: C.gold }}>{item.saving}% reduction</strong>
            {' · '}
            <strong style={{ color: C.gold }}>€{(savingEUR / 1000).toFixed(0)}K</strong> annually
          </span>
        </div>
      </div>

      <button
        className="btn btn-primary btn-full"
        style={{ borderRadius: 8, fontSize: 12 }}
        onClick={() => onAction(item.id)}
      >
        {isVendor ? 'Create Contract with Vendor →' : 'Consolidate under Existing Contract →'}
      </button>
    </div>
  );
}

export default function SuggestionsView({ data }) {
  const items = Array.isArray(data) ? [...MOCK_items, ...data] : MOCK_items;
  const [actionedIds, setActionedIds] = useState([]);

  const handleAction = (id) => setActionedIds(prev => prev.includes(id) ? prev : [...prev, id]);

  const totalSpend   = items.reduce((a, i) => a + i.spend, 0);
  const totalSavings = items.reduce((a, i) => a + Math.round(i.spend * i.saving / 100), 0);
  const highPriority = items.filter(i => i.priority === 'High' && !actionedIds.includes(i.id));
  const createdContracts = items.filter(i => actionedIds.includes(i.id));

  return (
    <div>

      {/* ════════════════════════════════════════════════════
          KPIs
          ════════════════════════════════════════════════════ */}
      <div className="kpi-efficiency-grid" style={{ marginBottom: 20, gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {[
          { label: 'Non-Catalog Items',       value: items.length,                              gold: false },
          { label: 'High Priority',           value: highPriority.length,                       gold: true  },
          { label: 'Total Spend (12M)',        value: `€${(totalSpend / 1000000).toFixed(1)}M`,  gold: false },
          { label: 'Potential Annual Savings', value: `€${(totalSavings / 1000).toFixed(0)}K`,  gold: true  },
        ].map(({ label, value, gold }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-card__value" style={{ color: gold ? C.gold : C.textPri }}>{value}</div>
            <div className="kpi-card__label">{label}</div>
            <div className="kpi-card__progress" style={{ marginTop: 10 }}>
              <div className="kpi-card__progress-fill" style={{
                width: gold ? '65%' : '80%',
                background: `linear-gradient(90deg,${C.gold},#E2C96A)`,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          CALLING CARDS — High priority items
          ════════════════════════════════════════════════════ */}
      <div style={{ marginBottom: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <Lightbulb size={14} color={C.gold} />
          <span style={{ fontSize: 12, fontWeight: 700, color: C.textSec, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            High-Potential Items — Action Required
          </span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14, marginBottom: 20 }}>
          {highPriority.map(item => <CallingCard key={item.id} item={item} onAction={handleAction} />)}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          TABLE — All non-catalog items
          ════════════════════════════════════════════════════ */}
      <div className="chart-section">
        <div className="chart-section__header">
          <div className="chart-section__title-group">
            <div className="chart-section__icon"><FileText size={18} /></div>
            <div>
              <h3 className="chart-section__title">All Non-Catalog Items</h3>
              <p className="chart-section__subtitle">Order frequency, spend, and system recommendations</p>
            </div>
          </div>
        </div>
        <div style={{ overflowX: 'auto' }}>
          <table className="dark-table">
            <thead>
              <tr>
                {['Item Description', 'Vendor', 'Orders (12M)', 'Total Spend', 'Avg Order', 'Recommendation', 'Est. Saving', 'Priority', 'Action'].map(h => (
                  <th key={h}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      {h} <ArrowUpDown size={9} color={C.border} />
                    </span>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map(item => {
                const savingEUR = Math.round(item.spend * item.saving / 100);
                const avgOrder  = item.avgOrder ?? (item.orders ? Math.round(item.spend / item.orders) : 0);
                return (
                  <tr key={item.id}>
                    <td style={{ fontWeight: 600, color: C.textPri, maxWidth: 220 }}>
                      <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {item.desc}
                      </span>
                    </td>
                    <td style={{ color: C.textSec, fontSize: 11 }}>{item.vendor}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700 }}>{item.orders}</td>
                    <td style={{ textAlign: 'right', color: C.textSec }}>€{(item.spend / 1000).toFixed(0)}K</td>
                    <td style={{ textAlign: 'right', color: C.textSec }}>€{avgOrder.toLocaleString()}</td>
                    <td>
                      <span style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 6, fontWeight: 600,
                        background: item.rec === 'contract_vendor' ? 'rgba(204,162,62,0.1)' : 'rgba(100,160,255,0.1)',
                        color: item.rec === 'contract_vendor' ? C.gold : '#7eb8f7',
                        border: `1px solid ${item.rec === 'contract_vendor' ? 'rgba(204,162,62,0.3)' : 'rgba(100,160,255,0.3)'}`,
                      }}>
                        {item.rec === 'contract_vendor' ? 'New Contract' : 'Consolidate'}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <span style={{ color: C.gold, fontWeight: 700 }}>{item.saving}%</span>
                      <span style={{ color: C.textSec, fontSize: 10, display: 'block' }}>€{(savingEUR / 1000).toFixed(0)}K/yr</span>
                    </td>
                    <td><span style={PRIORITY_STYLE[item.priority]}>{(item.priority ?? '').toUpperCase()}</span></td>
                    <td>
                      {actionedIds.includes(item.id)
                        ? <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#4ade80', fontSize: 11, fontWeight: 600 }}>
                            <CheckCircle size={13} /> Created
                          </span>
                        : item.priority === 'High'
                          ? <button className="btn btn-primary btn-sm" onClick={() => handleAction(item.id)}>Create Contract</button>
                          : <button className="btn btn-outline btn-sm">Review</button>
                      }
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          CREATED CONTRACTS TABLE
          ════════════════════════════════════════════════════ */}
      {createdContracts.length > 0 && (
        <div className="chart-section" style={{ marginTop: 20 }}>
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon" style={{ background: 'rgba(74,222,128,0.1)', color: '#4ade80' }}>
                <CheckCircle size={18} />
              </div>
              <div>
                <h3 className="chart-section__title">Created Contracts</h3>
                <p className="chart-section__subtitle">Contracts actioned from suggestions — pending procurement review</p>
              </div>
            </div>
            <span style={{
              fontSize: 11, fontWeight: 700, padding: '4px 12px', borderRadius: 20,
              background: 'rgba(74,222,128,0.12)', color: '#4ade80',
              border: '1px solid rgba(74,222,128,0.3)',
            }}>
              {createdContracts.length} contract{createdContracts.length > 1 ? 's' : ''} created
            </span>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table className="dark-table">
              <thead>
                <tr>
                  {['Item Description', 'Vendor', 'Orders (12M)', 'Total Spend', 'Type', 'Est. Saving', 'Status'].map(h => (
                    <th key={h}><span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>{h}</span></th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {createdContracts.map(item => {
                  const savingEUR = Math.round(item.spend * item.saving / 100);
                  return (
                    <tr key={item.id}>
                      <td style={{ fontWeight: 600, color: C.textPri, maxWidth: 220 }}>
                        <span style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.desc}
                        </span>
                      </td>
                      <td style={{ color: C.textSec, fontSize: 11 }}>{item.vendor}</td>
                      <td style={{ textAlign: 'right', fontWeight: 700 }}>{item.orders}</td>
                      <td style={{ textAlign: 'right', color: C.textSec }}>€{(item.spend / 1000).toFixed(0)}K</td>
                      <td>
                        <span style={{
                          fontSize: 10, padding: '3px 8px', borderRadius: 6, fontWeight: 600,
                          background: item.rec === 'contract_vendor' ? 'rgba(204,162,62,0.1)' : 'rgba(100,160,255,0.1)',
                          color: item.rec === 'contract_vendor' ? C.gold : '#7eb8f7',
                          border: `1px solid ${item.rec === 'contract_vendor' ? 'rgba(204,162,62,0.3)' : 'rgba(100,160,255,0.3)'}`,
                        }}>
                          {item.rec === 'contract_vendor' ? 'New Contract' : 'Consolidate'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span style={{ color: C.gold, fontWeight: 700 }}>{item.saving}%</span>
                        <span style={{ color: C.textSec, fontSize: 10, display: 'block' }}>€{(savingEUR / 1000).toFixed(0)}K/yr</span>
                      </td>
                      <td>
                        <span style={{ display: 'flex', alignItems: 'center', gap: 5, color: '#4ade80', fontSize: 11, fontWeight: 600 }}>
                          <CheckCircle size={13} /> Contract Created
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
