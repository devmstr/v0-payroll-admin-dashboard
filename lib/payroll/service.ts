'use server'

import { PrismaClient } from '@prisma/client'
import { loadRules } from './rules'
import { runPayroll } from './engine'

const prisma = new PrismaClient()

export async function generatePayslipForEmployee(
  payrollRunId: string,
  employeeId: string
) {
  const emp = await prisma.employee.findUnique({
    where: { id: employeeId },
    include: {
      contracts: {
        where: { endDate: null },
        take: 1,
        orderBy: { startDate: 'desc' }
      }
    }
  })
  if (!emp) throw new Error('Employee not found')
  const contract = emp.contracts[0]
  if (!contract) throw new Error('No active contract')

  const rules = await loadRules()
  const result = runPayroll(rules, {
    baseSalary: Number(contract.baseSalary),
    allowances: [], // Pull from DB or page form
    deductions: [],
    cnasEligible: contract.cnasEligible
  })

  const payslip = await prisma.payslip.create({
    data: {
      payrollRunId,
      employeeId,
      gross: result.gross,
      net: result.net,
      totalAllow: result.totalAllow,
      totalDeduct: result.totalDeduct,
      details: result
    }
  })

  return payslip
}

export async function finalizeRun(runId: string) {
  return prisma.payrollRun.update({
    where: { id: runId },
    data: { status: 'approved' }
  })
}
