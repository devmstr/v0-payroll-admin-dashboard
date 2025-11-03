import type {
  PayrollInput,
  PayrollOutput,
  PayrollRules,
  Money,
  Line
} from './types'

function clampMinWage(gross: Money, snmg?: Money): Money {
  if (!snmg) return gross
  return Math.max(gross, snmg)
}

function computeIRG(
  taxBase: Money,
  brackets: PayrollRules['irgBrackets']
): Money {
  // Progressive calculation: iterate ascending, last bracket has upTo=null
  let tax = 0
  let remaining = taxBase
  let prevLimit = 0

  for (const b of brackets) {
    const limit = b.upTo ?? Number.POSITIVE_INFINITY
    const band = Math.max(0, Math.min(remaining, limit - prevLimit))
    if (band <= 0) break
    tax += band * b.rate - (b.deduction ?? 0)
    remaining -= band
    prevLimit = limit
  }
  return Math.max(0, Number(tax.toFixed(2)))
}

export function runPayroll(
  rules: PayrollRules,
  input: PayrollInput
): PayrollOutput {
  const allowsTotal = input.allowances.reduce((s, a) => s + a.amount, 0)
  const deductsTotal = input.deductions.reduce((s, d) => s + d.amount, 0)

  const gross = clampMinWage(input.baseSalary + allowsTotal, rules.snmg)
  const cnasEmployee = input.cnasEligible
    ? +(gross * rules.cnasEmployeeRate).toFixed(2)
    : 0

  // Tax base = gross - employee social + allowed deductions (per SRS; adjust if needed)
  const taxBase = Math.max(0, gross - cnasEmployee)
  const irg = computeIRG(taxBase, rules.irgBrackets)

  const net = +(gross - cnasEmployee - irg - deductsTotal).toFixed(2)

  const lines: Line[] = [
    ...input.allowances.map((a) => ({ kind: 'allow', ...a })),
    ...input.deductions.map((d) => ({ kind: 'deduct', ...d })),
    ...(cnasEmployee
      ? [
          {
            kind: 'deduct',
            key: 'cnas_employee',
            label: 'CNAS (salarié)',
            amount: cnasEmployee
          } as Line
        ]
      : []),
    ...(irg
      ? [{ kind: 'deduct', key: 'irg', label: 'IRG', amount: irg } as Line]
      : [])
  ]

  const employerCharges = input.cnasEligible
    ? [
        {
          key: 'cnas_employer',
          label: 'CNAS (employeur)',
          amount: +(gross * rules.cnasEmployerRate).toFixed(2)
        }
      ]
    : []

  return {
    gross: +gross.toFixed(2),
    net,
    totalAllow: +allowsTotal.toFixed(2),
    totalDeduct: +(cnasEmployee + irg + deductsTotal).toFixed(2),
    lines,
    employerCharges
  }
}
