import { useEffect, useState } from 'react'
import { Card, Field, PageShell, SectionHeader, StatusAlert, Toggle } from '../components/PageShell.jsx'

const API = '/api'

export default function CategoryPage() {
  const [categoryName, setCategoryName] = useState('')
  const [isEnabled, setIsEnabled] = useState(true)
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [editId, setEditId] = useState(null)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    setError('')

    try {
      const response = await fetch(`${API}/categories`)
      const data = await response.json()
      setCategories(Array.isArray(data) ? data : data.data || [])
    } catch {
      setError('Failed to load categories.')
    } finally {
      setLoading(false)
    }
  }

  async function handleSubmit(event) {
    event.preventDefault()

    if (!categoryName.trim()) {
      setError('Category name is required.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(editId ? `${API}/categories/${editId}` : `${API}/categories`, {
        method: editId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          category_name: categoryName.trim(),
          is_enable: isEnabled ? 1 : 0,
        }),
      })

      if (!response.ok) {
        throw new Error('save category')
      }

      setSuccess(editId ? 'Category updated successfully.' : 'Category created successfully.')
      resetForm()
      fetchCategories()
    } catch {
      setError('Failed to save category. Please check the backend connection.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleDelete(id) {
    if (!window.confirm('Delete this category?')) {
      return
    }

    try {
      const response = await fetch(`${API}/categories/${id}`, { method: 'DELETE' })
      if (!response.ok) {
        throw new Error('delete category')
      }

      setSuccess('Category deleted successfully.')
      fetchCategories()
    } catch {
      setError('Failed to delete category.')
    }
  }

  function handleEdit(category) {
    setEditId(category.id)
    setCategoryName(category.category_name || '')
    setIsEnabled(category.is_enable === 1 || category.is_enable === true)
    setError('')
    setSuccess('')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  function resetForm() {
    setEditId(null)
    setCategoryName('')
    setIsEnabled(true)
    setError('')
  }

  return (
    <PageShell
      title="Category setup"
      description="Create the top-level POS categories your team will use for item grouping, reporting, and subcategory assignment."
      accent="from-teal-600 via-emerald-600 to-cyan-700"
    >
      <div className="space-y-5">
        <Card className="border-l-[6px] border-l-teal-500">
          <SectionHeader
            title={editId ? 'Edit category' : 'New category'}
            description="Keep names short and easy to scan at the counter."
            icon={<CategoryIcon className="h-6 w-6" />}
          />

          <StatusAlert type="error" message={error} />
          <StatusAlert type="success" message={success} />

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <Field label="Category name" required hint="Example: Groceries, Bakery, Pharmacy">
              <input
                type="text"
                value={categoryName}
                onChange={(event) => setCategoryName(event.target.value)}
                placeholder="Enter category name"
                className="h-10 w-full max-w-sm rounded-md border border-slate-300 bg-white px-3 text-[13px] text-slate-700 outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
              />
            </Field>

            <Toggle
              enabled={isEnabled}
              onChange={setIsEnabled}
              label="Enable category"
              description="Use the toggle when the category should appear in active POS lists."
            />

            <div className="flex flex-wrap justify-end gap-3 pt-1">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex min-w-36 items-center justify-center rounded-xl bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {submitting ? 'Saving...' : editId ? 'Update category' : 'Add category'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Clear
              </button>
            </div>
          </form>
        </Card>

        <Card>
          <SectionHeader
            title="Category list"
            description={`${categories.length} categories available`}
            icon={<ListIcon className="h-6 w-6" />}
            action={
              <button
                type="button"
                onClick={fetchCategories}
                className="rounded-2xl border border-slate-200 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
              >
                Refresh
              </button>
            }
          />

          {loading ? (
            <TableState message="Loading categories..." />
          ) : categories.length === 0 ? (
            <TableState message="No categories found yet." />
          ) : (
            <div className="overflow-hidden rounded-2xl border border-slate-100">
              <div className="overflow-x-auto lg:max-h-[22rem] lg:overflow-y-auto">
                <table className="min-w-full divide-y divide-slate-100">
                  <thead className="bg-slate-50">
                    <tr className="text-left text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                      <th className="px-4 py-4">#</th>
                      <th className="px-4 py-4">Category</th>
                      <th className="px-4 py-4">Status</th>
                      <th className="px-4 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {categories.map((category, index) => (
                      <tr key={category.id ?? index} className="text-sm text-slate-700">
                        <td className="px-4 py-4 text-slate-400">{index + 1}</td>
                        <td className="px-4 py-4 font-medium text-slate-900">{category.category_name}</td>
                        <td className="px-4 py-4">
                          <StatusChip enabled={category.is_enable === 1 || category.is_enable === true} />
                        </td>
                        <td className="px-4 py-4">
                          <div className="flex justify-end gap-2">
                            <ActionButton label="Edit" tone="teal" onClick={() => handleEdit(category)} />
                            <ActionButton label="Delete" tone="rose" onClick={() => handleDelete(category.id)} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  )
}

function TableState({ message }) {
  return <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center text-sm text-slate-500">{message}</div>
}

function StatusChip({ enabled }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${enabled ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
      {enabled ? 'Enabled' : 'Disabled'}
    </span>
  )
}

function ActionButton({ label, tone, onClick }) {
  const tones = {
    teal: 'bg-teal-50 text-teal-700 hover:bg-teal-100',
    rose: 'bg-rose-50 text-rose-700 hover:bg-rose-100',
  }

  return (
    <button type="button" onClick={onClick} className={`rounded-xl px-3 py-2 text-xs font-semibold transition ${tones[tone]}`}>
      {label}
    </button>
  )
}

function CategoryIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M7 7h.01M7 3h5c.53 0 1.04.21 1.41.59l7 7a2 2 0 010 2.82l-7 7a2 2 0 01-2.82 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>
}

function ListIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" /></svg>
}
