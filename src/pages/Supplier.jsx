import { useState } from 'react'
import { Card, Field, PageShell, SectionHeader, StatusAlert, Toggle } from '../components/PageShell.jsx'

const API = '/api/suppliers'

const sectionStyles = {
  emerald: { accent: 'bg-emerald-500', header: 'border-emerald-100 bg-emerald-50/80' },
  teal: { accent: 'bg-teal-500', header: 'border-teal-100 bg-teal-50/80' },
  cyan: { accent: 'bg-cyan-500', header: 'border-cyan-100 bg-cyan-50/80' },
}

function SectionCard({ color, title, children }) {
  const style = sectionStyles[color] ?? sectionStyles.teal
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
          {placeholder && <option value="">{placeholder}</option>}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400">
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </Field>
  )
}

function TruckIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7h12m0 0l3 5v6H8m12-11V5H3v13h2m0 0a2 2 0 104 0m-4 0a2 2 0 114 0m7 0a2 2 0 104 0m-4 0a2 2 0 114 0M8 7H3" />
    </svg>
  )
}

function createEmptyForm() {
  return {
    supplierName: '',
    contactPerson: '',
    designation: '',
    phone: '',
    email: '',
    address: '',
    ntn: '',
    gstNumber: '',
    paymentTerms: 'Cash',
    creditLimit: '',
    status: true,
  }
}

export default function SupplierPage() {
  const [form, setForm] = useState(createEmptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.supplierName.trim() || !form.paymentTerms) {
      setError('Supplier Name and Payment Terms are required.')
      return
    }

    if (form.paymentTerms === 'Credit' && (!form.creditLimit || parseFloat(form.creditLimit) <= 0)) {
      setError('A valid Credit Limit is required when Terms are Credit.')
      return
    }

    setSubmitting(true)
    setError('')
    setSuccess('')

    try {
      const response = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          supplierName: form.supplierName.trim(),
          contactPerson: form.contactPerson.trim(),
          designation: form.designation.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          ntn: form.ntn.trim(),
          gstNumber: form.gstNumber.trim(), // sent but likely ignored by backend
          paymentTerms: form.paymentTerms,
          creditLimit: form.paymentTerms === 'Credit' ? parseFloat(form.creditLimit) : null,
          status: form.status,
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Failed to save supplier')
      }

      setSuccess('Supplier saved successfully.')
      setForm(createEmptyForm())
    } catch (err) {
      setError(err.message || 'Unable to save the supplier.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateField(key, value) {
    setForm((current) => {
      const updated = { ...current, [key]: value }
      if (key === 'paymentTerms' && value === 'Cash') {
        updated.creditLimit = ''
      }
      return updated
    })
  }

  return (
    <PageShell
      title="Add Supplier"
      description="Register your warehouse or material suppliers to log product purchases."
      accent="from-teal-600 via-emerald-600 to-cyan-700"
    >
      <Card className="mx-auto max-w-5xl border-l-[6px] border-l-teal-500 p-3.5">
        <SectionHeader
          title="Supplier Registration"
          description="Enter vendor contact, operation location, and commercial terms."
          icon={<TruckIcon className="h-6 w-6" />}
        />

        <StatusAlert type="error" message={error} />
        <StatusAlert type="success" message={success} />

        <form onSubmit={handleSubmit} className="space-y-3">
          <SectionCard color="teal" title="Business & Contact Details">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Supplier Name" required className="lg:col-span-3">
                <input
                  type="text"
                  value={form.supplierName}
                  onChange={(e) => updateField('supplierName', e.target.value)}
                  placeholder="Official company or provider name"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
              <Field label="Contact Person">
                <input
                  type="text"
                  value={form.contactPerson}
                  onChange={(e) => updateField('contactPerson', e.target.value)}
                  placeholder="Key account representative"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
              <Field label="Designation">
                <input
                  type="text"
                  value={form.designation}
                  onChange={(e) => updateField('designation', e.target.value)}
                  placeholder="e.g. Distributor Manager"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
              <Field label="Phone/Mobile Number">
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="Dial number"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
              <Field label="Email Address">
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
                  placeholder="supplier@domain.com"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
              <Field label="Commercial Address" className="sm:col-span-2">
                <input
                  type="text"
                  value={form.address}
                  onChange={(e) => updateField('address', e.target.value)}
                  placeholder="Operating address"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
            </div>
          </SectionCard>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)]">
            <SectionCard color="emerald" title="Financial & Tax">
              <div className="grid gap-4 sm:grid-cols-2">
                <SelectField
                  label="Payment Terms"
                  required
                  value={form.paymentTerms}
                  onChange={(v) => updateField('paymentTerms', v)}
                  options={[
                    { value: 'Cash', label: 'Cash' },
                    { value: 'Credit', label: 'Credit' }
                  ]}
                />
                <Field label="Credit Limit" required={form.paymentTerms === 'Credit'}>
                  <div className="relative">
                    <input
                      type="number"
                      min="0"
                      step="0.01"
                      disabled={form.paymentTerms === 'Cash'}
                      value={form.creditLimit}
                      onChange={(e) => updateField('creditLimit', e.target.value)}
                      placeholder="0.00"
                      className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 pr-12 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:opacity-60"
                    />
                    <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-[10px] font-semibold uppercase tracking-wider text-slate-400">
                      PKR
                    </span>
                  </div>
                </Field>
                <Field label="NTN">
                  <input
                    type="text"
                    value={form.ntn}
                    onChange={(e) => updateField('ntn', e.target.value)}
                    placeholder="National Tax Number"
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                </Field>
                <Field label="GST Number">
                  <input
                    type="text"
                    value={form.gstNumber}
                    onChange={(e) => updateField('gstNumber', e.target.value)}
                    placeholder="Sales Tax Number"
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                </Field>
              </div>
            </SectionCard>

            <div className="flex flex-col gap-3">
              <SectionCard color="cyan" title="System Settings">
                <Toggle
                  enabled={form.status}
                  onChange={(v) => updateField('status', v)}
                  label="Supplier Status"
                  description="Active suppliers can be invoiced."
                />
              </SectionCard>

              <SectionCard color="teal" title="Actions">
                <div className="flex flex-wrap items-center justify-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setForm(createEmptyForm())
                      setError('')
                      setSuccess('')
                    }}
                    className="inline-flex min-w-[120px] items-center justify-center rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50"
                  >
                    Clear
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex min-w-[130px] items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Saving...' : 'Save Supplier'}
                  </button>
                </div>
              </SectionCard>
            </div>
          </div>
        </form>
      </Card>
    </PageShell>
  )
}
