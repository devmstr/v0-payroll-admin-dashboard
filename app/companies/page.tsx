import Link from 'next/link'
import { listCompanies } from './actions'
import { AddCompanyDialog } from './_components/add-company-dialog'
import { CompaniesToolbar } from './_components/companies-toolbar'
import { ActionsMenu } from './_components/company-actions'

export const dynamic = 'force-dynamic'

type PageProps = {
  searchParams?: { q?: string; cursor?: string | null; take?: string }
}

export default async function CompaniesPage({ searchParams }: PageProps) {
  const q = searchParams?.q ?? ''
  const cursor = searchParams?.cursor ?? null
  const take = searchParams?.take ? Number(searchParams.take) : undefined

  const { items, nextCursor, hasNext } = await listCompanies({
    q,
    cursor,
    take
  })

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Companies</h1>
        <div className="flex gap-2">
          <CompaniesToolbar initialQuery={q} />
          <AddCompanyDialog />
        </div>
      </div>

      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr className="text-left">
              <th className="p-3 w-[26%]">Name</th>
              <th className="p-3">NIF</th>
              <th className="p-3">CNAS #</th>
              <th className="p-3">Email</th>
              <th className="p-3">Phone</th>
              <th className="p-3">Address</th>
              <th className="p-3 w-[120px]">Created</th>
              <th className="p-3 w-[80px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 ? (
              <tr>
                <td
                  colSpan={8}
                  className="p-6 text-center text-muted-foreground"
                >
                  {q
                    ? 'No companies match your query.'
                    : 'No companies yet. Use “Add Company” to create one.'}
                </td>
              </tr>
            ) : (
              items.map((c) => (
                <tr key={c.id} className="border-t">
                  <td className="p-3 font-medium">
                    <Link
                      className="underline underline-offset-2"
                      href={`/companies/${c.id}`}
                    >
                      {c.name}
                    </Link>
                  </td>
                  <td className="p-3">{c.nif ?? '—'}</td>
                  <td className="p-3">{c.cnasNumber ?? '—'}</td>
                  <td className="p-3">{c.phone ?? '—'}</td>
                  <td className="p-3">{c.address ?? '—'}</td>
                  <td className="p-3">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    <ActionsMenu company={c} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between">
        {/* Previous is simply back via query-less pagination (we're using cursor forward only).
           If you want bi-directional, add a prev stack in URL state. */}
        <div />
        {hasNext ? (
          <Link
            className="text-sm underline"
            href={`/companies?${new URLSearchParams({
              q,
              cursor: nextCursor ?? ''
            }).toString()}`}
          >
            Next →
          </Link>
        ) : (
          <span className="text-sm text-muted-foreground">End of results</span>
        )}
      </div>
    </div>
  )
}
