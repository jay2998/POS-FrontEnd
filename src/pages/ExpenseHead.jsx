import { useState } from 'react'
import { Card, Field, PageShell, SectionHeader, StatusAlert } from '../components/PageShell.jsx'

const API = '/api'

const sectionStyles = {
  lime: { accent: 'bg-lime-500', header: 'border-lime-100 bg-lime-50/80' },
  sky: { accent: 'bg-sky-500', header: 'border-sky-100 bg-sky-50/80' },
  amber: { accent: 'bg-amber-500', header: 'border-amber-100 bg-amber-50/80' },
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

function FolderIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
    </svg>
  )
}

export default function ExpenseHeadPage() {
  const [form, setForm] = useState({ head: '', description: '' })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.head.trim()) {
      setError('Head name is required.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API}/expense-heads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          head: form.head.trim(),
          description: form.description.trim(),
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save expense head')
      }

      setSuccess('Expense head registered successfully.')
      setForm({ head: '', description: '' })
    } catch {
      setError('Unable to save the expense head. Ensure the server is online.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <PageShell
      title="Expense Head Registration"
      description="Create categories or heads for categorising your business expenses."
      accent="from-teal-600 via-emerald-600 to-cyan-700"
    >
      <Card className="mx-auto max-w-4xl border-l-[6px] border-l-teal-500 p-3.5">
        <SectionHeader
          title="New Expense Head"
          description="Define a new expense category."
          icon={<FolderIcon className="h-6 w-6" />}
        />

        <StatusAlert type="error" message={error} />
        <StatusAlert type="success" message={success} />

        <form onSubmit={handleSubmit} className="space-y-3">
          <SectionCard color="sky" title="Category Details">
            <div className="grid gap-4 sm:grid-cols-[1fr_2fr]">
              <Field label="Head Name" required>
                <input
                  type="text"
                  value={form.head}
                  onChange={(event) => updateField('head', event.target.value)}
                  placeholder="e.g. Office Supplies"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>

              <Field label="Description">
                <textarea
                  rows={2}
                  value={form.description}
                  onChange={(event) => updateField('description', event.target.value)}
                  placeholder="Optional details about this expense category..."
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
            </div>
          </SectionCard>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setForm({ head: '', description: '' })
                setError('')
                setSuccess('')
              }}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Clear form
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-w-[120px] items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving...' : 'Save head'}
            </button>
          </div>
        </form>
      </Card>
    </PageShell>
  )
}
