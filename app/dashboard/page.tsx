"use client";

import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type StockItem = { product: string; brand: string; qty: number; price: string; status: string };
type Customer  = { name: string; phone: string; orders: number; status: string };
type SaleItem  = { id: string; customer: string; product: string; amount: string; status: string };
type TeamMember= { name: string; role: string; phone: string; status: string };

type View = "stock" | "customer" | "sell" | "team" | "profile";

// ─── Seed data ────────────────────────────────────────────────────────────────

const SEED_STOCK: StockItem[] = [
  { product: "PowerMax Pro 65Ah",  brand: "Exide",      qty: 12, price: "₹4,899",  status: "In stock"     },
  { product: "SolarEdge 200Ah",    brand: "Luminous",   qty: 3,  price: "₹12,499", status: "Low stock"    },
  { product: "UltraGuard 150Ah",   brand: "Amaron",     qty: 8,  price: "₹8,199",  status: "In stock"     },
  { product: "MotoFire 9Ah",       brand: "SF Sonic",   qty: 0,  price: "₹1,799",  status: "Out of stock" },
  { product: "TurboPower 88Ah",    brand: "Tata Green", qty: 5,  price: "₹6,499",  status: "In stock"     },
  { product: "EcoCharge 100Ah",    brand: "Okaya",      qty: 2,  price: "₹9,299",  status: "Low stock"    },
];

const SEED_CUSTOMERS: Customer[] = [
  { name: "Rajesh Mondal",     phone: "+91 98300 11111", orders: 8,  status: "Active"   },
  { name: "Priya Das",         phone: "+91 97330 22222", orders: 3,  status: "Active"   },
  { name: "Subir Roy",         phone: "+91 99010 33333", orders: 12, status: "Active"   },
  { name: "Anita Sen",         phone: "+91 90000 44444", orders: 1,  status: "Inactive" },
  { name: "Biplab Ghosh",      phone: "+91 88880 55555", orders: 5,  status: "Active"   },
];

const SEED_SALES: SaleItem[] = [
  { id: "#ORD-1042", customer: "Rajesh Mondal", product: "PowerMax Pro 65Ah", amount: "₹4,899",  status: "Paid"      },
  { id: "#ORD-1041", customer: "Subir Roy",     product: "UltraGuard 150Ah",  amount: "₹8,199",  status: "Paid"      },
  { id: "#ORD-1040", customer: "Priya Das",     product: "MotoFire 9Ah",      amount: "₹1,799",  status: "Pending"   },
  { id: "#ORD-1039", customer: "Anita Sen",     product: "SolarEdge 200Ah",   amount: "₹12,499", status: "Paid"      },
  { id: "#ORD-1038", customer: "Biplab Ghosh",  product: "TurboPower 88Ah",   amount: "₹6,499",  status: "Cancelled" },
];

const SEED_TEAM: TeamMember[] = [
  { name: "Arijit Kumar",       role: "Admin",       phone: "+91 98300 12345", status: "On duty" },
  { name: "Souvik Bose",        role: "Sales staff",  phone: "+91 97440 99001", status: "On duty" },
  { name: "Mita Chakraborty",   role: "Technician",  phone: "+91 90080 44332", status: "Off"     },
  { name: "Rana Das",           role: "Sales staff",  phone: "+91 88990 11223", status: "On duty" },
  { name: "Dipankar Paul",      role: "Technician",  phone: "+91 93310 55678", status: "On duty" },
  { name: "Soma Roy",           role: "Sales staff",  phone: "+91 91230 77890", status: "Off"     },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function initials(name: string) {
  return name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "In stock" || status === "Paid"    || status === "Active"  || status === "On duty"
      ? "bg-emerald-100 text-emerald-800"
    : status === "Low stock" || status === "Pending" || status === "Off"
      ? "bg-amber-100 text-amber-800"
      : "bg-red-100 text-red-800";
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-medium ${color}`}>
      {status}
    </span>
  );
}

function Avatar({ name }: { name: string }) {
  return (
    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-sky-100 text-sky-800 text-[11px] font-semibold shrink-0">
      {initials(name)}
    </span>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────

type Field = { label: string; key: string; type: "text" | "number" | "select" | "date"; opts?: string[] };

const MODAL_FIELDS: Record<string, { title: string; fields: Field[] }> = {
  stock: {
    title: "Add stock item",
    fields: [
          { label: "Product Company",    key: "company",    type: "select", opts: ["tata", "exit", "aamaron"] },
          { label: "Product Category",   key: "category",   type: "select", opts: ["tata", "exit", "aamaron"] }, // key gulo unique korlam
          { label: "Product Series",     key: "series",     type: "select", opts: ["tata", "exit", "aamaron"] },
          { label: "Product Model",      key: "model",      type: "select", opts: ["tata", "exit", "aamaron"] },
          
          
          { label: "Manufacturing Date", key: "mfg_date",   type: "date" }, 
          { label: "Purchase Date",      key: "pur_date",   type: "date" }, 
          
          { label: "Purchase Bill no.",      key: "bill_no",    type: "text" },
          { label: "Product Serial no",  key: "serial_no",  type: "text" },
          { label: "Status",             key: "status",     type: "select", opts: ["In stock", "Low stock", "Out of stock"] },
        ],
  },
  customer: {
    title: "Add customer",
    fields: [
      { label: "Name",   key: "name",   type: "text" },
      { label: "Phone",  key: "phone",  type: "text" },
      { label: "Orders", key: "orders", type: "number" },
      { label: "Status", key: "status", type: "select", opts: ["Active", "Inactive"] },
    ],
  },
  sell: {
    title: "Add sale",
    fields: [
      { label: "Order ID",  key: "id",       type: "text" },
      { label: "Customer",  key: "customer", type: "text" },
      { label: "Product",   key: "product",  type: "text" },
      { label: "Amount",    key: "amount",   type: "text" },
      { label: "Status",    key: "status",   type: "select", opts: ["Paid", "Pending", "Cancelled"] },
    ],
  },
  team: {
    title: "Add team member",
    fields: [
      { label: "Name",   key: "name",   type: "text" },
      { label: "Role",   key: "role",   type: "text" },
      { label: "Phone",  key: "phone",  type: "text" },
      { label: "Status", key: "status", type: "select", opts: ["On duty", "Off"] },
    ],
  },
};

interface ModalProps {
  view: View;
  editData?: Record<string, unknown> | null;
  onClose: () => void;
  onSave: (data: Record<string, unknown>) => void;
}

function Modal({ view, editData, onClose, onSave }: ModalProps) {
  const cfg = MODAL_FIELDS[view];
  if (!cfg) return null;

  const [form, setForm] = useState<Record<string, unknown>>(
    editData ? { ...editData } : cfg.fields.reduce((a, f) => ({ ...a, [f.key]: f.type === "number" ? 0 : "" }), {})
  );

  const set = (key: string, val: unknown) => setForm((p) => ({ ...p, [key]: val }));

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl border border-zinc-200 w-[800px] shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-100">
          <span className="text-sm font-semibold text-zinc-800">
            {editData ? "Edit item" : cfg.title}
          </span>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-700 transition-colors" aria-label="Close">
            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="px-5 py-4 grid grid-cols-2 gap-3">
          {cfg.fields.map((f) => (
            <div key={f.key} className="col-span-1">
              <label className="block text-xs text-zinc-500 mb-1">{f.label}</label>
              {f.type === "select" ? (
                <select
                  value={String(form[f.key] ?? "")}
                  onChange={(e) => set(f.key, e.target.value)}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                >
                  {f.opts?.map((o) => <option key={o}>{o}</option>)}
                </select>
              ) : (
                <input
                  type={f.type}
                  value={String(form[f.key] ?? "")}
                  onChange={(e) =>
                    set(f.key, f.type === "number" ? Number(e.target.value) : e.target.value)
                  }
                  placeholder={f.label}
                  className="w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm text-zinc-800 bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400"
                />
              )}
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 px-5 py-4 border-t border-zinc-100">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSave(form)}
            className="px-5 py-2 text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg transition-colors"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Table wrapper ────────────────────────────────────────────────────────────

function TableCard({
  title,
  onAdd,
  search,
  onSearch,
  children,
}: {
  title: string;
  onAdd: () => void;
  search: string;
  onSearch: (v: string) => void;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl overflow-hidden">
      <div className="flex items-center justify-between px-5 py-3.5 border-b border-zinc-100">
        <span className="text-sm font-semibold text-zinc-800">{title}</span>
        <div className="flex items-center gap-2">
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder="Search..."
            className="border border-zinc-200 rounded-lg px-3 py-1.5 text-xs text-zinc-700 bg-zinc-50 w-40 focus:outline-none focus:ring-2 focus:ring-amber-400"
          />
          <button
            onClick={onAdd}
            className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-semibold px-4 py-1.5 rounded-full transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.5}>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add new
          </button>
        </div>
      </div>
      <div className="overflow-x-auto">{children}</div>
    </div>
  );
}

const Th = ({ children, w }: { children: React.ReactNode; w?: string }) => (
  <th
    className="text-left text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-4 py-2.5 bg-zinc-50 border-b border-zinc-100"
    style={w ? { width: w } : {}}
  >
    {children}
  </th>
);

const Td = ({ children, mono }: { children: React.ReactNode; mono?: boolean }) => (
  <td className={`px-4 py-3 text-sm text-zinc-700 border-b border-zinc-50 ${mono ? "font-mono text-xs" : ""}`}>
    {children}
  </td>
);

function ActionBtns({ onEdit, onDelete }: { onEdit: () => void; onDelete?: () => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={onEdit}
        className="flex items-center gap-1 border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs px-2.5 py-1 rounded-lg transition-colors"
      >
        <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
          <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
          <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
        </svg>
        Edit
      </button>
      {onDelete && (
        <button
          onClick={onDelete}
          className="border border-red-200 text-red-500 hover:bg-red-50 text-xs px-2 py-1 rounded-lg transition-colors"
          aria-label="Delete"
        >
          <svg className="w-3 h-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
            <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
          </svg>
        </button>
      )}
    </div>
  );
}

// ─── Stat card ────────────────────────────────────────────────────────────────

function StatCard({ label, value, sub, danger }: { label: string; value: string | number; sub?: string; danger?: boolean }) {
  return (
    <div className="bg-white border border-zinc-200 rounded-2xl px-5 py-4">
      <p className="text-xs text-zinc-400 uppercase tracking-wider mb-1">{label}</p>
      <p className="text-2xl font-semibold text-zinc-900">{value}</p>
      {sub && <p className={`text-xs mt-0.5 ${danger ? "text-red-500" : "text-emerald-600"}`}>{sub}</p>}
    </div>
  );
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV: { id: View; label: string; icon: React.ReactNode }[] = [
  {
    id: "stock",
    label: "Stock",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
  },
  {
    id: "customer",
    label: "Customer",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
      </svg>
    ),
  },
  {
    id: "sell",
    label: "Sell report",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <line x1="18" y1="20" x2="18" y2="10" />
        <line x1="12" y1="20" x2="12" y2="4" />
        <line x1="6"  y1="20" x2="6"  y2="14" />
      </svg>
    ),
  },
  {
    id: "team",
    label: "Team",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <rect x="2" y="7" width="20" height="14" rx="2" />
        <path d="M16 7V5a2 2 0 00-2-2h-4a2 2 0 00-2 2v2" />
        <line x1="12" y1="12" x2="12" y2="16" />
        <line x1="10" y1="14" x2="14" y2="14" />
      </svg>
    ),
  },
  {
    id: "profile",
    label: "My profile",
    icon: (
      <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
        <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
        <circle cx="12" cy="7" r="4" />
      </svg>
    ),
  },
];

function Sidebar({ active, onChange }: { active: View; onChange: (v: View) => void }) {
  return (
    <aside className="w-56 min-w-56 bg-zinc-950 flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-5 py-5 border-b border-zinc-800">
        <div className="w-8 h-8 rounded-lg bg-amber-400 flex items-center justify-center">
          <svg className="w-4 h-4 text-zinc-950" viewBox="0 0 24 24" fill="currentColor">
            <path d="M13 2L4.5 13.5H11L10 22L20.5 10H14L13 2Z" />
          </svg>
        </div>
        <span className="text-white font-black text-base tracking-tight">
          VOLTA<span className="text-amber-400">ZONE</span>
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV.filter((n) => n.id !== "profile").map((n) => (
          <button
            key={n.id}
            onClick={() => onChange(n.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              active === n.id
                ? "bg-amber-400 text-zinc-950"
                : "text-zinc-400 hover:text-white hover:bg-zinc-800"
            }`}
          >
            {n.icon}
            {n.label}
          </button>
        ))}
      </nav>

      {/* Profile at bottom */}
      <div className="px-3 pb-4 border-t border-zinc-800 pt-3">
        <button
          onClick={() => onChange("profile")}
          className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
            active === "profile"
              ? "bg-amber-400 text-zinc-950"
              : "text-zinc-400 hover:text-white hover:bg-zinc-800"
          }`}
        >
          {NAV.find((n) => n.id === "profile")?.icon}
          My profile
        </button>
      </div>
    </aside>
  );
}

// ─── Views ────────────────────────────────────────────────────────────────────

function StockView() {
  const [data, setData]       = useState<StockItem[]>(SEED_STOCK);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const filtered = data.filter(
    (r) =>
      r.product.toLowerCase().includes(search.toLowerCase()) ||
      r.brand.toLowerCase().includes(search.toLowerCase())
  );

  const openAdd  = () => { setEditIdx(null); setModal(true); };
  const openEdit = (i: number) => { setEditIdx(i); setModal(true); };
  const del      = (i: number) => setData((d) => d.filter((_, idx) => idx !== i));

  const save = (form: Record<string, unknown>) => {
    const item = form as unknown as StockItem;
    if (editIdx !== null) setData((d) => d.map((r, i) => (i === editIdx ? item : r)));
    else setData((d) => [...d, item]);
    setModal(false);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label="Total items"  value={data.length}           sub="↑ 3 this week" />
        <StatCard label="Low stock"    value={data.filter(d=>d.status==="Low stock").length}    sub="Needs reorder" danger />
        <StatCard label="Out of stock" value={data.filter(d=>d.status==="Out of stock").length} sub="Reorder now"   danger />
        <StatCard label="Brands"       value={[...new Set(data.map(d=>d.brand))].length}        sub="Active" />
      </div>

      <TableCard title="All stock items" onAdd={openAdd} search={search} onSearch={setSearch}>
        <table className="w-full">
          <thead>
            <tr>
              <Th w="30%">Product</Th><Th w="16%">Brand</Th><Th w="10%">Qty</Th>
              <Th w="14%">Price</Th><Th w="14%">Status</Th><Th w="16%">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="hover:bg-zinc-50 transition-colors">
                <Td><span className="font-medium text-zinc-900">{r.product}</span></Td>
                <Td>{r.brand}</Td>
                <Td>{r.qty}</Td>
                <Td>{r.price}</Td>
                <Td><StatusBadge status={r.status} /></Td>
                <Td>
                  <ActionBtns
                    onEdit={() => openEdit(data.indexOf(r))}
                    onDelete={() => del(data.indexOf(r))}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {modal && (
        <Modal
          view="stock"
          editData={editIdx !== null ? (data[editIdx] as unknown as Record<string, unknown>) : null}
          onClose={() => setModal(false)}
          onSave={save}
        />
      )}
    </>
  );
}

function CustomerView() {
  const [data, setData]       = useState<Customer[]>(SEED_CUSTOMERS);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const filtered = data.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.phone.includes(search)
  );

  const save = (form: Record<string, unknown>) => {
    const item = form as unknown as Customer;
    if (editIdx !== null) setData((d) => d.map((r, i) => (i === editIdx ? item : r)));
    else setData((d) => [...d, item]);
    setModal(false);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label="Total customers" value={data.length}                                    sub="All time" />
        <StatCard label="Active"          value={data.filter(d=>d.status==="Active").length}     sub="↑ 5%" />
        <StatCard label="Inactive"        value={data.filter(d=>d.status==="Inactive").length}   sub="Follow up" danger />
        <StatCard label="Total orders"    value={data.reduce((a,c)=>a+c.orders,0)}               sub="Combined" />
      </div>

      <TableCard title="All customers" onAdd={() => { setEditIdx(null); setModal(true); }} search={search} onSearch={setSearch}>
        <table className="w-full">
          <thead>
            <tr>
              <Th w="32%">Name</Th><Th w="24%">Phone</Th><Th w="14%">Orders</Th>
              <Th w="14%">Status</Th><Th w="16%">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="hover:bg-zinc-50 transition-colors">
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={r.name} />
                    <span className="font-medium text-zinc-900">{r.name}</span>
                  </div>
                </Td>
                <Td>{r.phone}</Td>
                <Td>{r.orders}</Td>
                <Td><StatusBadge status={r.status} /></Td>
                <Td>
                  <ActionBtns
                    onEdit={() => { setEditIdx(data.indexOf(r)); setModal(true); }}
                    onDelete={() => setData((d) => d.filter((_, idx) => idx !== data.indexOf(r)))}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {modal && (
        <Modal
          view="customer"
          editData={editIdx !== null ? (data[editIdx] as unknown as Record<string, unknown>) : null}
          onClose={() => setModal(false)}
          onSave={save}
        />
      )}
    </>
  );
}

function SellView() {
  const [data, setData]       = useState<SaleItem[]>(SEED_SALES);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const filtered = data.filter(
    (r) =>
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.customer.toLowerCase().includes(search.toLowerCase())
  );

  const save = (form: Record<string, unknown>) => {
    const item = form as unknown as SaleItem;
    if (editIdx !== null) setData((d) => d.map((r, i) => (i === editIdx ? item : r)));
    else setData((d) => [...d, item]);
    setModal(false);
  };

  const totalPaid = data.filter(d=>d.status==="Paid").length;

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label="Total orders"     value={data.length}                                         sub="All time" />
        <StatCard label="Paid"             value={totalPaid}                                            sub="Completed" />
        <StatCard label="Pending"          value={data.filter(d=>d.status==="Pending").length}          sub="Action needed" danger />
        <StatCard label="Cancelled"        value={data.filter(d=>d.status==="Cancelled").length}        sub="This month" danger />
      </div>

      <TableCard title="Sell report" onAdd={() => { setEditIdx(null); setModal(true); }} search={search} onSearch={setSearch}>
        <table className="w-full">
          <thead>
            <tr>
              <Th w="16%">Order ID</Th><Th w="22%">Customer</Th><Th w="24%">Product</Th>
              <Th w="14%">Amount</Th><Th w="12%">Status</Th><Th w="12%">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="hover:bg-zinc-50 transition-colors">
                <Td mono>{r.id}</Td>
                <Td>{r.customer}</Td>
                <Td>{r.product}</Td>
                <Td><span className="font-semibold text-zinc-900">{r.amount}</span></Td>
                <Td><StatusBadge status={r.status} /></Td>
                <Td>
                  <ActionBtns onEdit={() => { setEditIdx(data.indexOf(r)); setModal(true); }} />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {modal && (
        <Modal
          view="sell"
          editData={editIdx !== null ? (data[editIdx] as unknown as Record<string, unknown>) : null}
          onClose={() => setModal(false)}
          onSave={save}
        />
      )}
    </>
  );
}

function TeamView() {
  const [data, setData]       = useState<TeamMember[]>(SEED_TEAM);
  const [search, setSearch]   = useState("");
  const [modal, setModal]     = useState(false);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  const filtered = data.filter(
    (r) =>
      r.name.toLowerCase().includes(search.toLowerCase()) ||
      r.role.toLowerCase().includes(search.toLowerCase())
  );

  const save = (form: Record<string, unknown>) => {
    const item = form as unknown as TeamMember;
    if (editIdx !== null) setData((d) => d.map((r, i) => (i === editIdx ? item : r)));
    else setData((d) => [...d, item]);
    setModal(false);
  };

  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-5">
        <StatCard label="Total members" value={data.length}                                      sub="Active team" />
        <StatCard label="On duty"       value={data.filter(d=>d.status==="On duty").length}      sub="Today" />
        <StatCard label="Off today"     value={data.filter(d=>d.status==="Off").length}          sub="Unavailable" danger />
        <StatCard label="Roles"         value={[...new Set(data.map(d=>d.role))].length}         sub="Distinct" />
      </div>

      <TableCard title="Team members" onAdd={() => { setEditIdx(null); setModal(true); }} search={search} onSearch={setSearch}>
        <table className="w-full">
          <thead>
            <tr>
              <Th w="30%">Name</Th><Th w="20%">Role</Th><Th w="22%">Phone</Th>
              <Th w="12%">Status</Th><Th w="16%">Actions</Th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((r, i) => (
              <tr key={i} className="hover:bg-zinc-50 transition-colors">
                <Td>
                  <div className="flex items-center gap-2">
                    <Avatar name={r.name} />
                    <span className="font-medium text-zinc-900">{r.name}</span>
                  </div>
                </Td>
                <Td>{r.role}</Td>
                <Td>{r.phone}</Td>
                <Td><StatusBadge status={r.status} /></Td>
                <Td>
                  <ActionBtns
                    onEdit={() => { setEditIdx(data.indexOf(r)); setModal(true); }}
                    onDelete={() => setData((d) => d.filter((_, idx) => idx !== data.indexOf(r)))}
                  />
                </Td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>

      {modal && (
        <Modal
          view="team"
          editData={editIdx !== null ? (data[editIdx] as unknown as Record<string, unknown>) : null}
          onClose={() => setModal(false)}
          onSave={save}
        />
      )}
    </>
  );
}

function ProfileView() {
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "Arijit Kumar",
    email: "arijit@voltazone.in",
    phone: "+91 98300 12345",
    location: "Howrah, West Bengal",
    joined: "12 Jan 2022",
    role: "Admin",
  });
  const [form, setForm] = useState(profile);

  const inputCls =
    "w-full border border-zinc-200 rounded-lg px-3 py-2 text-sm bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-amber-400 text-zinc-800";

  return (
    <div className="max-w-xl mx-auto flex flex-col gap-4">
      <div className="bg-white border border-zinc-200 rounded-2xl p-6">
        <div className="flex items-center gap-4 mb-5 pb-5 border-b border-zinc-100">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 font-bold text-lg">
            {initials(profile.name)}
          </div>
          <div className="flex-1">
            <p className="text-base font-semibold text-zinc-900">{profile.name}</p>
            <p className="text-sm text-zinc-400">{profile.role} · VoltaZone</p>
          </div>
          <button
            onClick={() => { setEditing(!editing); setForm(profile); }}
            className="flex items-center gap-1.5 border border-zinc-200 text-zinc-600 hover:bg-zinc-50 text-xs px-3 py-1.5 rounded-lg transition-colors"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
              <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" />
              <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
            </svg>
            {editing ? "Cancel" : "Edit"}
          </button>
        </div>

        {editing ? (
          <div className="flex flex-col gap-3">
            {(["name","email","phone","location"] as const).map((k) => (
              <div key={k}>
                <label className="block text-xs text-zinc-400 mb-1 capitalize">{k}</label>
                <input
                  value={form[k]}
                  onChange={(e) => setForm((p) => ({ ...p, [k]: e.target.value }))}
                  className={inputCls}
                />
              </div>
            ))}
            <div className="flex justify-end gap-2 mt-1">
              <button onClick={() => setEditing(false)} className="px-4 py-2 text-sm text-zinc-500 border border-zinc-200 rounded-lg hover:bg-zinc-50">Cancel</button>
              <button
                onClick={() => { setProfile({ ...profile, ...form }); setEditing(false); }}
                className="px-5 py-2 text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg"
              >
                Save changes
              </button>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {([["Email", profile.email], ["Phone", profile.phone], ["Location", profile.location], ["Joined", profile.joined]] as [string,string][]).map(([l, v]) => (
              <div key={l} className="flex justify-between text-sm">
                <span className="text-zinc-400">{l}</span>
                <span className="text-zinc-800 font-medium">{v}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white border border-zinc-200 rounded-2xl p-6">
        <p className="text-sm font-semibold text-zinc-800 mb-4">Change password</p>
        <div className="flex flex-col gap-3">
          {["Current password", "New password", "Confirm new password"].map((l) => (
            <div key={l}>
              <label className="block text-xs text-zinc-400 mb-1">{l}</label>
              <input type="password" placeholder="••••••••" className={inputCls} />
            </div>
          ))}
          <div className="flex justify-end mt-1">
            <button className="px-5 py-2 text-sm font-semibold bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg transition-colors">
              Update password
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const VIEW_LABELS: Record<View, string> = {
  stock: "Stock", customer: "Customer", sell: "Sell report", team: "Team", profile: "My profile",
};

export default function DashboardPage() {
  const [view, setView] = useState<View>("stock");

  return (
    <div className="flex h-screen bg-zinc-100 overflow-hidden">
      <Sidebar active={view} onChange={setView} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-zinc-200 px-6 h-14 flex items-center justify-between shrink-0">
          <h1 className="text-base font-semibold text-zinc-900">{VIEW_LABELS[view]}</h1>
          <div className="flex items-center gap-3">
            <button className="relative text-zinc-400 hover:text-zinc-700 transition-colors" aria-label="Notifications">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.7}>
                <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
              </svg>
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-amber-400 rounded-full" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-800 text-xs font-bold">AK</div>
              <span className="text-sm text-zinc-600 font-medium hidden sm:block">Arijit Kumar</span>
            </div>
          </div>
        </header>

        {/* Main content */}
        <main className="flex-1 overflow-y-auto p-6">
          {view === "stock"    && <StockView />}
          {view === "customer" && <CustomerView />}
          {view === "sell"     && <SellView />}
          {view === "team"     && <TeamView />}
          {view === "profile"  && <ProfileView />}
        </main>
      </div>
    </div>
  );
}