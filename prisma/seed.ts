// prisma/seed.ts
import { PrismaClient, UserRole } from '@prisma/client'
import { faker } from '@faker-js/faker'
import { hashSync } from 'bcryptjs'

const prisma = new PrismaClient()

// Algerian-specific data generators
const algerianFirstNames = [
  'Mohamed',
  'Ahmed',
  'Youssef',
  'Khaled',
  'Ali',
  'Omar',
  'Hakim',
  'Rachid',
  'Fatima',
  'Amina',
  'Zahra',
  'Nour',
  'Samira',
  'Leila',
  'Yasmina',
  'Soraya'
]

const algerianLastNames = [
  'Benzema',
  'Mansouri',
  'Bouchene',
  'Taleb',
  'Saadi',
  'Khaldi',
  'Guetta',
  'Meziane',
  'Bouchemlal',
  'Derradji',
  'Hamrouni',
  'Bouguerra',
  'Chaoui'
]

const algerianCities = [
  'Alger',
  'Oran',
  'Constantine',
  'Annaba',
  'Batna',
  'Blida',
  'Sétif',
  'Djelfa',
  'Sidi Bel Abbès',
  'Biskra',
  'Tébessa',
  'Tiaret'
]

const jobTitles = [
  'Software Engineer',
  'Accountant',
  'HR Manager',
  'Sales Executive',
  'Project Manager',
  'Administrative Assistant',
  'IT Specialist',
  'Finance Controller',
  'Marketing Manager',
  'Operations Director'
]

const sections = ['IT', 'Finance', 'HR', 'Sales', 'Operations', 'Marketing']

async function main() {
  console.log('🌱 Starting database seeding...')

  // Clean existing data (optional - be careful in production)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Cleaning existing data...')
    await prisma.auditLog.deleteMany()
    await prisma.integration.deleteMany()
    await prisma.employeeLoan.deleteMany()
    await prisma.employeeBenefit.deleteMany()
    await prisma.taxFiling.deleteMany()
    await prisma.approval.deleteMany()
    await prisma.bankTransfer.deleteMany()
    await prisma.payrollItem.deleteMany()
    await prisma.payslip.deleteMany()
    await prisma.contract.deleteMany()
    await prisma.employee.deleteMany()
    await prisma.payrollRun.deleteMany()
    await prisma.rulesConfig.deleteMany()
    await prisma.session.deleteMany()
    await prisma.user.deleteMany()
    await prisma.company.deleteMany()
  }

  // Create companies
  const companies = await Promise.all([
    prisma.company.create({
      data: {
        name: 'SONERAS',
        nif: '40030080070',
        cnasNumber: '1234567',
        phone: '+213 21 00 00 00',
        address: 'Ghardaia, Algeria'
      }
    }),
    prisma.company.create({
      data: {
        name: 'OKI',
        nif: '10020030040',
        cnasNumber: '7654321',
        phone: '+213 23 10 20 30',
        address: 'Ghardaia, Algeria'
      }
    }),
    prisma.company.create({
      data: {
        name: 'OKlit',
        nif: '90080060040',
        cnasNumber: '5566778',
        phone: '+213 29 44 55 66',
        address: 'Ghardaia, Algeria'
      }
    })
  ])

  console.log(`🏢 Created ${companies.length} companies`)

  // Create admin users for each company
  for (const company of companies) {
    const adminUser = await prisma.user.create({
      data: {
        email: `admin@${company.name.toLowerCase().replace(/\s+/g, '')}.dz`,
        name: `Admin ${company.name}`,
        passwordHash: hashSync('admin123', 12),
        role: UserRole.COMPANY_ADMIN,
        companyId: company.id,
        isActive: true
      }
    })

    // Create payroll manager
    await prisma.user.create({
      data: {
        email: `payroll@${company.name.toLowerCase().replace(/\s+/g, '')}.dz`,
        name: `Payroll Manager ${company.name}`,
        passwordHash: hashSync('payroll123', 12),
        role: UserRole.PAYROLL_MANAGER,
        companyId: company.id,
        isActive: true
      }
    })

    console.log(`👤 Created admin users for ${company.name}`)
  }

  // Create global rules configuration for Algerian payroll
  await prisma.rulesConfig.createMany({
    data: [
      {
        companyId: null,
        key: 'CNAS_EMPLOYEE_RATE',
        value: {
          rate: 0.09,
          description: 'Employee social security contribution rate'
        }
      },
      {
        companyId: null,
        key: 'CNAS_EMPLOYER_RATE',
        value: {
          rate: 0.25,
          description: 'Employer social security contribution rate'
        }
      },
      {
        companyId: null,
        key: 'CNAS_CEILING',
        value: { amount: 80000, description: 'Monthly contribution ceiling' }
      },
      {
        companyId: null,
        key: 'IRG_BRACKETS',
        value: {
          brackets: [
            { min: 0, max: 10000, rate: 0.0, fixed: 0 },
            { min: 10001, max: 30000, rate: 0.07, fixed: 0 },
            { min: 30001, max: 60000, rate: 0.17, fixed: 1400 },
            { min: 60001, max: 120000, rate: 0.27, fixed: 6500 },
            { min: 120001, max: 240000, rate: 0.31, fixed: 17900 },
            { min: 240001, max: 480000, rate: 0.35, fixed: 43100 },
            { min: 480001, max: null, rate: 0.37, fixed: 82700 }
          ],
          exemptAmount: 30000,
          dependentDeduction: 1500
        }
      },
      {
        companyId: null,
        key: 'SNMG',
        value: {
          monthly: 20000,
          description: 'National minimum guaranteed salary'
        }
      },
      {
        companyId: null,
        key: 'WORKING_DAYS_PER_MONTH',
        value: { days: 26, description: 'Standard working days per month' }
      },
      {
        companyId: null,
        key: 'TRANSPORT_ALLOWANCE',
        value: { amount: 3000, description: 'Standard transport allowance' }
      },
      {
        companyId: null,
        key: 'PANIER_ALLOWANCE',
        value: { amount: 2000, description: 'Standard meal allowance per day' }
      }
    ]
  })

  console.log('📊 Created global Algerian payroll rules configuration')

  // Create employees for each company
  for (const company of companies) {
    const employees = []
    const employeesPerCompany = 12

    for (let i = 0; i < employeesPerCompany; i++) {
      const firstName = faker.helpers.arrayElement(algerianFirstNames)
      const lastName = faker.helpers.arrayElement(algerianLastNames)
      const hireDate = faker.date.between({
        from: '2020-01-01',
        to: '2024-06-01'
      })
      const birthDate = faker.date.between({
        from: '1970-01-01',
        to: '1995-12-31'
      })

      // Algerian-specific data
      const nss = `NSS${faker.string.numeric(8)}`
      const nif = `NIF${faker.string.numeric(10)}`
      const baseSalary = faker.number.float({
        min: 30000,
        max: 120000,
        fractionDigits: 2
      })

      const employee = await prisma.employee.create({
        data: {
          companyId: company.id,
          firstName,
          lastName,
          nss,
          nif,
          hireDate,
          contracts: {
            create: {
              startDate: hireDate,
              endDate: faker.helpers.maybe(
                () => faker.date.between({ from: hireDate, to: '2026-12-31' }),
                { probability: 0.2 }
              ),
              baseSalary,
              grade: faker.helpers.arrayElement([
                'A1',
                'A2',
                'B1',
                'B2',
                'C1',
                'C2'
              ]),
              workingTimeRate: faker.helpers.arrayElement([100, 80, 50]),
              cnasEligible: faker.datatype.boolean({ probability: 0.9 })
            }
          }
        },
        include: {
          contracts: true
        }
      })

      employees.push(employee)

      // Create employee benefits for some employees
      if (i < 8) {
        await prisma.employeeBenefit.create({
          data: {
            employeeId: employee.id,
            benefitType: faker.helpers.arrayElement([
              'Health Insurance',
              'Retirement',
              'Life Insurance'
            ]),
            provider: faker.helpers.arrayElement([
              'CNAS',
              'CASNOS',
              'Private Insurance'
            ]),
            planName: faker.helpers.arrayElement([
              'Basic Plan',
              'Premium Plan',
              'Family Plan'
            ]),
            employeeContribution: baseSalary * 0.02,
            employerContribution: baseSalary * 0.05,
            startDate: hireDate,
            isActive: true
          }
        })
      }

      // Create loans for some employees
      if (i < 4) {
        await prisma.employeeLoan.create({
          data: {
            employeeId: employee.id,
            loanType: faker.helpers.arrayElement([
              'Salary Advance',
              'Emergency Loan',
              'Housing Loan'
            ]),
            principalAmount:
              baseSalary * faker.number.float({ min: 0.5, max: 3 }),
            remainingAmount:
              baseSalary * faker.number.float({ min: 0.1, max: 2.5 }),
            installmentAmount: baseSalary * 0.2,
            installmentCount: faker.number.int({ min: 3, max: 12 }),
            paidInstallments: faker.number.int({ min: 0, max: 6 }),
            startDate: faker.date.between({ from: hireDate, to: new Date() }),
            isActive: true
          }
        })
      }
    }

    console.log(`👥 Created ${employees.length} employees for ${company.name}`)

    // Create sample payroll runs for the current year
    const currentYear = new Date().getFullYear()

    for (let month = 1; month <= 3; month++) {
      const payrollRun = await prisma.payrollRun.create({
        data: {
          companyId: company.id,
          month,
          year: currentYear,
          status: month === 3 ? 'draft' : 'approved',
          payslips: {
            create: employees.map((employee) => {
              const baseSalary = employee.contracts[0]?.baseSalary || 40000
              const transportAllowance = 3000
              const panierAllowance = 2000 * 26 // Daily allowance * working days
              const gross = baseSalary + transportAllowance + panierAllowance
              const cnasEmployee = gross * 0.09
              const irg = calculateIRG(gross, 0) // 0 dependents for simplicity
              const net = gross - cnasEmployee - irg

              return {
                employeeId: employee.id,
                gross,
                net,
                totalAllow: transportAllowance + panierAllowance,
                totalDeduct: cnasEmployee + irg,
                details: {
                  earnings: [
                    {
                      code: 'BASE',
                      label: 'Salaire de Base',
                      amount: baseSalary
                    },
                    {
                      code: 'TRANS',
                      label: 'Indemnité de Transport',
                      amount: transportAllowance
                    },
                    {
                      code: 'PANIER',
                      label: 'Indemnité de Panier',
                      amount: panierAllowance
                    }
                  ],
                  deductions: [
                    {
                      code: 'CNAS',
                      label: 'Cotisation CNAS',
                      amount: cnasEmployee
                    },
                    {
                      code: 'IRG',
                      label: 'Impôt sur le Revenu Global',
                      amount: irg
                    }
                  ]
                }
              }
            })
          },
          PayrollItem: {
            create: employees.map((employee) => {
              const baseSalary = employee.contracts[0]?.baseSalary || 40000
              const transportAllowance = 3000
              const panierAllowance = 2000 * 26
              const gross = baseSalary + transportAllowance + panierAllowance
              const cnasEmployee = gross * 0.09
              const irg = calculateIRG(gross, 0)
              const net = gross - cnasEmployee - irg

              return {
                employeeId: employee.id,
                basePay: baseSalary,
                allowances: transportAllowance + panierAllowance,
                federalTax: irg,
                socialSecurity: cnasEmployee,
                grossPay: gross,
                totalDeductions: cnasEmployee + irg,
                netPay: net,
                regularHours: 173.33 // Standard monthly hours
              }
            })
          }
        },
        include: {
          payslips: true,
          PayrollItem: true
        }
      })

      console.log(
        `💰 Created payroll run for ${company.name} - ${month}/${currentYear} with ${payrollRun.payslips.length} payslips`
      )
    }

    // Create sample bank transfers for the latest payroll run
    const latestPayrollRun = await prisma.payrollRun.findFirst({
      where: { companyId: company.id },
      orderBy: { createdAt: 'desc' },
      include: { payslips: true }
    })

    if (latestPayrollRun) {
      for (const payslip of latestPayrollRun.payslips.slice(0, 5)) {
        await prisma.bankTransfer.create({
          data: {
            companyId: company.id,
            payrollRunId: latestPayrollRun.id,
            employeeId: payslip.employeeId,
            amount: payslip.net,
            bankName: faker.helpers.arrayElement([
              'BADR',
              'CPA',
              'BNA',
              'BC',
              'BEA'
            ]),
            accountNumber: faker.finance.accountNumber(),
            routingNumber: faker.finance.routingNumber(),
            scheduledAt: new Date(),
            status: 'PENDING'
          }
        })
      }
      console.log(`🏦 Created bank transfers for ${company.name}`)
    }
  }

  // Create super admin user (no company association)
  await prisma.user.create({
    data: {
      email: 'superadmin@payroll.dz',
      name: 'Super Administrator',
      passwordHash: hashSync('superadmin123', 12),
      role: UserRole.SUPER_ADMIN,
      isActive: true
    }
  })

  console.log('👑 Created super admin user')

  // Summary
  const totalEmployees = await prisma.employee.count()
  const totalCompanies = await prisma.company.count()
  const totalUsers = await prisma.user.count()
  const totalPayrollRuns = await prisma.payrollRun.count()

  console.log(`
🎉 Seeding completed!
=====================
Companies: ${totalCompanies}
Users: ${totalUsers}
Employees: ${totalEmployees}
Payroll Runs: ${totalPayrollRuns}
Rules Config: 8 global rules
  `)
}

// Algerian IRG calculation function
function calculateIRG(grossSalary: number, dependents: number = 0): number {
  const exemptAmount = 30000 + dependents * 1500
  const taxable = Math.max(0, grossSalary - exemptAmount)

  if (taxable <= 0) return 0

  const brackets = [
    { min: 0, max: 10000, rate: 0.0, fixed: 0 },
    { min: 10001, max: 30000, rate: 0.07, fixed: 0 },
    { min: 30001, max: 60000, rate: 0.17, fixed: 1400 },
    { min: 60001, max: 120000, rate: 0.27, fixed: 6500 },
    { min: 120001, max: 240000, rate: 0.31, fixed: 17900 },
    { min: 240001, max: 480000, rate: 0.35, fixed: 43100 },
    { min: 480001, max: Infinity, rate: 0.37, fixed: 82700 }
  ]

  let tax = 0
  let remaining = taxable

  for (const bracket of brackets) {
    if (remaining <= 0) break

    const bracketRange =
      bracket.max === Infinity ? remaining : bracket.max - bracket.min + 1
    const amountInBracket = Math.min(remaining, bracketRange)

    tax += amountInBracket * bracket.rate + bracket.fixed
    remaining -= amountInBracket
  }

  return Math.round(tax)
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
