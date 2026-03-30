import { useEffect, useMemo, useRef, useState } from 'react'
import { Card, PageShell, StatusAlert, TableState } from '../components/PageShell.jsx'

const API_ITEMS = '/api/items'
const API_CATEGORIES = '/api/categories'
const API_SUPPLIERS = '/api/suppliers'

function RefreshIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
    </svg>
  )
}

function SearchIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
    </svg>
  )
}

// Custom specialized Metric Card
function MetricCard({ title, value, valueColor }) {
  return (
    <div className="flex flex-col rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <p className="text-[12px] font-medium text-slate-500 uppercase tracking-wide">{title}</p>
      <p className={`mt-2 text-2xl font-bold ${valueColor}`}>{value}</p>
    </div>
  )
}

function toLocalYMD(d) {
  const yyyy = d.getFullYear()
  const mm = String(d.getMonth() + 1).padStart(2, '0')
  const dd = String(d.getDate()).padStart(2, '0')
  return `${yyyy}-${mm}-${dd}`
}

export default function OpeningStockPage() {
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(false)
  const [stockSavingById, setStockSavingById] = useState({})
  const [stockSaveError, setStockSaveError] = useState('')

  // Tracks last persisted values so we can revert on save failure.
  const originalStockByIdRef = useRef(new Map())

  // Filters
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('')
  const [supplierFilter, setSupplierFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const today = useMemo(() => toLocalYMD(new Date()), [])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    setLoading(true)
    setStockSaveError('')
    try {
      const [itmRes, catRes, supRes] = await Promise.all([
        fetch(API_ITEMS).catch(() => ({ ok: false })),
        fetch(API_CATEGORIES).catch(() => ({ ok: false })),
        fetch(API_SUPPLIERS).catch(() => ({ ok: false })),
      ])

      let nextItems = []
      let nextCategories = []
      let nextSuppliers = []

      if (itmRes.ok) {
        const d = await itmRes.json()
        nextItems = Array.isArray(d) ? d : d.data || []
      }
      if (catRes.ok) {
        const d = await catRes.json()
        nextCategories = Array.isArray(d) ? d : d.data || []
      }
      if (supRes.ok) {
        const d = await supRes.json()
        nextSuppliers = Array.isArray(d) ? d : d.data || []
      }

      // Demo fallback (only when we truly have no items).
      if (!nextItems || nextItems.length === 0) {
        nextItems = [
          { id: 1, item_name: 'cfsfs', barcode: '2132b2a7-81fa-4653-a31d...', category_id: 1, supplier: 'Star Suppliers', store_location: 'F3', item_unit: 'Piece', purchase_price: 112, sale_price: 113, opening_stock: 44, created_at: '2026-03-30' },
          { id: 2, item_name: 'Orange', barcode: '824117f4-d526-403d-ba33...', category_id: 2, supplier: 'Fresh Foods Ltd', store_location: 'B3', item_unit: 'Dozen', purchase_price: 400, sale_price: 450, opening_stock: 50, created_at: '2026-03-30' },
          { id: 3, item_name: 'Milk one liter', barcode: 'ff9bfa3a-6d2e-4cb8-80b7...', category_id: 3, supplier: 'Super Mart Suppliers', store_location: 'D1', item_unit: 'Liter', purchase_price: 350, sale_price: 400, opening_stock: 50, created_at: '2026-03-28' },
          { id: 4, item_name: 'Panadol', barcode: '422aa369-c1a6-4aaa-9e29...', category_id: 4, supplier: 'Star Suppliers', store_location: 'A2', item_unit: 'Piece', purchase_price: 50, sale_price: 60, opening_stock: 600, created_at: '2026-03-26' },
          { id: 5, item_name: 'Saw', barcode: '76b7bbb3-4536-4aff-824c...', category_id: 5, supplier: 'Quick Supply Co', store_location: 'A3', item_unit: 'Piece', purchase_price: 1200, sale_price: 1400, opening_stock: 50, created_at: '2026-03-26' },
          { id: 6, item_name: 'Eggs', barcode: 'd1d6be3e-d3be-4636-ade3...', category_id: 6, supplier: '-', store_location: 'B2', item_unit: 'Dozen', purchase_price: 200, sale_price: 210, opening_stock: 50, created_at: '2026-03-25' },
        ]

        nextCategories = [
          { id: 1, category_name: 'Cosmetics' },
          { id: 2, category_name: 'Fruits' },
          { id: 3, category_name: 'Dairy Products' },
          { id: 4, category_name: 'Pharmacy' },
          { id: 5, category_name: 'Hardware Tools' },
          { id: 6, category_name: 'Meat & Poultry' },
        ]

        const uniqueSuppliers = [...new Set(nextItems.map((i) => i.supplier).filter(Boolean))]
        nextSuppliers = uniqueSuppliers.map((name, idx) => ({ id: idx + 1, supplier_name: name }))
      }

      setItems(nextItems)
      setCategories(nextCategories)
      setSuppliers(nextSuppliers)

      originalStockByIdRef.current = new Map(
        nextItems.map((i) => [i.id, Number(i.opening_stock) || 0]),
      )
    } catch (e) {
      console.error(e)
    }

    setLoading(false)
  }

  const handleStockInputChange = (itemId, newStockRaw) => {
    setItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, opening_stock: newStockRaw } : i)),
    )
  }

  async function commitStockChange(itemId, newStockRaw) {
    const isSaving = stockSavingById[itemId]
    if (isSaving) return

    const lastSaved = originalStockByIdRef.current.get(itemId) ?? 0
    const nextNumber = newStockRaw === '' ? 0 : Number(newStockRaw)
    if (Number.isNaN(nextNumber)) return
    if (nextNumber === lastSaved) return

    setStockSaveError('')
    setStockSavingById((prev) => ({ ...prev, [itemId]: true }))
    try {
      const res = await fetch(`${API_ITEMS}/${itemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ opening_stock: nextNumber }),
      })
      if (!res.ok) throw new Error('save stock failed')

      originalStockByIdRef.current.set(itemId, nextNumber)
    } catch (e) {
      // Revert UI to last persisted value.
      setItems((prev) => prev.map((i) => (i.id === itemId ? { ...i, opening_stock: lastSaved } : i)))
      setStockSaveError('Failed to save stock change. Please try again.')
    } finally {
      setStockSavingById((prev) => {
        const copy = { ...prev }
        delete copy[itemId]
        return copy
      })
    }
  }

  // Apply Filters
  const filteredItems = useMemo(() => {
    return items.filter(item => {
      // Name/Barcode/Supplier universal search
      const s = search.toLowerCase()
      const matchesSearch = !s || 
                            item.item_name?.toLowerCase().includes(s) || 
                            item.barcode?.toLowerCase().includes(s) || 
                            item.supplier?.toLowerCase().includes(s) ||
                            item.supplier_name?.toLowerCase().includes(s)
      
      const matchesCat = !categoryFilter || String(item.category_id) === String(categoryFilter)
      const supplierTokens = [item.supplier, item.supplier_name, item.supplier_id].filter(Boolean).map(String)
      const matchesSup = !supplierFilter || supplierTokens.includes(String(supplierFilter))
      const matchesDate = !dateFilter || (item.created_at || '').includes(dateFilter)

      return matchesSearch && matchesCat && matchesSup && matchesDate
    })
  }, [items, search, categoryFilter, supplierFilter, dateFilter])

  // Derive Metrics from the loaded payload
  const totalItems = items.length
  const totalStock = items.reduce((sum, item) => sum + (Number(item.opening_stock) || 0), 0)
  const purchaseValue = items.reduce((sum, item) => sum + ((Number(item.opening_stock) || 0) * (Number(item.purchase_price) || 0)), 0)
  const saleValue = items.reduce((sum, item) => sum + ((Number(item.opening_stock) || 0) * (Number(item.sale_price) || 0)), 0)

  // Map categories to names seamlessly
  const getCategoryName = (id) => {
    const c = categories.find(cat => String(cat.id) === String(id))
    return c ? c.category_name : 'Uncategorized'
  }

  return (
    <PageShell
      title="Opening Stock"
      description="View and manage initial stock quantities."
      accent="from-teal-600 via-emerald-600 to-cyan-700"
    >
      <div className="space-y-6 max-w-[1400px] mx-auto">
        
        {/* Header Ribbon identical to UI Screenshot */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-2xl font-bold text-teal-600">Opening Stock</h1>
            <p className="text-sm text-slate-500">View and manage initial stock quantities</p>
          </div>
          <button
            onClick={fetchData}
            className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-[13px] font-semibold text-slate-700 shadow-sm hover:bg-slate-50 transition"
          >
            <RefreshIcon className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* 4 Cards Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <MetricCard title="Total Items" value={totalItems.toLocaleString()} valueColor="text-teal-500" />
          <MetricCard title="Stock on Hand (SOH)" value={totalStock.toLocaleString()} valueColor="text-teal-500" />
          <MetricCard title="Purchase Value" value={`Rs ${purchaseValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} valueColor="text-teal-600" />
          <MetricCard title="Sale Value" value={`Rs ${saleValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`} valueColor="text-teal-600" />
        </div>

        {/* Filter Stock */}
        <Card className="p-4 border-l-[6px] border-l-teal-500">
          <div className="flex items-center gap-2 mb-4">
            <span className="h-4 w-1 bg-teal-500 rounded-full block"></span>
            <h2 className="text-[13px] font-bold text-slate-800 tracking-wide uppercase">Filter Stock</h2>
          </div>

          <StatusAlert type="error" message={stockSaveError} />

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Search</label>
              <div className="relative">
                <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <input
                  type="text"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Name, category, supplier, barcode..."
                  className="h-8 w-full rounded-md border border-slate-300 bg-white pl-8 pr-3 text-[12px] outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category ({categories.length})</label>
              <select
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 text-[12px] outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">All Categories</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.category_name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Supplier ({suppliers.length})</label>
              <select
                value={supplierFilter}
                onChange={e => setSupplierFilter(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 text-[12px] outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              >
                <option value="">All Suppliers</option>
                {/* Fallback to unique item suppliers if supplier list is empty */}
                {suppliers.length > 0 ? (
                   suppliers.map(s => <option key={s.id} value={s.supplier_name || s.id}>{s.supplier_name || s.id}</option>)
                ) : (
                   [...new Set(items.map(i => i.supplier).filter(Boolean))].map((s, idx) => (
                      <option key={idx} value={s}>{s}</option>
                   ))
                )}
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">Date Added</label>
              <input
                type="date"
                max={today}
                value={dateFilter}
                onChange={e => setDateFilter(e.target.value)}
                className="h-8 w-full rounded-md border border-slate-300 bg-white px-2.5 text-[12px] outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
              />
            </div>
          </div>
          
          <div className="flex justify-between items-center mt-5 pt-4 border-t border-slate-100">
            <p className="text-[12px] text-slate-500">
              Showing <strong className="text-slate-800">{filteredItems.length}</strong> of <strong className="text-slate-800">{items.length}</strong> items
            </p>
            <button
              onClick={() => { setSearch(''); setCategoryFilter(''); setSupplierFilter(''); setDateFilter('') }}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[12px] font-semibold text-slate-600 hover:bg-slate-50 transition"
            >
              <RefreshIcon className="h-3.5 w-3.5" /> Reset
            </button>
          </div>
        </Card>

        {/* Data Table */}
        <Card className="overflow-hidden">
          <div className="overflow-x-auto w-full">
            <table className="min-w-full divide-y divide-slate-100 text-left">
              <thead className="bg-[#f8fafc]">
                <tr className="text-[12px] font-bold uppercase tracking-widest text-slate-500">
                  <th className="px-4 py-4 w-12 text-center">#</th>
                  <th className="px-4 py-4 min-w-[180px]">ITEM NAME</th>
                  <th className="px-4 py-4">CATEGORY</th>
                  <th className="px-4 py-4">SUPPLIER</th>
                  <th className="px-4 py-4">SHELF</th>
                  <th className="px-4 py-4">UNIT</th>
                  <th className="px-4 py-4 text-right">PURCHASE PRICE</th>
                  <th className="px-4 py-4 text-right">SALE PRICE</th>
                  <th className="px-4 py-4 text-center">STOCK</th>
                  <th className="px-4 py-4">ADDED</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {filteredItems.length === 0 ? (
                  <tr>
                    <td colSpan="10">
                      <TableState message="No items match the current filters." />
                    </td>
                  </tr>
                ) : (
                  filteredItems.map((item, idx) => (
                    <tr key={item.id || idx} className="text-[12px] transition hover:bg-slate-50/50">
                      <td className="px-4 py-3 text-center text-slate-400">{idx + 1}</td>
                      <td className="px-4 py-3">
                        <div className="font-bold text-slate-800">{item.item_name}</div>
                        <div className="text-[10px] text-slate-400 font-mono mt-0.5 max-w-[120px] truncate">{item.barcode || item.id}</div>
                      </td>
                      <td className="px-4 py-3">
                        {/* Purple pill for category */}
                        <span className="inline-flex items-center rounded-full bg-teal-50 border border-teal-100 px-2.5 py-1 text-[12px] font-semibold text-teal-700">
                          {getCategoryName(item.category_id)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 truncate max-w-[140px]">{item.supplier || '-'}</td>
                      <td className="px-4 py-3 text-slate-600">
                        <span className="inline-flex items-center rounded-md border border-slate-200 bg-slate-50 px-2 py-0.5 text-[12px] font-semibold text-slate-700">
                          {item.store_location || '-'}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600">{item.item_unit || '-'}</td>
                      <td className="px-4 py-3 text-right font-semibold text-teal-600">Rs {Number(item.purchase_price || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-right font-semibold text-teal-600">Rs {Number(item.sale_price || 0).toFixed(2)}</td>
                      <td className="px-4 py-3 text-center">
                        <div className="relative inline-block">
                          <input
                            type="number"
                            min="0"
                            step="1"
                            value={item.opening_stock ?? ''}
                            disabled={!!stockSavingById[item.id]}
                            onChange={(e) => handleStockInputChange(item.id, e.target.value === '' ? '' : e.target.value)}
                            onBlur={(e) => commitStockChange(item.id, e.target.value)}
                            className="h-8 w-16 rounded-full bg-amber-50 border border-amber-200 text-amber-900 font-bold text-center outline-none transition focus:border-amber-400 focus:bg-amber-100 focus:ring-2 focus:ring-amber-200/50 hover:bg-amber-100 cursor-text pr-7 disabled:cursor-not-allowed disabled:bg-amber-50/60"
                          />
                          <svg
                            className={`absolute top-1/2 -translate-y-1/2 right-2 h-3.5 w-3.5 text-amber-500 opacity-70 pointer-events-none ${stockSavingById[item.id] ? 'opacity-40' : ''}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                          </svg>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-slate-500 whitespace-nowrap">
                        {item.created_at ? new Date(item.created_at).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(/ /g, '-') : '-'}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>

      </div>
    </PageShell>
  )
}