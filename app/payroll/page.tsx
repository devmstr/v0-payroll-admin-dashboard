// app/payroll/page.tsx
import Link from 'next/link'
import { prisma } from '@/lib/prisma' // create a thin wrapper exporting a singleton PrismaClient
import { revalidatePath } from 'next/cache'

async function createRun() {
  'use server'
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  const run = await prisma.payrollRun.upsert({
    where: {
      companyId_month_year: { companyId: 'default-company', month, year }
    },
    update: {},
    create: { companyId: 'default-company', month, year }
  })
  revalidatePath('/payroll')
  return run.id
}

export default async function PayrollPage() {
  const runs = await prisma.payrollRun.findMany({
    orderBy: [{ year: 'desc' }, { month: 'desc' }]
  })
  return (
    <div className="p-6 space-y-4">
      <form action={createRun}>
        <button className="px-4 py-2 rounded-md border">
          Create current month run
        </button>
      </form>
      <ul className="space-y-2">
        {runs.map((r: any) => (
          <li key={r.id} className="border rounded-md p-3 flex justify-between">
            <span>
              {String(r.month).padStart(2, '0')}/{r.year} – {r.status}
            </span>
            <Link className="underline" href={`/payroll/${r.id}`}>
              Open
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
