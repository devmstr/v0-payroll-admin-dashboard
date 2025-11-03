import { describe, expect, it } from 'vitest'
import { runPayroll } from './engine'
import type { PayrollRules } from './types'

const rules: PayrollRules = {
  cnasEmployeeRate: 0, // fill with SRS
  cnasEmployerRate: 0,
  snmg: undefined,
  irgBrackets: [] // fill with SRS examples
}

describe('runPayroll', () => {
  it('computes net for simple base salary', () => {
    const out = runPayroll(rules, {
      baseSalary: 100_000,
      allowances: [],
      deductions: [],
      cnasEligible: true
    })
    expect(out.gross).toBe(100_000)
    // expect(out.net).toBe(/* SRS expected */);
  })
})
