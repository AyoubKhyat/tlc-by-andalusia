import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { validate, registrationSchema } from "@/lib/validation";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { registrationLimiter } from "@/lib/rateLimit";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const { success, remaining } = registrationLimiter.check(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const body = await request.json();
    const { firstName, lastName, phone, email, parentName, parentPhone, programInterest, message } = body;

    const errors = validate(
      { firstName, lastName, phone, email, programInterest },
      registrationSchema
    );
    if (Object.keys(errors).length > 0) {
      return Response.json({ error: "Validation failed", errors }, { status: 400 });
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
