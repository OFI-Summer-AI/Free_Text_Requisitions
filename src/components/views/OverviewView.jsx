import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell, ComposedChart, Line,
} from 'recharts';
import { BarChart2, ArrowUpDown, ChevronDown } from 'lucide-react';
import { C } from '../../lib/colors';

// ── Data ──────────────────────────────────────────────────────
const orders = [
  { id:'PO-2024-0001', material:'CH-400452-0-VT',  desc:'Industrial Vacuum Pump Series V4',      supplier:'Pfeiffer Vacuum GmbH',     cost:24800, delivery:'2024-07-15', status:'Pending',  priority:'High',   match:94, approved:false },
  { id:'PO-2024-0002', material:'CH-100070-0-2p',  desc:'Lab Grade Isopropanol 5L × 20',          supplier:'VWR International',        cost:3200,  delivery:'2024-07-18', status:'Approved', priority:'Medium', match:87, approved:true  },
  { id:'PO-2024-0003', material:'CH-400000-0-Mi',  desc:'Optical Microscope Slides (×500)',        supplier:'Thermo Fisher Scientific', cost:845,   delivery:'2024-07-22', status:'Pending',  priority:'Low',    match:91, approved:false },
  { id:'PO-2024-0004', material:'CH-800071-0-6N',  desc:'Nitrogen Gas Cylinder 50L (99.999%)',     supplier:'Air Liquide Belgium',      cost:6700,  delivery:'2024-07-25', status:'Approved', priority:'High',   match:96, approved:true  },
  { id:'PO-2024-0005', material:'CH-400048-0-De',  desc:'Deionised Water System DI-2000',          supplier:'Merck Millipore',          cost:18400, delivery:'2024-07-28', status:'Rejected', priority:'Medium', match:72, approved:false },
  { id:'PO-2024-0006', material:'CH-000000-0-A',   desc:'Cleanroom Gloves Class 10 XL (×1000)',    supplier:'Micronclean Ltd',          cost:1240,  delivery:'2024-08-01', status:'Pending',  priority:'High',   match:89, approved:false },
  { id:'PO-2024-0007', material:'CH-400412-0-HT',  desc:'High-Temperature Resistant Cable 10m',    supplier:'RS Components',            cost:3850,  delivery:'2024-08-05', status:'Approved', priority:'Low',    match:83, approved:true  },
  { id:'PO-2024-0008', material:'CH-000010-6-2p',  desc:'Precision Pipette Tips 200µL (×5000)',    supplier:'Eppendorf AG',             cost:2100,  delivery:'2024-08-08', status:'Pending',  priority:'Medium', match:92, approved:false },
  { id:'PO-2024-0009', material:'CH-400055-0-RE',  desc:'Reflow Oven Controller Board REF-4',      supplier:'Heller Industries',        cost:41200, delivery:'2024-08-12', status:'Pending',  priority:'High',   match:78, approved:false },
  { id:'PO-2024-0010', material:'CH-801120-0-Mic', desc:'SEM Sample Stub Aluminium (×50)',         supplier:'Agar Scientific',          cost:680,   delivery:'2024-08-15', status:'Approved', priority:'Low',    match:95, approved:true  },
  { id:'PO-2024-0011', material:'CH-400071-0-EK',  desc:'EKG Monitoring Module EK-32',             supplier:'Siemens Healthineers',     cost:8900,  delivery:'2024-08-20', status:'Rejected', priority:'High',   match:65, approved:false },
  { id:'PO-2024-0012', material:'CH-100010-6-2p',  desc:'PCB Soldering Flux Pen (×24)',            supplier:'MG Chemicals',             cost:420,   delivery:'2024-08-22', status:'Pending',  priority:'Low',    match:88, approved:false },
];

const categories = [
  { name: 'Lab Equipment',       cat: 4521, ftRate: 22 },
  { name: 'PPE & Safety',        cat: 3812, ftRate: 55 },
  { name: 'Chemicals & Gases',   cat: 3240, ftRate: 18 },
  { name: 'Electronics & PCB',   cat: 2987, ftRate: 39 },
  { name: 'Consumables',         cat: 2654, ftRate: 46 },
  { name: 'Cleanroom Supplies',  cat: 1930, ftRate: 30 },
  { name: 'Mechanical Parts',    cat: 1540, ftRate: 62 },
  { name: 'Software & Licences', cat: 980,  ftRate: 9  },
];

const coverage = [
  { name: 'Catalog-linked', value: 65.4, color: C.gold   },
  { name: 'Free-text orders', value: 34.6, color: C.border },
];

const timelineData = [
  { m: '2024-05', orders: 4200, ftRate: 82 }, { m: '2024-06', orders: 5800, ftRate: 91 },
  { m: '2024-07', orders: 4600, ftRate: 85 }, { m: '2024-08', orders: 4900, ftRate: 88 },
  { m: '2024-09', orders: 5100, ftRate: 90 }, { m: '2024-10', orders: 5400, ftRate: 92 },
  { m: '2024-11', orders: 4800, ftRate: 89 }, { m: '2024-12', orders: 4300, ftRate: 84 },
  { m: '2025-01', orders: 5200, ftRate: 91 }, { m: '2025-02', orders: 5700, ftRate: 93 },
  { m: '2025-03', orders: 5500, ftRate: 92 }, { m: '2025-04', orders: 4900, ftRate: 88 },
  { m: '2025-05', orders: 5300, ftRate: 90 }, { m: '2025-06', orders: 5600, ftRate: 93 },
  { m: '2025-07', orders: 5100, ftRate: 89 }, { m: '2025-08', orders: 4800, ftRate: 87 },
  { m: '2025-09', orders: 5400, ftRate: 91 }, { m: '2025-10', orders: 5900, ftRate: 94 },
  { m: '2025-11', orders: 5700, ftRate: 93 }, { m: '2025-12', orders: 5200, ftRate: 90 },
  { m: '2026-01', orders: 5600, ftRate: 92 }, { m: '2026-02', orders: 6100, ftRate: 95 },
  { m: '2026-03', orders: 5800, ftRate: 93 }, { m: '2026-04', orders: 3900, ftRate: 88 },
];

const mergedTimelineData = timelineData.map(d => ({
  m: d.m,
  ftOrders:       Math.round(d.orders * d.ftRate / 100),
  contractOrders: d.orders - Math.round(d.orders * d.ftRate / 100),
  ftRate:         d.ftRate,
}));

const plantData = [
  { name: 'ADM – IMEC Administratie', value: 20.36, color: C.gold    },
  { name: 'FI01 – IMEC FINLAND',      value: 20.36, color: '#B8963A' },
  { name: 'Z001 – IMEC VZW',          value: 20.36, color: '#555555' },
  { name: 'IM – IMEC 1',              value: 20.36, color: '#333333' },
  { name: 'Others (6)',               value: 18.55, color: '#222222' },
];


// ── Pie label ─────────────────────────────────────────────────
const R = Math.PI / 180;
function PieLabel({ cx, cy, midAngle, outerRadius, value }) {
  const r = outerRadius + 22;
  const x = cx + r * Math.cos(-midAngle * R);
  const y = cy + r * Math.sin(-midAngle * R);
  return (
    <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central" fontSize={9} fill={C.textSec}>
      {`${value}%`}
    </text>
  );
}

function OuterLabel({ cx, cy, midAngle, outerRadius, name, value }) {
  const r = outerRadius + 28;
  const x = cx + r * Math.cos(-midAngle * (Math.PI / 180));
  const y = cy + r * Math.sin(-midAngle * (Math.PI / 180));
  return (
    <text x={x} y={y} textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central" fontSize={9} fill={C.textSec}>
      {`${value}% ${name}`}
    </text>
  );
}

function ChartLegend({ items }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 10, color: C.textSec, marginTop: 10 }}>
      {items.map(({ color, label }) => (
        <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ width: 12, height: 12, borderRadius: 3, background: color, display: 'inline-block' }} />
          {label}
        </span>
      ))}
    </div>
  );
}

// ── Section divider label ─────────────────────────────────────
function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 10, fontWeight: 700, textTransform: 'uppercase',
      letterSpacing: '0.08em', color: C.textSec,
      display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10,
    }}>
      <span style={{ flex: 1, height: 1, background: C.border }} />
      {children}
      <span style={{ flex: 1, height: 1, background: C.border }} />
    </div>
  );
}

// ── View ──────────────────────────────────────────────────────
export default function OverviewView() {
  const pending  = orders.filter(o => o.status === 'Pending').length;
  const avgMatch = Math.round(orders.reduce((a, o) => a + o.match, 0) / orders.length);

  return (
    <div>

      {/* ════════════════════════════════════════════════════
          TOP — All KPIs (Requisition + Catalog, 8 cards)
          ════════════════════════════════════════════════════ */}

      <div className="kpi-efficiency-grid" style={{ marginBottom: 20, gridTemplateColumns: 'repeat(6, 1fr)' }}>
        {[
          { label: 'Total Purchase Requisitions', value: orders.length, gold: false  },
          { label: 'Pending Approval',            value: pending,        gold: true   },
          { label: 'Avg Match Confidence',        value: `${avgMatch}%`, gold: true   },
          { label: 'Total Line Items',            value: '45,231',       gold: false  },
          { label: 'Free-Text Rate',              value: '34.6%',        danger: true },
          { label: 'Material Categories',         value: '8',            gold: false  },
        ].map(({ label, value, gold, danger }) => (
          <div key={label} className="kpi-card">
            <div className="kpi-card__value"
              style={{ color: danger ? C.red : gold ? C.gold : C.textPri }}>
              {value}
            </div>
            <div className="kpi-card__label">{label}</div>
            <div className="kpi-card__progress" style={{ marginTop: 10 }}>
              <div className="kpi-card__progress-fill" style={{
                width: danger ? '35%' : gold ? '65%' : '80%',
                background: danger
                  ? `linear-gradient(90deg,${C.red},#f87171)`
                  : `linear-gradient(90deg,${C.gold},#E2C96A)`,
              }} />
            </div>
          </div>
        ))}
      </div>

      {/* ════════════════════════════════════════════════════
          MIDDLE — Charts from Material Catalog View
          ════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12, marginBottom: 12 }}>

        {/* Orders by Category */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Orders by Material Category</h3>
                <p className="chart-section__subtitle">Catalog-linked vs Free-text breakdown</p>
              </div>
            </div>
          </div>
          <div className="chart-section__body">
            <ResponsiveContainer width="100%" height={270}>
              <BarChart data={categories} layout="vertical" margin={{ top: 4, right: 48, left: 8, bottom: 4 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke={C.grid} />
                <XAxis type="number" tick={{ fontSize: 9, fill: C.textSec }}
                  tickFormatter={v => `${(v / 1000).toFixed(1)}K`} />
                <YAxis type="category" dataKey="name" width={130} tick={{ fontSize: 10, fill: C.textPri }} />
                <Tooltip contentStyle={C.tip} />
                <Bar dataKey="cat"    name="Catalog-linked" fill={C.gold}   radius={[0, 0, 0, 0]} />
                <Bar dataKey="ftRate" name="Free-text %"       fill={C.border} radius={[0, 2, 2, 0]} />
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 20, fontSize: 10, color: C.textSec, marginTop: 8 }}>
              {[{ color: C.gold, label: 'Catalog-linked' }, { color: C.border, label: 'Free-text' }].map(({ color, label }) => (
                <span key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 12, height: 12, borderRadius: 3, background: color, display: 'inline-block' }} />
                  {label}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Coverage Donut */}
        <div className="chart-section" style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Catalog Coverage</h3>
                <p className="chart-section__subtitle">Linked vs free-text share</p>
              </div>
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '0 16px 16px' }}>
            <PieChart width={210} height={210}>
              <Pie data={coverage} cx={103} cy={103} innerRadius={58} outerRadius={94}
                dataKey="value" labelLine={{ stroke: C.border, strokeWidth: 0.8 }} label={PieLabel}>
                {coverage.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
              <Tooltip formatter={v => `${v}%`} contentStyle={C.tip} />
            </PieChart>
            <div style={{ display: 'flex', gap: 20, fontSize: 11, color: C.textSec }}>
              {coverage.map(e => (
                <span key={e.name} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 10, height: 10, borderRadius: 3, background: e.color, display: 'inline-block' }} />
                  {e.name}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          CHARTS ROW 2 — Development over Time + Plant donut
          ════════════════════════════════════════════════════ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 12, marginBottom: 12 }}>

        {/* Development over Time */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Development over Time</h3>
                <p className="chart-section__subtitle">Free-text vs Contract-based volumes &nbsp;·&nbsp; FreeText order rate</p>
              </div>
            </div>
            <button className="btn btn-ghost btn-sm" style={{ gap: 6, fontSize: 12 }}>
              Month <ChevronDown size={11} />
            </button>
          </div>
          <div className="chart-section__body">
            <ResponsiveContainer width="100%" height={260}>
              <ComposedChart data={mergedTimelineData} margin={{ top: 4, right: 40, left: 0, bottom: 32 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} vertical={false} />
                <XAxis dataKey="m" tick={{ fontSize: 8, fill: C.textSec }} angle={-45} textAnchor="end" interval={0} height={46} />
                <YAxis yAxisId="l" tick={{ fontSize: 9, fill: C.textSec }} tickFormatter={v => `${v / 1000}K`} width={32} />
                <YAxis yAxisId="r" orientation="right" tick={{ fontSize: 9, fill: C.textSec }} domain={[0, 100]} unit="%" width={36} />
                <Tooltip contentStyle={C.tip} formatter={(v, name) =>
                  name === 'FreeText rate' ? `${v}%` : v.toLocaleString()
                } />
                <Bar yAxisId="l" dataKey="contractOrders" stackId="s" fill={C.border} name="Contract-based" maxBarSize={18} />
                <Bar yAxisId="l" dataKey="ftOrders"       stackId="s" fill={C.gold}   name="Free-text orders" radius={[2, 2, 0, 0]} maxBarSize={18} />
                <Line yAxisId="r" type="monotone" dataKey="ftRate" stroke={C.textPri} strokeWidth={1.5}
                  dot={{ r: 2.5, fill: C.textPri, strokeWidth: 0 }} name="FreeText rate" />
              </ComposedChart>
            </ResponsiveContainer>
            <ChartLegend items={[
              { color: C.gold,    label: 'Free-text orders' },
              { color: C.border,  label: 'Contract-based orders' },
              { color: C.textPri, label: 'FreeText order rate' },
            ]} />
            <p style={{ textAlign: 'center', fontSize: 10, color: C.textSec, marginTop: 4 }}>Month →</p>
          </div>
        </div>

        {/* Free-Text Orders by Plant */}
        <div className="chart-section">
          <div className="chart-section__header">
            <div className="chart-section__title-group">
              <div className="chart-section__icon"><BarChart2 size={18} /></div>
              <div>
                <h3 className="chart-section__title">Free-Text Orders by Plant</h3>
                <p className="chart-section__subtitle">Plant share breakdown</p>
              </div>
            </div>
          </div>
          <div className="chart-section__body" style={{ display: 'flex', justifyContent: 'center' }}>
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={plantData} cx="50%" cy="50%" innerRadius={70} outerRadius={108}
                  dataKey="value" labelLine={{ stroke: C.border, strokeWidth: 0.8 }} label={OuterLabel}>
                  {plantData.map((e, i) => <Cell key={i} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={v => `${v}%`} contentStyle={C.tip} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>


    </div>
  );
}
