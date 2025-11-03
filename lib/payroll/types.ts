export type Money = number
export type Rate = number // 0..1

export type TaxBracket = { upTo: Money | null; rate: Rate; deduction?: Money }

export type PayrollRules = {
  cnasEmployeeRate: Rate
  cnasEmployerRate: Rate
  snmg?: Money
  irgBrackets: TaxBracket[]
}

export type PayrollInput = {
  baseSalary: Money
  allowances: { key: string; label: string; amount: Money }[]
  deductions: { key: string; label: string; amount: Money }[]
  cnasEligible: boolean
}

export type Line = {
  kind: 'allow' | 'deduct'
  key: string
  label: string
  amount: Money
}

export type PayrollOutput = {
  gross: Money
  net: Money
  totalAllow: Money
  totalDeduct: Money
  lines: Line[]
  employerCharges: { key: string; label: string; amount: Money }[]
}
