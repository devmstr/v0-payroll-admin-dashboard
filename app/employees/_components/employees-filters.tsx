'use client'

import { useCallback, useEffect, useMemo, useState } from 'react'
import {
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import { Search } from 'lucide-react'

const DEFAULT_OPTION = 'all'

export const UNASSIGNED_DEPARTMENT_VALUE = '__unassigned'

type Option = {
  value: string
  label: string
}

interface EmployeesFiltersProps {
  search: string
  department: string
  employmentType: string
  departments: Option[]
  employmentTypes: string[]
}

export function EmployeesFilters({
  search,
  department,
  employmentType,
  departments,
  employmentTypes
}: EmployeesFiltersProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [term, setTerm] = useState(search)

  useEffect(() => {
    setTerm(search)
  }, [search])

  const createQueryString = useCallback(
    (updates: Record<string, string | undefined>) => {
      const params = new URLSearchParams(searchParams.toString())

      Object.entries(updates).forEach(([key, value]) => {
        const shouldDelete =
          !value ||
          value === DEFAULT_OPTION ||
          (key === 'page' && value === '1')

        if (shouldDelete) {
          params.delete(key)
          return
        }

        params.set(key, value)
      })

      return params.toString()
    },
    [searchParams]
  )

  const pushUpdates = useCallback(
    (updates: Record<string, string | undefined>) => {
      const queryString = createQueryString({
        ...updates,
        page: updates.page ?? '1'
      })

      const url = queryString ? `${pathname}?${queryString}` : pathname

      router.replace(url)
    },
    [createQueryString, pathname, router]
  )

  const onSubmitSearch: React.FormEventHandler<HTMLFormElement> = (event) => {
    event.preventDefault()
    const trimmed = term.trim()

    pushUpdates({
      search: trimmed.length ? trimmed : undefined,
      page: '1'
    })
  }

  const departmentOptions = useMemo<Option[]>(
    () => [
      { value: DEFAULT_OPTION, label: 'All Departments' },
      ...departments
    ],
    [departments]
  )

  const employmentTypeOptions = useMemo<Option[]>(
    () => [
      { value: DEFAULT_OPTION, label: 'All Types' },
      ...employmentTypes.map((value) => ({
        value,
        label: value.replace('_', ' ')
      }))
    ],
    [employmentTypes]
  )

  return (
    <div className="flex items-center gap-4 flex-wrap md:flex-nowrap">
      <form
        onSubmit={onSubmitSearch}
        className="relative flex-1 min-w-[240px] md:max-w-md"
      >
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search by name, email, or employee number..."
          className="pl-9 bg-muted/50 border-border"
          value={term}
          onChange={(event) => setTerm(event.target.value)}
        />
      </form>

      <Select
        value={department}
        onValueChange={(value) =>
          pushUpdates({
            department: value === DEFAULT_OPTION ? undefined : value,
            page: '1'
          })
        }
      >
        <SelectTrigger className="w-full md:w-48 bg-muted/50 border-border">
          <SelectValue placeholder="Department" />
        </SelectTrigger>
        <SelectContent>
          {departmentOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={employmentType}
        onValueChange={(value) =>
          pushUpdates({
            employmentType: value === DEFAULT_OPTION ? undefined : value,
            page: '1'
          })
        }
      >
        <SelectTrigger className="w-full md:w-48 bg-muted/50 border-border">
          <SelectValue placeholder="Employment Type" />
        </SelectTrigger>
        <SelectContent>
          {employmentTypeOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}
