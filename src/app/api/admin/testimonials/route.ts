import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const testimonials = await prisma.testimonial.findMany({
      orderBy: { sortOrder: "asc" },
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

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { name, role, content, rating, image, active, sortOrder } = body;

    if (!name || !content) {
      return Response.json(
        { error: "Name and content are required" },
        { status: 400 }
      );
    }

    const testimonial = await prisma.testimonial.create({
      data: {
        name,
        role: role || null,
        content,
        rating: rating || 5,
        image: image || null,
        active: active !== undefined ? active : true,
        sortOrder: sortOrder || 0,
      },
    });

    return Response.json(testimonial, { status: 201 });
  } catch (error) {
    console.error("Testimonial creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
