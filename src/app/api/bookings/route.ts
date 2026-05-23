import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { bookingLimiter } from "@/lib/rateLimit";
import { createNotification } from "@/lib/notifications";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get("type");
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const where: Record<string, unknown> = { active: true, date: { gte: new Date() } };
    if (type) where.type = type;
    if (from && to) {
      where.date = { gte: new Date(from), lte: new Date(to) };
    }

    const slots = await prisma.timeSlot.findMany({
      where,
      include: { bookings: { where: { status: { not: "cancelled" } }, select: { id: true } } },
      orderBy: { date: "asc" },
    });

    const available = slots
      .filter((s) => s.bookings.length < s.capacity)
      .map((s) => ({
        id: s.id,
        date: s.date,
        startTime: s.startTime,
        endTime: s.endTime,
        type: s.type,
        spotsLeft: s.capacity - s.bookings.length,
      }));

    return Response.json(available);
  } catch (error) {
    console.error("Available slots fetch error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const headersList = await headers();
    const ip = headersList.get("x-forwarded-for") || headersList.get("x-real-ip") || "unknown";
    const { success } = bookingLimiter.check(ip);

    if (!success) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429, headers: { "Retry-After": "900" } }
      );
    }

    const body = await request.json();
    const { timeSlotId, firstName, lastName, email, phone, type, message } = body;

    if (!timeSlotId || !firstName || !lastName || !email || !phone) {
      return Response.json({ error: "All required fields must be filled" }, { status: 400 });
    }

    const booking = await prisma.$transaction(async (tx) => {
      const slot = await tx.timeSlot.findUnique({
        where: { id: timeSlotId },
        include: { bookings: { where: { status: { not: "cancelled" } } } },
      });

      if (!slot || !slot.active) throw new Error("Slot not available");
      if (slot.bookings.length >= slot.capacity) throw new Error("Slot is full");

      return tx.booking.create({
        data: {
          timeSlotId,
          firstName,
          lastName,
          email,
          phone,
          type: type || slot.type,
          message: message || null,
        },
      });
    });

    await createNotification({
      type: "booking",
      title: "New Booking",
      message: `${firstName} ${lastName} booked a ${type || "placement test"}`,
      link: "/admin/bookings",
    });

    return Response.json(booking, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Internal server error";
    const status = message === "Slot is full" || message === "Slot not available" ? 409 : 500;
    if (status === 500) console.error("Booking create error:", error);
    return Response.json({ error: message }, { status });
  }
}
