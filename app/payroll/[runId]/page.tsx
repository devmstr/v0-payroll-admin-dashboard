// app/payroll/[runId]/page.tsx
import { prisma } from '@/lib/prisma'
import { generatePayslipForEmployee, finalizeRun } from '@/lib/payroll/service'
import { revalidatePath } from 'next/cache'

export default async function RunPage({
  params
}: {
  params: { runId: string }
}) {
  const run = await prisma.payrollRun.findUnique({
    where: { id: params.runId }
  })
  const employees = await prisma.employee.findMany({ take: 50 })

  async function genAll() {
    'use server'
    for (const e of employees) {
      await generatePayslipForEmployee(params.runId, e.id)
    }
    revalidatePath(`/payroll/${params.runId}`)
  }

  async function approve() {
    'use server'
    await finalizeRun(params.runId)
    revalidatePath(`/payroll/${params.runId}`)
  }

  const slips = await prisma.payslip.findMany({
    where: { payrollRunId: params.runId }
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          Run #{run?.id} — {run?.month}/{run?.year}
        </h1>
        <form action={approve}>
          <button className="px-4 py-2 border rounded-md">Approve</button>
        </form>
      </div>

      <form action={genAll}>
        <button className="px-4 py-2 border rounded-md">
          Generate payslips
        </button>
      </form>

      <div className="grid gap-3">
        {slips.map((s: any) => (
          <a
            key={s.id}
            href={`/payslips/${s.id}`}
            className="p-3 border rounded-md flex justify-between"
          >
            <span>Payslip {s.id}</span>
            <span>Net: {Number(s.net).toFixed(2)}</span>
          </a>
        ))}
      </div>
    </div>
  )
}
