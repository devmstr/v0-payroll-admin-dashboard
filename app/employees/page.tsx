import { EmploymentType, Prisma } from '@prisma/client'
import { Upload, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  EmployeeTable,
  type EmployeeListItem
} from '@/components/employee-table'
import { InviteUserDialog } from '@/components/invite-user-dialog'
import { prisma } from '@/lib/prisma'
import { EmployeesFilters, UNASSIGNED_DEPARTMENT_VALUE } from './_components/employees-filters'
import { EmployeesPagination } from './_components/employees-pagination'
import { CreateEmployeeDialog } from './create-employee-dialog'

const DEFAULT_FILTER = 'all'
const PAGE_SIZE = 10

type SearchParamRecord = Record<string, string | string[] | undefined>

type EmployeesPageProps = {
  searchParams?: Promise<SearchParamRecord>
}

const employmentTypeValues = Object.values(EmploymentType)

const getStringParam = (searchParams: SearchParamRecord, key: string): string => {
  const value = searchParams[key]

  if (Array.isArray(value)) {
    return value[0] ?? ''
  }

  return value ?? ''
}

export default async function EmployeesPage({
  searchParams
}: EmployeesPageProps) {
  const resolvedSearchParams = (await searchParams) ?? {}

  const rawSearch = getStringParam(resolvedSearchParams, 'search')
  const rawDepartment = getStringParam(resolvedSearchParams, 'department')
  const rawEmploymentType = getStringParam(resolvedSearchParams, 'employmentType')
  const rawPage = Number.parseInt(getStringParam(resolvedSearchParams, 'page'), 10)

  const search = rawSearch.trim()
  const departmentParam = rawDepartment || DEFAULT_FILTER
  const employmentTypeParam = rawEmploymentType || DEFAULT_FILTER
  const page = Number.isFinite(rawPage) && rawPage > 0 ? rawPage : 1
  const take = PAGE_SIZE
  const skip = (page - 1) * take

  const filters: Prisma.EmployeeWhereInput[] = []

  if (search.length > 0) {
    filters.push({
      OR: [
        { firstName: { contains: search, mode: 'insensitive' } },
        { lastName: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { employeeNumber: { contains: search, mode: 'insensitive' } }
      ]
    })
  }

  if (departmentParam !== DEFAULT_FILTER) {
    if (departmentParam === UNASSIGNED_DEPARTMENT_VALUE) {
      filters.push({
        OR: [{ department: null }, { department: '' }]
      })
    } else {
      filters.push({
        department: {
          equals: departmentParam
        }
      })
    }
  }

  if (
    employmentTypeParam !== DEFAULT_FILTER &&
    employmentTypeValues.includes(employmentTypeParam as EmploymentType)
  ) {
    filters.push({
      employmentType: employmentTypeParam as EmploymentType
    })
  }

  const where: Prisma.EmployeeWhereInput =
    filters.length > 0 ? { AND: filters } : {}

  const [initialEmployees, totalEmployees, departmentRecords, companies] =
    await Promise.all([
      prisma.employee.findMany({
        where,
        include: {
          company: { select: { name: true } },
          contracts: {
            orderBy: { startDate: 'desc' },
            take: 1
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take
      }),
      prisma.employee.count({ where }),
      prisma.employee.findMany({
        select: { department: true },
        distinct: ['department']
      }),
      prisma.company.findMany({
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      })
    ])

  const totalPages = Math.max(1, Math.ceil(totalEmployees / take))

  let employees = initialEmployees
  let currentPage = page
  let currentSkip = skip

  if (
    employees.length === 0 &&
    totalEmployees > 0 &&
    page > totalPages
  ) {
    currentPage = totalPages
    currentSkip = (currentPage - 1) * take
    employees = await prisma.employee.findMany({
      where,
      include: {
        company: { select: { name: true } },
        contracts: {
          orderBy: { startDate: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' },
      skip: currentSkip,
      take
    })
  }

  const hasUnassignedDepartment = departmentRecords.some(
    ({ department }) => !department || department.trim().length === 0
  )

  const departmentOptions = (() => {
    const namedDepartments = departmentRecords
      .map(({ department }) => department?.trim())
      .filter(
        (value): value is string => Boolean(value && value.length > 0)
      )
      .sort((a, b) => a.localeCompare(b))
      .map((value) => ({
        value,
        label: value
      }))

    return hasUnassignedDepartment
      ? [
          { value: UNASSIGNED_DEPARTMENT_VALUE, label: 'Unassigned' },
          ...namedDepartments
        ]
      : namedDepartments
  })()

  const normalisedDepartmentParam =
    departmentParam !== DEFAULT_FILTER &&
    !departmentOptions.some((option) => option.value === departmentParam)
      ? DEFAULT_FILTER
      : departmentParam

  const normalisedEmploymentTypeParam =
    employmentTypeParam !== DEFAULT_FILTER &&
    !employmentTypeValues.includes(employmentTypeParam as EmploymentType)
      ? DEFAULT_FILTER
      : employmentTypeParam

  const employeeRows: EmployeeListItem[] = employees.map((employee) => {
    const latestContract = employee.contracts[0]
    const baseSalary = latestContract?.baseSalary ?? employee.baseSalary ?? 0
    const currency = employee.currency || 'DZD'

    return {
      id: employee.id,
      firstName: employee.firstName,
      lastName: employee.lastName,
      email:
        employee.email ??
        `${employee.firstName}.${employee.lastName}@${employee.companyId.slice(
          0,
          6
        )}.example`.toLowerCase(),
      employeeNumber:
        employee.employeeNumber ??
        `EMP-${employee.id.slice(-6).toUpperCase()}`,
      department: employee.department ?? 'Unassigned',
      position: employee.position ?? 'Pending Assignment',
      employmentType: employee.employmentType ?? EmploymentType.FULL_TIME,
      baseSalary,
      currency,
      paymentFrequency: employee.paymentFrequency ?? 'MONTHLY',
      isActive: employee.isActive
    }
  })

  const hasResults = totalEmployees > 0 && employees.length > 0
  const rangeStart = hasResults ? currentSkip + 1 : 0
  const rangeEnd = hasResults ? currentSkip + employees.length : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold tracking-tight text-foreground">
            Employees
          </h1>
          <p className="text-muted-foreground mt-1">
            Manage your workforce and employee information
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline">
            <Upload className="w-4 h-4 mr-2" />
            Import CSV
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <CreateEmployeeDialog companies={companies} />
          <InviteUserDialog />
        </div>
      </div>

      <EmployeesFilters
        search={search}
        department={normalisedDepartmentParam}
        employmentType={normalisedEmploymentTypeParam}
        departments={departmentOptions}
        employmentTypes={employmentTypeValues}
      />

      <div className="flex items-center justify-between text-sm">
        <p className="text-muted-foreground">
          {hasResults ? (
            <>
              Showing{' '}
              <span className="font-medium text-foreground">{rangeStart}</span>{' '}
              –{' '}
              <span className="font-medium text-foreground">{rangeEnd}</span> of{' '}
              <span className="font-medium text-foreground">
                {totalEmployees}
              </span>{' '}
              employees
            </>
          ) : (
            'Showing 0 employees'
          )}
        </p>
        <p className="text-muted-foreground hidden sm:block">
          Page{' '}
          <span className="font-medium text-foreground">
            {Math.min(currentPage, totalPages)}
          </span>{' '}
          of{' '}
          <span className="font-medium text-foreground">{totalPages}</span>
        </p>
      </div>

      <EmployeeTable employees={employeeRows} />

      <EmployeesPagination
        page={Math.min(currentPage, totalPages)}
        pageSize={take}
        total={totalEmployees}
      />
    </div>
  )
}
