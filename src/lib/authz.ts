import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

export type Role = "admin" | "teacher" | "receptionist";

export async function getSessionWithRole() {
  const session = await getServerSession(authOptions);
  const role = (session?.user as { role?: string })?.role as Role | undefined;
  return { session, role };
}

export function requireRole(session: unknown, ...roles: Role[]): Response | null {
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }
  const role = ((session as { user?: { role?: string } })?.user as { role?: string })?.role;
  if (!role || !roles.includes(role as Role)) {
    return Response.json({ error: "Forbidden" }, { status: 403 });
  }
  return null;
}

export function getUserRole(session: unknown): Role | null {
  const role = ((session as { user?: { role?: string } })?.user as { role?: string })?.role;
  return (role as Role) || null;
}

export function getUserId(session: unknown): string | null {
  const id = ((session as { user?: { id?: string } })?.user as { id?: string })?.id;
  return id || null;
}
