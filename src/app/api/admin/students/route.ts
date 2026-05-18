import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

function generateStudentId(): string {
  const year = new Date().getFullYear().toString().slice(-2);
  const random = Math.floor(1000 + Math.random() * 9000).toString();
  return `TLC${year}${random}`;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return Response.json({ error: "Unauthorized" }, { status: 401 });
    }

    const students = await prisma.student.findMany({
      include: {
        program: true,
        group: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return Response.json(students);
  } catch (error) {
    console.error("Students fetch error:", error);
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
      studentId,
      firstName,
      lastName,
      dateOfBirth,
      phone,
      parentPhone,
      email,
      programId,
      level,
      groupId,
      status,
      notes,
    } = body;

    if (!firstName || !lastName || !dateOfBirth) {
      return Response.json(
        { error: "First name, last name, and date of birth are required" },
        { status: 400 }
      );
    }

    // Auto-generate studentId if not provided
    let finalStudentId = studentId;
    if (!finalStudentId) {
      // Keep generating until we find a unique one
      let isUnique = false;
      while (!isUnique) {
        finalStudentId = generateStudentId();
        const existing = await prisma.student.findUnique({
          where: { studentId: finalStudentId },
        });
        if (!existing) isUnique = true;
      }
    }

    const student = await prisma.student.create({
      data: {
        studentId: finalStudentId,
        firstName,
        lastName,
        dateOfBirth: new Date(dateOfBirth),
        phone: phone || null,
        parentPhone: parentPhone || null,
        email: email || null,
        programId: programId || null,
        level: level || null,
        groupId: groupId || null,
        status: status || "active",
        notes: notes || null,
      },
      include: {
        program: true,
        group: true,
      },
    });

    return Response.json(student, { status: 201 });
  } catch (error) {
    console.error("Student creation error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
