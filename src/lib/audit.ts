import { prisma } from "./prisma";

interface AuditOptions {
  action: "create" | "update" | "delete";
  entity: string;
  entityId?: string;
  userId?: string;
  userName?: string;
  before?: unknown;
  after?: unknown;
  request?: Request;
}

export async function logAction(opts: AuditOptions) {
  try {
    await prisma.auditLog.create({
      data: {
        action: opts.action,
        entity: opts.entity,
        entityId: opts.entityId || null,
        userId: opts.userId || null,
        userName: opts.userName || null,
        before: opts.before ? JSON.stringify(opts.before) : null,
        after: opts.after ? JSON.stringify(opts.after) : null,
        ipAddress: opts.request?.headers.get("x-forwarded-for") || null,
      },
    });
  } catch {
    // Audit logging should never break the main operation
  }
}
