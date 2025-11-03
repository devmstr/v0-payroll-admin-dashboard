import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCompany } from '../actions'

export default async function CompanyDetails({
  params
}: {
  params: { id: string }
}) {
  const company = await getCompany(params.id)
  if (!company) return notFound()

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">{company.name}</h1>
        <Link className="text-sm underline" href="/companies">
          ← Back
        </Link>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="border rounded-md p-4">
          <h2 className="font-medium mb-2">Company Info</h2>
          <div className="space-y-2 text-sm">
            <div>
              <span className="text-muted-foreground">NIF:</span>{' '}
              {company.nif ?? '—'}
            </div>
            <div>
              <span className="text-muted-foreground">CNAS #:</span>{' '}
              {company.cnasNumber ?? '—'}
            </div>
            <div>
              <span className="text-muted-foreground">Phone:</span>{' '}
              {company.phone ?? '—'}
            </div>
            <div>
              <span className="text-muted-foreground">Address:</span>{' '}
              {company.address ?? '—'}
            </div>
            <div>
              <span className="text-muted-foreground">Created:</span>{' '}
              {new Date(company.createdAt).toLocaleString()}
            </div>
          </div>
        </div>

        {/* Placeholder boxes you can expand later */}
        <div className="border rounded-md p-4">
          <h2 className="font-medium mb-2">Employees</h2>
          <p className="text-sm text-muted-foreground">
            Link this section once Employees are DB-backed.
          </p>
        </div>
        <div className="border rounded-md p-4">
          <h2 className="font-medium mb-2">Recent Payroll Runs</h2>
          <p className="text-sm text-muted-foreground">
            List latest runs for this company here.
          </p>
        </div>
      </div>
    </div>
  )
}
