import { useMemo, useState } from 'react'

const NAV_ITEMS = [
  {
    path: '/setup/item',
    label: 'Add Item',
    description: 'Product form setup',
    icon: ItemFormIcon,
  },
  {
    path: '/setup/category',
    label: 'Category',
    description: 'Primary classification',
    icon: CategoryIcon,
  },
  {
    path: '/setup/subcategory',
    label: 'Sub Category',
    description: 'Linked to category',
    icon: SubCategoryIcon,
  },
  {
    path: '/setup/item-type',
    label: 'Item Type',
    description: 'Billing and stock behaviour',
    icon: ItemTypeIcon,
  },
]

export default function Sidebar({ currentPath, onNavigate, onLogout, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const compactPage = currentPath === '/setup/item'

  const currentItem = useMemo(
    () => NAV_ITEMS.find((item) => item.path === currentPath) || NAV_ITEMS[0],
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
        <div className="border-b border-slate-100 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg shadow-teal-200">
              <span className="text-sm font-bold tracking-[0.3em] text-white">POS</span>
            </div>
            {sidebarOpen && (
              <div>
                <p className="text-sm font-semibold text-slate-900">POS System</p>
                <p className="text-xs text-slate-500">Setup management</p>
              </div>
            )}
          </div>
        </div>

        {/* Nav */}
        <div className="flex-1 overflow-y-auto px-3 py-5">
          <div className={`px-3 ${sidebarOpen ? '' : 'text-center'}`}>
            <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-slate-400">
              {sidebarOpen ? 'Navigation' : '···'}
            </p>
          </div>
          <nav className="mt-4 space-y-2">
            {NAV_ITEMS.map(({ path, label, description, icon: Icon }) => {
              const isActive = path === currentPath
              return (
                <button
                  key={path}
                  type="button"
                  onClick={() => onNavigate(path)}
                  className={`flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left transition ${
                    isActive
                      ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-lg shadow-teal-200'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <div
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                      isActive ? 'bg-white/20 text-white' : 'bg-teal-50 text-teal-600'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  {sidebarOpen && (
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{label}</p>
                      <p className={`truncate text-xs ${isActive ? 'text-teal-50' : 'text-slate-400'}`}>
                        {description}
                      </p>
                    </div>
                  )}
                </button>
              )
            })}
          </nav>
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