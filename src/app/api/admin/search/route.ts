import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    const { searchParams } = new URL(request.url);
    const q = searchParams.get("q")?.trim();

    if (!q || q.length < 2) {
      return Response.json([]);
    }

    const [students, registrations, programs, groups, events, invoices] = await Promise.all([
      prisma.student.findMany({
        where: {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { studentId: { contains: q } },
            { email: { contains: q } },
          ],
        },
        take: 5,
        select: { id: true, firstName: true, lastName: true, studentId: true },
      }),
      prisma.registration.findMany({
        where: {
          OR: [
            { firstName: { contains: q } },
            { lastName: { contains: q } },
            { email: { contains: q } },
            { phone: { contains: q } },
          ],
        },
        take: 5,
        select: { id: true, firstName: true, lastName: true, status: true },
      }),
      prisma.program.findMany({
        where: { title: { contains: q } },
        take: 5,
        select: { id: true, title: true },
      }),
      prisma.group.findMany({
        where: { name: { contains: q } },
        take: 5,
        select: { id: true, name: true },
      }),
      prisma.event.findMany({
        where: { title: { contains: q } },
        take: 5,
        select: { id: true, title: true, date: true },
      }),
      prisma.invoice.findMany({
        where: {
          OR: [
            { description: { contains: q } },
            { student: { firstName: { contains: q } } },
            { student: { lastName: { contains: q } } },
          ],
        },
        take: 5,
        select: { id: true, description: true, amount: true, status: true },
      }),
    ]);

    const results = [
      ...students.map((s) => ({
        type: "student",
        id: s.id,
        title: `${s.firstName} ${s.lastName}`,
        subtitle: s.studentId,
        href: `/admin/students`,
      })),
      ...registrations.map((r) => ({
        type: "registration",
        id: r.id,
        title: `${r.firstName} ${r.lastName}`,
        subtitle: r.status,
        href: `/admin/registrations`,
      })),
      ...programs.map((p) => ({
        type: "program",
        id: p.id,
        title: p.title,
        subtitle: "Program",
        href: `/admin/programs`,
      })),
      ...groups.map((g) => ({
        type: "group",
        id: g.id,
        title: g.name,
        subtitle: "Group",
        href: `/admin/groups`,
      })),
      ...events.map((e) => ({
        type: "event",
        id: e.id,
        title: e.title,
        subtitle: new Date(e.date).toLocaleDateString(),
        href: `/admin/events`,
      })),
      ...invoices.map((i) => ({
        type: "invoice",
        id: i.id,
        title: i.description,
        subtitle: `${i.amount} MAD - ${i.status}`,
        href: `/admin/finance`,
      })),
    ];

    return Response.json(results);
  } catch (error) {
    console.error("Search error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
