// app/payslips/[id]/page.tsx
import { prisma } from '@/lib/prisma'

export default async function PayslipPage({
  params
}: {
  params: { id: string }
}) {
  const s = await prisma.payslip.findUnique({ where: { id: params.id } })
  if (!s) return <div className="p-6">Not found</div>
  const details = s.details as any

  return (
    <div className="max-w-3xl m-auto p-6 space-y-4 bg-white print:bg-white">
      <h1 className="text-2xl font-bold">Bulletin de paie</h1>
      <div className="grid grid-cols-2 gap-2">
        <div>Brut: {Number(s.gross).toFixed(2)}</div>
        <div>Net: {Number(s.net).toFixed(2)}</div>
        <div>Allocations: {Number(s.totalAllow).toFixed(2)}</div>
        <div>Déductions: {Number(s.totalDeduct).toFixed(2)}</div>
      </div>

      <div className="space-y-2">
        <h2 className="font-semibold">Détails</h2>
        <div className="grid grid-cols-3 gap-1">
          {(details.lines ?? []).map((l: any) => (
            <div
              key={l.key}
              className="flex justify-between border-b py-1 col-span-3"
            >
              <span>{l.label}</span>
              <span>
                {l.kind === 'allow' ? '+' : '-'}
                {Number(l.amount).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </div>

      <button
        onClick={() => window.print()}
        className="px-4 py-2 border rounded-md"
      >
        Imprimer
      </button>
    </div>
  )
}
