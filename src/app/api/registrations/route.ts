import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { firstName, lastName, phone, email, parentName, parentPhone, programInterest, message } = body;

    if (!firstName || !lastName || !phone) {
      return Response.json(
        { error: "First name, last name, and phone are required" },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.create({
      data: {
        firstName,
        lastName,
        phone,
        email: email || null,
        parentName: parentName || null,
        parentPhone: parentPhone || null,
        programInterest: programInterest || null,
        message: message || null,
      },
    });

    return Response.json(registration, { status: 201 });
  } catch (error) {
    console.error("Registration creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const registrations = await prisma.registration.findMany({
      orderBy: { createdAt: "desc" },
    });

    return Response.json(registrations);
  } catch (error) {
    console.error("Registrations fetch error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
