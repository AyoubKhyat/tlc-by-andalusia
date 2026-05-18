import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const programs = await prisma.program.findMany({
      orderBy: { sortOrder: "asc" },
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      title,
      slug,
      description,
      ageGroup,
      duration,
      levels,
      objectives,
      icon,
      image,
      active,
      sortOrder,
    } = body;

    if (!title || !slug || !description || !ageGroup || !duration || !levels || !objectives) {
      return Response.json(
        { error: "Title, slug, description, age group, duration, levels, and objectives are required" },
        { status: 400 }
      );
    }

    const program = await prisma.program.create({
      data: {
        title,
        slug,
        description,
        ageGroup,
        duration,
        levels,
        objectives,
        icon: icon || null,
        image: image || null,
        active: active !== undefined ? active : true,
        sortOrder: sortOrder || 0,
      },
    });

    return Response.json(program, { status: 201 });
  } catch (error) {
    console.error("Program creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
