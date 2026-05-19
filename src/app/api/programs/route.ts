import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        ageGroup: true,
        duration: true,
        levels: true,
        objectives: true,
        icon: true,
        image: true,
      },
    });

    return Response.json(programs);
  } catch (error) {
    console.error("Programs fetch error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
