// In production, this would use the real @prisma/client

// Mock Prisma client that returns empty results
// This allows the code to run in the browser without a real database
export const prisma = {
  user: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
  },
  company: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
  },
  employee: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
  },
  payrollRun: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
  },
  payrollItem: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
  },
  bankTransfer: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
  },
  approval: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
  },
  auditLog: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
  },
  session: {
    findUnique: async () => null,
    findMany: async () => [],
    create: async (data: any) => data.data,
    update: async (data: any) => data.data,
    delete: async () => ({}),
  },
  $transaction: async (callback: any) => {
    // Mock transaction - just execute the callback
    return callback(prisma)
  },
} as any
