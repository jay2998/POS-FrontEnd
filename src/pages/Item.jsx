import { useEffect, useMemo, useState } from 'react'
import { Card, Field, PageShell, SectionHeader, StatusAlert } from '../components/PageShell.jsx'

const API = '/api'

const SUBCATEGORY_OPTIONS = ['General', 'Packaged Goods', 'Loose Items', 'Prepared Items']
const MANUFACTURER_OPTIONS = ['Unassigned', 'Nestle', 'Unilever', 'National Foods', 'Generic Brand']
const SUPPLIER_OPTIONS = ['Walk-in Supplier', 'Metro Supplier', 'Local Distributor', 'Direct Purchase']
const LOCATION_OPTIONS = ['Main Store', 'Warehouse', 'Front Rack', 'Cold Storage']
const UNIT_OPTIONS = ['Piece', 'Pack', 'Box', 'Kg', 'Liter']

function createEmptyForm() {
  return {
    category_id: '',
    item_type_id: '',
    subcategory_name: '',
    item_name: '',
    manufacturer: '',
    supplier: '',
    purchase_price: '',
    sale_price: '',
    opening_stock: '',
    barcode: '',
    description: '',
    store_location: '',
    item_unit: '',
    per_unit: '',
    reorder_level: '',
    is_enable: true,
    image_name: '',
  }
}

const sectionStyles = {
  lime: {
    accent: 'bg-lime-500',
    header: 'border-lime-100 bg-lime-50/80',
  },
  sky: {
    accent: 'bg-sky-500',
    header: 'border-sky-100 bg-sky-50/80',
  },
  violet: {
    accent: 'bg-violet-500',
    header: 'border-violet-100 bg-violet-50/80',
  },
  emerald: {
    accent: 'bg-emerald-500',
    header: 'border-emerald-100 bg-emerald-50/80',
  },
  amber: {
    accent: 'bg-amber-500',
    header: 'border-amber-100 bg-amber-50/80',
  },
}

export default function ItemPage() {
  const [form, setForm] = useState(createEmptyForm)
  const [categories, setCategories] = useState([])
  const [itemTypes, setItemTypes] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchLookups()
  }, [])

  const enabledCategories = useMemo(
    () => categories.filter((category) => category.is_enable === 1 || category.is_enable === true),
    [categories],
  )

  const enabledItemTypes = useMemo(
    () => itemTypes.filter((itemType) => itemType.is_enable === 1 || itemType.is_enable === true),
    [itemTypes],
  )

  async function fetchLookups() {
    try {
      const [categoriesResponse, itemTypesResponse] = await Promise.all([
        fetch(`${API}/categories`),
        fetch(`${API}/item-types`),
      ])

      const categoriesData = await categoriesResponse.json()
      const itemTypesData = await itemTypesResponse.json()

      setCategories(Array.isArray(categoriesData) ? categoriesData : categoriesData.data || [])
      setItemTypes(Array.isArray(itemTypesData) ? itemTypesData : itemTypesData.data || [])
    } catch {
      setError('Unable to load some dropdown options. You can still continue filling the form.')
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.category_id || !form.item_type_id || !form.item_name.trim()) {
      setError('Category, item type, and item name are required.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API}/items`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_id: form.category_id,
          item_type_id: form.item_type_id,
          subcategory_name: form.subcategory_name,
          item_name: form.item_name.trim(),
          manufacturer: form.manufacturer,
          supplier: form.supplier,
          purchase_price: form.purchase_price,
          sale_price: form.sale_price,
          opening_stock: form.opening_stock,
          barcode: form.barcode.trim(),
          description: form.description.trim(),
          store_location: form.store_location,
          item_unit: form.item_unit,
          per_unit: form.per_unit,
          reorder_level: form.reorder_level,
          is_enable: form.is_enable ? 1 : 0,
        }),
      })

      if (!response.ok) {
        throw new Error('save item')
      }

      setSuccess('Item form submitted successfully.')
      setForm(createEmptyForm())
    } catch {
      setError('Item save route is not available yet. The page and form layout are ready on the frontend.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  function handleImageChange(event) {
    const file = event.target.files?.[0]
    updateField('image_name', file ? file.name : '')
  }

  function resetForm() {
    setForm(createEmptyForm())
    setError('')
    setSuccess('')
  }

  return (
    <PageShell
      title="Add new item"
      description="A compact item-entry page using the same soft card layout, grouped sections, and dropdown/input rhythm as your example screen."
      accent="from-teal-600 via-emerald-600 to-cyan-700"
    >
      <Card className="mx-auto max-w-6xl border-l-[6px] border-l-teal-500 p-3.5">
        <SectionHeader
          title="New item registration"
          description="Fill the core item information, pricing, details, image, and status."
          icon={<ItemFormIcon className="h-6 w-6" />}
        />

        <StatusAlert type="error" message={error} />
        <StatusAlert type="success" message={success} />

        <form onSubmit={handleSubmit} className="space-y-2">
          <SectionCard color="lime" title="Basic information">
            <div className="grid gap-2 xl:grid-cols-[1fr_1fr_1.05fr]">
              <SelectField
                label="Item category"
                required
                value={form.category_id}
                onChange={(value) => updateField('category_id', value)}
                options={enabledCategories.map((category) => ({ value: category.id, label: category.category_name }))}
                placeholder="Select category"
              />
              <SelectField
                label="Item type"
                required
                value={form.item_type_id}
                onChange={(value) => updateField('item_type_id', value)}
                options={enabledItemTypes.map((itemType) => ({ value: itemType.id, label: itemType.type_name }))}
                placeholder="Select item type"
              />
              <SelectField
                label="Sub-category"
                value={form.subcategory_name}
                onChange={(value) => updateField('subcategory_name', value)}
                options={SUBCATEGORY_OPTIONS.map((item) => ({ value: item, label: item }))}
                placeholder="Select sub-category"
              />
              <Field label="Item name" required className="xl:col-span-3">
                <input
                  type="text"
                  value={form.item_name}
                  onChange={(event) => updateField('item_name', event.target.value)}
                  placeholder="Enter item name"
                  className="h-10 w-full max-w-lg rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard color="sky" title="Supplier & pricing">
            <div className="space-y-2">
              <div className="grid gap-2 xl:grid-cols-[1fr_1fr_148px]">
                <SelectField
                  label="Manufacturer"
                  value={form.manufacturer}
                  onChange={(value) => updateField('manufacturer', value)}
                  options={MANUFACTURER_OPTIONS.map((item) => ({ value: item, label: item }))}
                  placeholder="Select manufacturer"
                />
                <SelectField
                  label="Supplier"
                  value={form.supplier}
                  onChange={(value) => updateField('supplier', value)}
                  options={SUPPLIER_OPTIONS.map((item) => ({ value: item, label: item }))}
                  placeholder="Select supplier"
                />
                <Field label="Barcode">
                  <input
                    type="text"
                    value={form.barcode}
                    onChange={(event) => updateField('barcode', event.target.value)}
                    placeholder="Enter barcode"
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                </Field>
              </div>
              <div className="grid gap-1.5 sm:grid-cols-3 xl:max-w-[29rem]">
                <CompactInput
                  label="Purchase price"
                  value={form.purchase_price}
                  onChange={(value) => updateField('purchase_price', value)}
                  placeholder="0.00"
                  suffix="PKR"
                />
                <CompactInput
                  label="Sale price"
                  value={form.sale_price}
                  onChange={(value) => updateField('sale_price', value)}
                  placeholder="0.00"
                  suffix="PKR"
                />
                <CompactInput
                  label="Opening stock"
                  value={form.opening_stock}
                  onChange={(value) => updateField('opening_stock', value)}
                  placeholder="0"
                  suffix="units"
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard color="violet" title="Description & details">
            <div className="space-y-2">
              <div className="grid gap-2 xl:grid-cols-[1.15fr_1fr_148px]">
                <Field label="Description" className="xl:col-span-2">
                  <textarea
                    rows={2}
                    value={form.description}
                    onChange={(event) => updateField('description', event.target.value)}
                    placeholder="Enter item description..."
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                </Field>
                <SelectField
                  label="Store location"
                  value={form.store_location}
                  onChange={(value) => updateField('store_location', value)}
                  options={LOCATION_OPTIONS.map((item) => ({ value: item, label: item }))}
                  placeholder="Select location"
                />
                <SelectField
                  label="Item unit"
                  value={form.item_unit}
                  onChange={(value) => updateField('item_unit', value)}
                  options={UNIT_OPTIONS.map((item) => ({ value: item, label: item }))}
                  placeholder="Select unit"
                />
              </div>
              <div className="grid gap-1.5 sm:grid-cols-2 xl:max-w-[19rem]">
                <CompactInput
                  label="Per unit"
                  value={form.per_unit}
                  onChange={(value) => updateField('per_unit', value)}
                  placeholder="0"
                  suffix="per pack"
                />
                <CompactInput
                  label="Reorder level"
                  value={form.reorder_level}
                  onChange={(value) => updateField('reorder_level', value)}
                  placeholder="0"
                  suffix="units"
                />
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-2 items-start xl:grid-cols-[minmax(0,1.1fr)_270px_205px]">
            <SectionCard color="emerald" title="Product image">
              <label className="flex cursor-pointer items-center gap-2.5 rounded-lg border border-dashed border-slate-300 bg-slate-50 px-3 py-2.5 transition hover:border-teal-300 hover:bg-teal-50/40">
                <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-sky-500 shadow-sm">
                  <UploadIcon className="h-4 w-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-[13px] font-semibold text-sky-600">Upload image</p>
                  <p className="mt-0.5 truncate text-xs text-slate-500">{form.image_name || 'PNG, JPG, SVG up to 10MB'}</p>
                </div>
              </label>
            </SectionCard>

            <SectionCard color="amber" title="Status">
              <ItemStatusToggle
                enabled={form.is_enable}
                onChange={(value) => updateField('is_enable', value)}
                label="Item status"
                description="Active items remain available across the frontend system."
              />
            </SectionCard>

            <SectionCard color="lime" title="Actions">
              <div className="flex flex-col justify-center gap-1.5">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex w-full items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {submitting ? 'Saving...' : 'Save item'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="inline-flex w-full items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                >
                  Clear form
                </button>
              </div>
            </SectionCard>
          </div>
        </form>
      </Card>
    </PageShell>
  )
}

function SectionCard({ color, title, children }) {
  const style = sectionStyles[color] ?? sectionStyles.lime

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-2.5 shadow-sm shadow-slate-100/50">
      <div className={`mb-2 flex items-center gap-2.5 rounded-md border px-2.5 py-1.5 ${style.header}`}>
        <span className={`h-4 w-1 rounded-full ${style.accent}`} />
        <h3 className="text-[13px] font-semibold text-slate-800">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function SelectField({ label, required = false, value, onChange, options, placeholder }) {
  return (
    <Field label={label} required={required}>
      <div className="relative">
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="h-9 w-full appearance-none rounded-md border border-slate-300 bg-white px-2.5 pr-8 text-[12px] outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        >
          <option value="">{placeholder}</option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
          <ChevronDownIcon className="h-4 w-4" />
        </div>
      </div>
    </Field>
  )
}

function CompactInput({ label, value, onChange, placeholder, suffix }) {
  return (
    <Field label={label} className="max-w-[9.25rem]">
      <div className="relative w-full">
        <input
          type="text"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          className="h-8 w-full rounded-md border border-slate-300 bg-white px-2 pr-9 text-[12px] outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
        />
        <span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-[9px] font-medium uppercase tracking-[0.12em] text-slate-400">
          {suffix}
        </span>
      </div>
    </Field>
  )
}

function ItemStatusToggle({ enabled, onChange, label, description }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-lg border border-slate-200 bg-slate-50 px-3 py-3">
      <div>
        <p className="text-[13px] font-semibold text-slate-800">{label}</p>
        <p className="mt-1 text-[11px] text-slate-500">{description}</p>
      </div>
      <button
        type="button"
        aria-pressed={enabled}
        onClick={() => onChange(!enabled)}
        className={`inline-flex items-center gap-2.5 rounded-full border px-2 py-1 transition ${
          enabled
            ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
            : 'border-slate-200 bg-white text-slate-500'
        }`}
      >
        <span className="min-w-9 text-[11px] font-semibold uppercase tracking-[0.14em]">
          {enabled ? 'On' : 'Off'}
        </span>
        <span
          className={`relative inline-flex h-7 w-12 items-center rounded-full transition ${
            enabled ? 'bg-emerald-500' : 'bg-slate-300'
          }`}
        >
          <span
            className={`inline-block h-5 w-5 rounded-full bg-white shadow transition ${
              enabled ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </span>
      </button>
    </div>
  )
}

function ItemFormIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 3h7l5 5v11a2 2 0 01-2 2H7a2 2 0 01-2-2V5a2 2 0 012-2z" /><path strokeLinecap="round" strokeLinejoin="round" d="M14 3v5h5M9 13h6M9 17h6M9 9h1" /></svg>
}

function UploadIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M3 15a4 4 0 014-4 5 5 0 019.7-1.5A3.5 3.5 0 1120.5 15H15" /><path strokeLinecap="round" strokeLinejoin="round" d="M12 12v7m0-7l-3 3m3-3l3 3" /></svg>
}

function ChevronDownIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
}