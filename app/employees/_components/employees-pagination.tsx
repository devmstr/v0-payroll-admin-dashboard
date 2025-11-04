'use client'

import { useCallback } from 'react'
import {
  usePathname,
  useRouter,
  useSearchParams
} from 'next/navigation'
import { Button } from '@/components/ui/button'

interface EmployeesPaginationProps {
  page: number
  pageSize: number
  total: number
}

export function EmployeesPagination({
  page,
  pageSize,
  total
}: EmployeesPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(total / pageSize))

  if (totalPages <= 1) {
    return null
  }

  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const createQueryString = useCallback(
    (nextPage: number) => {
      const params = new URLSearchParams(searchParams.toString())

      if (nextPage <= 1) {
        params.delete('page')
      } else {
        params.set('page', String(nextPage))
      }

      return params.toString()
    },
    [searchParams]
  )

  const goToPage = (nextPage: number) => {
    const queryString = createQueryString(nextPage)
    const url = queryString ? `${pathname}?${queryString}` : pathname

    router.replace(url)
  }

  return (
    <div className="flex items-center justify-between border border-border rounded-lg px-4 py-3 bg-card">
      <p className="text-sm text-muted-foreground">
        Page <span className="font-medium text-foreground">{page}</span> of{' '}
        <span className="font-medium text-foreground">{totalPages}</span>
      </p>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page - 1)}
          disabled={page <= 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => goToPage(page + 1)}
          disabled={page >= totalPages}
        >
          Next
        </Button>
      </div>
    </div>
  )
}
