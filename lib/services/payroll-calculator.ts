import Decimal from "decimal.js"

// Configure Decimal.js for financial precision
Decimal.set({ precision: 20, rounding: Decimal.ROUND_HALF_UP })

export interface EmployeePayrollInput {
  baseSalary: Decimal
  overtimeHours?: Decimal
  overtimeRate?: Decimal
  bonus?: Decimal
  commission?: Decimal
  allowances?: Decimal

  // Tax information
  taxFilingStatus: "single" | "married" | "head_of_household"
  taxAllowances: number
  stateCode: string

  // Deductions
  healthInsurancePremium?: Decimal
  retirement401kPercent?: Decimal
  otherDeductions?: Decimal
}

export interface PayrollCalculationResult {
  // Earnings
  basePay: Decimal
  overtime: Decimal
  bonus: Decimal
  commission: Decimal
  allowances: Decimal
  grossPay: Decimal

  // Deductions
  federalTax: Decimal
  stateTax: Decimal
  socialSecurity: Decimal
  medicare: Decimal
  healthInsurance: Decimal
  retirement401k: Decimal
  otherDeductions: Decimal
  totalDeductions: Decimal

  // Net
  netPay: Decimal
}

/**
 * Pure function to calculate payroll
 * Deterministic and testable
 */
export function calculatePayroll(input: EmployeePayrollInput): PayrollCalculationResult {
  // Calculate earnings
  const basePay = input.baseSalary
  const overtime = calculateOvertime(input.overtimeHours, input.overtimeRate)
  const bonus = input.bonus || new Decimal(0)
  const commission = input.commission || new Decimal(0)
  const allowances = input.allowances || new Decimal(0)

  const grossPay = basePay.plus(overtime).plus(bonus).plus(commission).plus(allowances)

  // Calculate deductions
  const federalTax = calculateFederalTax(grossPay, input.taxFilingStatus, input.taxAllowances)

  const stateTax = calculateStateTax(grossPay, input.stateCode)

  const socialSecurity = calculateSocialSecurity(grossPay)

  const medicare = calculateMedicare(grossPay)

  const healthInsurance = input.healthInsurancePremium || new Decimal(0)

  const retirement401k = input.retirement401kPercent
    ? grossPay.times(input.retirement401kPercent).dividedBy(100)
    : new Decimal(0)

  const otherDeductions = input.otherDeductions || new Decimal(0)

  const totalDeductions = federalTax
    .plus(stateTax)
    .plus(socialSecurity)
    .plus(medicare)
    .plus(healthInsurance)
    .plus(retirement401k)
    .plus(otherDeductions)

  // Calculate net pay
  const netPay = grossPay.minus(totalDeductions)

  return {
    basePay,
    overtime,
    bonus,
    commission,
    allowances,
    grossPay,
    federalTax,
    stateTax,
    socialSecurity,
    medicare,
    healthInsurance,
    retirement401k,
    otherDeductions,
    totalDeductions,
    netPay,
  }
}

/**
 * Calculate overtime pay
 */
function calculateOvertime(hours?: Decimal, rate?: Decimal): Decimal {
  if (!hours || !rate) return new Decimal(0)
  return hours.times(rate)
}

/**
 * Calculate federal income tax (simplified 2024 brackets)
 * In production, use actual IRS tax tables
 */
function calculateFederalTax(grossPay: Decimal, filingStatus: string, allowances: number): Decimal {
  // Simplified calculation - in production, use actual tax tables
  const annualGross = grossPay.times(12)
  const standardDeduction = filingStatus === "married" ? 29200 : 14600
  const allowanceAmount = allowances * 4700

  const taxableIncome = annualGross.minus(standardDeduction).minus(allowanceAmount)

  if (taxableIncome.lessThanOrEqualTo(0)) return new Decimal(0)

  // Simplified progressive tax calculation
  let tax = new Decimal(0)

  if (taxableIncome.greaterThan(11000)) {
    tax = tax.plus(new Decimal(11000).times(0.1))
  }

  if (taxableIncome.greaterThan(44725)) {
    tax = tax.plus(new Decimal(44725 - 11000).times(0.12))
  }

  if (taxableIncome.greaterThan(95375)) {
    tax = tax.plus(new Decimal(95375 - 44725).times(0.22))
  }

  // Return monthly tax
  return tax.dividedBy(12)
}

/**
 * Calculate state income tax (simplified)
 * In production, use actual state tax tables
 */
function calculateStateTax(grossPay: Decimal, stateCode: string): Decimal {
  // Simplified state tax rates
  const stateTaxRates: Record<string, number> = {
    CA: 0.093,
    NY: 0.0685,
    TX: 0, // No state income tax
    FL: 0, // No state income tax
    // Add more states as needed
  }

  const rate = stateTaxRates[stateCode] || 0.05 // Default 5%
  return grossPay.times(rate)
}

/**
 * Calculate Social Security tax (6.2% up to wage base)
 */
function calculateSocialSecurity(grossPay: Decimal): Decimal {
  const SOCIAL_SECURITY_RATE = new Decimal(0.062)
  const WAGE_BASE_LIMIT = new Decimal(168600) // 2024 limit

  const annualGross = grossPay.times(12)

  if (annualGross.greaterThan(WAGE_BASE_LIMIT)) {
    return WAGE_BASE_LIMIT.times(SOCIAL_SECURITY_RATE).dividedBy(12)
  }

  return grossPay.times(SOCIAL_SECURITY_RATE)
}

/**
 * Calculate Medicare tax (1.45% + 0.9% additional for high earners)
 */
function calculateMedicare(grossPay: Decimal): Decimal {
  const MEDICARE_RATE = new Decimal(0.0145)
  const ADDITIONAL_MEDICARE_THRESHOLD = new Decimal(200000)
  const ADDITIONAL_MEDICARE_RATE = new Decimal(0.009)

  const annualGross = grossPay.times(12)

  let tax = grossPay.times(MEDICARE_RATE)

  if (annualGross.greaterThan(ADDITIONAL_MEDICARE_THRESHOLD)) {
    const additionalAmount = annualGross.minus(ADDITIONAL_MEDICARE_THRESHOLD)
    tax = tax.plus(additionalAmount.times(ADDITIONAL_MEDICARE_RATE).dividedBy(12))
  }

  return tax
}
