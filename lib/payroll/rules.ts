import { PrismaClient } from '@prisma/client'
import type { PayrollRules, TaxBracket } from './types'

const prisma = new PrismaClient()

export async function loadRules(
  companyId?: string,
  at = new Date()
): Promise<PayrollRules> {
  const where = {
    companyId: companyId ?? null,
    effectiveFrom: { lte: at },
    OR: [{ effectiveTo: null }, { effectiveTo: { gte: at } }]
  }

  const rows = await prisma.rulesConfig.findMany({ where })
  const get = (key: string) => rows.find((r) => r.key === key)?.value

  const irg = get('IRG.table') as { brackets: TaxBracket[] } | undefined

  return {
    cnasEmployeeRate: (get('CNAS.employeeRate') as any)?.rate ?? 0,
    cnasEmployerRate: (get('CNAS.employerRate') as any)?.rate ?? 0,
    snmg: (get('SNMG') as any)?.monthly ?? undefined,
    irgBrackets: irg?.brackets ?? []
  }
}
