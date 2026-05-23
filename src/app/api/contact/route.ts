import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { contactLimiter } from "@/lib/rateLimit";
import { createNotification } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const { success, remaining } = contactLimiter.check(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "600" } }
      );
    }

    const body = await request.json();
    const { firstName, lastName, email, phone, message } = body;

    if (!firstName || !lastName || !email || !message) {
      return Response.json(
        { error: "First name, last name, email, and message are required." },
        { status: 400 }
      );
    }

    const registration = await prisma.registration.create({
      data: {
        firstName,
        lastName,
        email,
        phone: phone || "",
        message,
        programInterest: "General Inquiry",
      },
    });

    await createNotification({
      type: "contact",
      title: "New Contact Message",
      message: `${firstName} ${lastName} sent a message`,
      link: "/admin/registrations",
    });

    return Response.json(registration, { status: 201 });
  } catch (error) {
    console.error("Contact submission error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
