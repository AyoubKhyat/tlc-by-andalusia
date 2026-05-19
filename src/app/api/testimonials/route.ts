import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      select: {
        id: true,
        name: true,
        role: true,
        content: true,
        rating: true,
        image: true,
      },
    });

    return Response.json(testimonials);
  } catch (error) {
    console.error("Testimonials fetch error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
