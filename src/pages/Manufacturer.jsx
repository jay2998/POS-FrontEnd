import { useState } from 'react'
import { Card, Field, PageShell, SectionHeader, StatusAlert, Toggle } from '../components/PageShell.jsx'

const API = '/api/manufacturers'

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

function FactoryIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  )
}

function createEmptyForm() {
  return {
    manufacturerId: '',
    manufacturerName: '',
    address: '',
    email: '',
    phone: '',
    contactPerson: '',
    mobileNumber: '',
    designation: '',
    ntn: '',
    gstNumber: '',
    status: true,
  }
}

export default function ManufacturerPage() {
  const [form, setForm] = useState(createEmptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()

    if (!form.manufacturerId.trim() || !form.manufacturerName.trim()) {
      setError('Manufacturer ID and Name are required.')
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
          manufacturerId: form.manufacturerId.trim(),
          manufacturerName: form.manufacturerName.trim(),
          contactPerson: form.contactPerson.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          address: form.address.trim(),
          mobileNumber: form.mobileNumber.trim(),
          designation: form.designation.trim(),
          ntn: form.ntn.trim(),
          gstNumber: form.gstNumber.trim(),
          status: form.status,
        }),
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || 'Failed to save manufacturer')
      }

      setSuccess('Manufacturer saved successfully.')
      setForm(createEmptyForm())
    } catch (err) {
      setError(err.message || 'Unable to save the manufacturer.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateField(key, value) {
    setForm((current) => ({ ...current, [key]: value }))
  }

  return (
    <PageShell
      title="Add Manufacturer"
      description="Register a new manufacturer to link with your products."
      accent="from-teal-600 via-emerald-600 to-cyan-700"
    >
      <Card className="mx-auto max-w-5xl border-l-[6px] border-l-teal-500 p-3.5">
        <SectionHeader
          title="Manufacturer Registration"
          description="Enter primary, contact, and tax details for the new manufacturer."
          icon={<FactoryIcon className="h-6 w-6" />}
        />

        <StatusAlert type="error" message={error} />
        <StatusAlert type="success" message={success} />

        <form onSubmit={handleSubmit} className="space-y-3">
          <SectionCard color="teal" title="Primary Details">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Manufacturer ID" required>
                <input
                  type="text"
                  value={form.manufacturerId}
                  onChange={(e) => updateField('manufacturerId', e.target.value)}
                  placeholder="e.g. MFG-001"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
              <Field label="Manufacturer Name" required className="lg:col-span-2">
                <input
                  type="text"
                  value={form.manufacturerName}
                  onChange={(e) => updateField('manufacturerName', e.target.value)}
                  placeholder="Full name of manufacturer"
                  className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                />
              </Field>
            </div>
          </SectionCard>

          <SectionCard color="emerald" title="Contact & Personnel">
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                <Field label="Contact Person">
                  <input
                    type="text"
                    value={form.contactPerson}
                    onChange={(e) => updateField('contactPerson', e.target.value)}
                    placeholder="Representative name"
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                </Field>
                <Field label="Designation">
                  <input
                    type="text"
                    value={form.designation}
                    onChange={(e) => updateField('designation', e.target.value)}
                    placeholder="e.g. Sales Manager"
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                </Field>
                <Field label="Email Address">
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    placeholder="contact@manufacturer.com"
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                </Field>
                <Field label="Phone/Landline">
                  <input
                    type="tel"
                    value={form.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    placeholder="Phone number"
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                </Field>
                <Field label="Mobile Number">
                  <input
                    type="tel"
                    value={form.mobileNumber}
                    onChange={(e) => updateField('mobileNumber', e.target.value)}
                    placeholder="Mobile number"
                    className="h-10 w-full rounded-md border border-slate-300 bg-white px-3 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                </Field>
              </div>
              <div className="grid gap-4">
                <Field label="Physical Address">
                  <textarea
                    rows={2}
                    value={form.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="Complete headquarters or factory address"
                    className="w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-[13px] outline-none transition focus:border-teal-400 focus:ring-3 focus:ring-teal-100"
                  />
                </Field>
              </div>
            </div>
          </SectionCard>

          <div className="grid gap-3 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.85fr)]">
            <SectionCard color="cyan" title="Tax Information">
              <div className="grid gap-4 sm:grid-cols-2">
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
              <SectionCard color="teal" title="System Settings">
                <Toggle
                  enabled={form.status}
                  onChange={(v) => updateField('status', v)}
                  label="Manufacturer Status"
                  description="Active manufacturers are selectable."
                />
              </SectionCard>

              <SectionCard color="emerald" title="Actions">
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
                    className="inline-flex min-w-[140px] items-center justify-center rounded-lg bg-teal-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? 'Saving...' : 'Save Manufacturer'}
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
