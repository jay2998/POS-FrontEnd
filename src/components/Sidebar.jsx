import { useMemo, useState } from 'react'

const NAV_SECTIONS = [
  {
    heading: 'Setup',
    items: [
      { path: '/setup/item', label: 'Add Item', description: 'Product form setup', icon: ItemFormIcon },
      { path: '/setup/category', label: 'Category', description: 'Primary classification', icon: CategoryIcon },
      { path: '/setup/subcategory', label: 'Sub Category', description: 'Linked to category', icon: SubCategoryIcon },
      { path: '/setup/item-type', label: 'Item Type', description: 'Billing & stock behaviour', icon: ItemTypeIcon },
      { path: '/setup/manufacturer', label: 'Manufacturer', description: 'Brand registration', icon: IndustryIcon },
      { path: '/setup/supplier', label: 'Supplier', description: 'Vendor management', icon: TruckIcon },
      { path: '/setup/customer', label: 'Customer', description: 'Client registries', icon: UserIcon },
    ],
  },
  {
    heading: 'Stock',
    items: [
      { path: '/stock/opening', label: 'Opening Stock', description: 'Initial stock quantities', icon: ClipboardDocumentListIcon },
      { path: '/stock/expiry-tags', label: 'Expiry Tags', description: 'MFG & expiry tracking', icon: TagIcon },
      { path: '/stock/reorder', label: 'Reorder Mgmt', description: 'Reorder level workflow', icon: ReorderListIcon },
    ],
  },
  {
    heading: 'Sales & Purchases',
    items: [
      { path: '/sales/invoice', label: 'Sales', description: 'Invoice & billing', icon: ShoppingCartIcon },
      { path: '/purchases/entry', label: 'Purchase Entry', description: 'Stock inward (GRN)', icon: ArchiveBoxIcon },
      { path: '/bookings', label: 'Bookings', description: 'Advance reservations', icon: CalendarIcon },
    ],
  },
  {
    heading: 'Expenses',
    items: [
      { path: '/expenses/head', label: 'Expense Head', description: 'Category management', icon: ExpenseHeadIcon },
      { path: '/expenses/voucher', label: 'Expense Voucher', description: 'Record an expense', icon: ExpenseVoucherIcon },
      { path: '/expenses/report', label: 'Expense Report', description: 'Sales vs Expenses', icon: ExpenseReportIcon },
    ],
  },
]

// Flatten for lookups
const ALL_NAV_ITEMS = NAV_SECTIONS.flatMap((s) => s.items)

export default function Sidebar({ currentPath, onNavigate, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const compactPage = currentPath === '/setup/item'

  const currentItem = useMemo(
    () => ALL_NAV_ITEMS.find((item) => item.path === currentPath) || ALL_NAV_ITEMS[0],
    [currentPath],
  )

  return (
    <div className="min-h-screen bg-transparent text-slate-900">
      {/* ── Fixed sidebar ── */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 hidden border-r border-white/70 bg-white/85 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.45)] backdrop-blur xl:flex xl:flex-col ${
          sidebarOpen ? 'w-72' : 'w-24'
        } transition-all duration-300`}
      >
        {/* Logo */}
        <div className="border-b border-slate-100 px-5 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-200">
              <span className="text-xs font-bold tracking-[0.3em] text-white">POS</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-semibold text-slate-900">POS System</p>
                <p className="text-[11px] text-slate-500">Inventory management</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-3">
          {NAV_SECTIONS.map((section) => (
            <div key={section.heading} className="mb-3">
              {/* Section heading */}
              <div className={`px-3 pb-1.5 pt-2 ${sidebarOpen ? '' : 'text-center'}`}>
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">
                  {sidebarOpen ? section.heading : '···'}
                </p>
              </div>
              {/* Section items */}
              <nav className="space-y-0.5">
                {section.items.map(({ path, label, description, icon: Icon }) => {
                  const isActive = path === currentPath
                  return (
                    <button
                      key={path}
                      type="button"
                      onClick={() => onNavigate(path)}
                      className={`flex w-full items-center gap-2.5 rounded-xl px-2.5 py-2 text-left transition ${
                        isActive
                          ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md shadow-teal-200'
                          : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                      }`}
                    >
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
                          isActive ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600'
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      {sidebarOpen && (
                        <div className="min-w-0">
                          <p className="truncate text-[13px] font-semibold leading-tight">{label}</p>
                          <p className={`truncate text-[11px] leading-tight ${isActive ? 'text-teal-50' : 'text-slate-400'}`}>
                            {description}
                          </p>
                        </div>
                      )}
                    </button>
                  )
                })}
              </nav>
            </div>
          ))}
        </div>

        {/* Collapse toggle */}
        <div className="border-t border-slate-100 px-3 py-4">
          <button
            type="button"
            onClick={() => setSidebarOpen((v) => !v)}
            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-4 py-3 text-sm font-medium text-slate-600 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-700"
          >
            <MenuIcon className="h-4 w-4" />
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>

        {/* Logout */}
        <div className="border-t border-slate-100 p-4">
          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium text-rose-600 transition hover:bg-rose-50 hover:text-rose-700"
          >
            <svg className="h-5 w-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            {sidebarOpen && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── Page area (offset by sidebar width) ── */}
      <div
        className={`flex min-h-screen flex-col transition-all duration-300 ${
          sidebarOpen ? 'xl:pl-72' : 'xl:pl-24'
        }`}
      >
        {/* Topbar */}
        <header
          className={`sticky top-0 z-10 border-b border-white/70 bg-white/75 px-4 backdrop-blur sm:px-6 lg:px-8 ${
            compactPage ? 'py-2.5' : 'py-4'
          }`}
        >
          <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {/* Mobile menu button */}
              <button
                type="button"
                onClick={() => setSidebarOpen((v) => !v)}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:text-teal-700 xl:hidden"
              >
                <MenuIcon className="h-5 w-5" />
              </button>
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-teal-600">
                  Setup module
                </p>
                <h1 className={`${compactPage ? 'text-lg' : 'text-xl'} font-semibold text-slate-900`}>
                  {currentItem.label}
                </h1>
              </div>
            </div>

            {!compactPage && (
              <div className="hidden items-center gap-3 rounded-2xl border border-white/80 bg-white px-4 py-3 shadow-sm sm:flex">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-500 text-sm font-bold text-white">
                  A
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-900">Admin</p>
                  <p className="text-xs text-slate-500">POS configuration</p>
                </div>
              </div>
            )}
          </div>
        </header>

        {/* Main content — centered */}
        <main className={`flex flex-1 justify-center px-4 sm:px-6 lg:px-8 ${compactPage ? 'py-3' : 'py-6'}`}>
          <div className="w-full max-w-5xl">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

// ── Icons ──────────────────────────────────────────────────────────────────

function CategoryIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59l7 7a2 2 0 010 2.82l-7 7a2 2 0 01-2.82 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" />
    </svg>
  )
}

function SubCategoryIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a3 3 0 006 0M9 5a3 3 0 016 0" />
    </svg>
  )
}

function ItemTypeIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10" />
    </svg>
  )
}

function ItemFormIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 13h6M9 17h6M9 9h1" />
    </svg>
  )
}

function MenuIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
    </svg>
  )
}

function ExpenseHeadIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  )
}

function ExpenseVoucherIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-3-3h6v6m-9 9l-6-6 6-6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10V5a2 2 0 012-2h4l4 4h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  )
}

function ExpenseReportIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
    </svg>
  )
}

function IndustryIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function TruckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l3 5v6H8m12-11V5H3v13h2m0 0a2 2 0 104 0m-4 0a2 2 0 114 0m7 0a2 2 0 104 0m-4 0a2 2 0 114 0M8 7H3" />
    </svg>
  )
}

function UserIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function ShoppingCartIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
    </svg>
  )
}

function CalendarIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
    </svg>
  )
}

function ArchiveBoxIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
    </svg>
  )
}

function ClipboardDocumentListIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
    </svg>
  )
}

function TagIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M7 7h.01M3 11l8.586 8.586a2 2 0 002.828 0L21 13.414a2 2 0 000-2.828L12.414 2H5a2 2 0 00-2 2v7z"
      />
    </svg>
  )
}

function ReorderListIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 12h10M7 17h10M5 7h.01M5 12h.01M5 17h.01" />
    </svg>
  )
}