import { useEffect, useState } from 'react'
import { Card, Field, PageShell, SectionHeader, StatusAlert } from '../components/PageShell.jsx'

const API = '/api'

const sectionStyles = {
  lime: { accent: 'bg-lime-500', header: 'border-lime-100 bg-lime-50/80' },
  sky: { accent: 'bg-sky-500', header: 'border-sky-100 bg-sky-50/80' },
  violet: { accent: 'bg-violet-500', header: 'border-violet-100 bg-violet-50/80' },
  emerald: { accent: 'bg-emerald-500', header: 'border-emerald-100 bg-emerald-50/80' },
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
          className="h-10 w-full appearance-none rounded-md border border-slate-300 bg-white px-3 pr-8 text-[13px] outline-none transition focus:border-teal-400 focus:ring-2 focus:ring-teal-100"
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

function ChevronDownIcon({ className }) {
  return <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" /></svg>
}

function ReceiptIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 14l6-6m-3-3h6v6m-9 9l-6-6 6-6" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 10V5a2 2 0 012-2h4l4 4h6a2 2 0 012 2v10a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
    </svg>
  )
}

export default function ExpenseVoucherPage() {
  const [form, setForm] = useState({ head: '', details: '', amount: '', voucherDate: '' })
  const [heads, setHeads] = useState([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    // Set default date to today
    const today = new Date().toISOString().split('T')[0]
    setForm((current) => ({ ...current, voucherDate: today }))

    // Fetch expense heads for dropdown
    async function fetchHeads() {
      try {
        const res = await fetch(`${API}/expense-heads`)
        if (res.ok) {
          const data = await res.json()
          setHeads(data)
        }
      } catch (err) {
        console.error('Failed to fetch heads')
      }
    }
    fetchHeads()
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.head || !form.amount || !form.voucherDate) {
      setError('Date, Expense Head, and Amount are required.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(`${API}/expense-vouchers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          head: form.head,
          details: form.details.trim(),
          amount: parseFloat(form.amount) || 0,
          voucherDate: form.voucherDate
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to save expense voucher')
      }

      setSuccess('Expense voucher saved successfully.')
      // Reset numeric and text fields while keeping date
      const today = new Date().toISOString().split('T')[0]
      setForm({ head: '', details: '', amount: '', voucherDate: today })
    } catch {
      setError('Unable to save the expense voucher. Ensure the server is online.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <PageShell
      title="Expense Voucher"
      description="Record an outbound payment for expenses."
      accent="from-teal-600 via-emerald-600 to-cyan-700"
    >
      <Card className="mx-auto max-w-4xl border-l-[6px] border-l-teal-500 p-3.5">
        <SectionHeader
          title="Create Expense Voucher"
          description="Record an individual expense against a head."
          icon={<ReceiptIcon className="h-6 w-6" />}
        />

        <StatusAlert type="error" message={error} />
        <StatusAlert type="success" message={success} />

        <form onSubmit={handleSubmit} className="space-y-3">
          <SectionCard color="violet" title="Voucher Details">
            <div className="grid gap-4 md:grid-cols-[150px_1fr] lg:grid-cols-[160px_1fr_180px]">
              <Field label="Date" required>
                <input
                  type="date"
                  value={form.voucherDate}
                  onChange={(event) => updateField('voucherDate', event.target.value)}
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>

              <SelectField
                label="Expense Head"
                required
                value={form.head}
                onChange={(value) => updateField('head', value)}
                options={heads.map((h) => ({ value: h.id, label: h.head }))}
                placeholder="Select expense head"
              />

              <Field label="Amount" required className="md:col-span-2 lg:col-span-1">
                <div className="relative w-full">
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={form.amount}
                    onChange={(event) => updateField('amount', event.target.value)}
                    placeholder="0.00"
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-12 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                  <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                    PKR
                  </span>
                </div>
              </Field>

              <Field label="Additional Details" className="md:col-span-2 lg:col-span-3">
                <textarea
                  rows={2}
                  value={form.details}
                  onChange={(event) => updateField('details', event.target.value)}
                  placeholder="Reason for expense, invoice reference, etc..."
                  className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
            </div>
          </SectionCard>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={() => {
                setForm({ head: '', details: '', amount: '', voucherDate: new Date().toISOString().split('T')[0] })
                setError('')
                setSuccess('')
              }}
              className="inline-flex items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
            >
              Clear
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex min-w-[120px] items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting ? 'Saving...' : 'Save voucher'}
            </button>
          </div>
        </form>
      </Card>
    </PageShell>
  )
}
