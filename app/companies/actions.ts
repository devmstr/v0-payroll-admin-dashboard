'use server'

import { prisma } from '@/lib/prisma'
import { CompanyInput, CompanySchema } from '@/lib/validations/company'
import { revalidatePath } from 'next/cache'

const PAGE_SIZE_DEFAULT = 10

export async function listCompanies(opts?: {
  q?: string
  cursor?: string | null
  take?: number
}) {
  const take = Math.min(Math.max(opts?.take ?? PAGE_SIZE_DEFAULT, 1), 50)
  const where =
    opts?.q && opts.q.trim().length
      ? {
          OR: [
            { name: { contains: opts.q } },
            { nif: { contains: opts.q } },
            { cnasNumber: { contains: opts.q } }
          ]
        }
      : {}

  const rows = await prisma.company.findMany({
    where,
    take: take + 1, // fetch one extra to know if next page exists
    ...(opts?.cursor ? { skip: 1, cursor: { id: opts.cursor } } : {}),
    orderBy: [{ createdAt: 'desc' }, { id: 'desc' }]
  })

  const hasNext = rows.length > take
  const items = hasNext ? rows.slice(0, -1) : rows
  const nextCursor = hasNext ? items[items.length - 1]?.id ?? null : null
  return { items, nextCursor, hasNext, pageSize: take }
}

export async function getCompany(id: string) {
  return prisma.company.findUnique({ where: { id } })
}

export async function createCompany(raw: CompanyInput) {
  const parsed = CompanySchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, issues: parsed.error.flatten().fieldErrors }
  }
  const { name, nif, cnasNumber, email, phone, address } = parsed.data

  try {
    await prisma.company.create({
      data: {
        name,
        nif: nif || null,
        cnasNumber: cnasNumber || null,
        phone: phone || null,
        address: address || null
      }
    })
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return {
        ok: false,
        issues: { name: ['A company with this name already exists'] }
      }
    }
    throw e
  }
  revalidatePath('/companies')
  return { ok: true }
}

export async function updateCompany(id: string, raw: CompanyInput) {
  const parsed = CompanySchema.safeParse(raw)
  if (!parsed.success) {
    return { ok: false, issues: parsed.error.flatten().fieldErrors }
  }
  try {
    await prisma.company.update({
      where: { id },
      data: {
        ...parsed.data,
        // convert empty strings to nulls for optional fields
        nif: parsed.data.nif || null,
        cnasNumber: parsed.data.cnasNumber || null,
        phone: parsed.data.phone || null,
        address: parsed.data.address || null
      }
    })
  } catch (e: any) {
    if (e?.code === 'P2002') {
      return {
        ok: false,
        issues: { name: ['A company with this name already exists'] }
      }
    }
    throw e
  }
  revalidatePath('/companies')
  revalidatePath(`/companies/${id}`)
  return { ok: true }
}

export async function deleteCompany(id: string) {
  await prisma.company.delete({ where: { id } })
  revalidatePath('/companies')
  return { ok: true }
}
