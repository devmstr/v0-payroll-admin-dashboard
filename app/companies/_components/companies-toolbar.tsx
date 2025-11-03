'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function CompaniesToolbar({
  initialQuery = ''
}: {
  initialQuery?: string
}) {
  const router = useRouter()
  const sp = useSearchParams()
  const [q, setQ] = useState(initialQuery)
  const [isPending, startTransition] = useTransition()

  useEffect(() => setQ(initialQuery), [initialQuery])

  function onSearch(e: React.FormEvent) {
    e.preventDefault()
    const params = new URLSearchParams(sp.toString())
    if (q) params.set('q', q)
    else params.delete('q')
    params.delete('cursor') // reset pagination
    startTransition(() => router.push(`/companies?${params.toString()}`))
  }

  return (
    <form onSubmit={onSearch} className="flex gap-2">
      <Input
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="Search name, NIF, CNAS, email…"
        className="w-[260px]"
      />
      <Button type="submit" disabled={isPending}>
        {isPending ? 'Searching…' : 'Search'}
      </Button>
    </form>
  )
}
