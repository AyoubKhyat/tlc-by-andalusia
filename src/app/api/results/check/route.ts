import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { studentId, dateOfBirth } = body;

    if (!studentId || !dateOfBirth) {
      return Response.json(
        { error: "Student ID and date of birth are required" },
        { status: 400 }
      );
    }

    const student = await prisma.student.findUnique({
      where: { studentId },
      include: {
        program: { select: { title: true } },
        examResults: {
          include: {
            examSession: {
              select: {
                title: true,
                examDate: true,
                level: true,
              },
            },
          },
        },
      },
    });

    if (!student) {
      return Response.json(
        { error: "No student found with this ID" },
        { status: 404 }
      );
    }

    // Compare date parts only (ignore time)
    const inputDate = new Date(dateOfBirth);
    const storedDate = new Date(student.dateOfBirth);

    const inputDateStr = `${inputDate.getFullYear()}-${String(inputDate.getMonth() + 1).padStart(2, "0")}-${String(inputDate.getDate()).padStart(2, "0")}`;
    const storedDateStr = `${storedDate.getFullYear()}-${String(storedDate.getMonth() + 1).padStart(2, "0")}-${String(storedDate.getDate()).padStart(2, "0")}`;

    if (inputDateStr !== storedDateStr) {
      return Response.json(
        { error: "Date of birth does not match our records" },
        { status: 404 }
      );
    }

    return Response.json({
      student: {
        firstName: student.firstName,
        lastName: student.lastName,
        level: student.level,
        program: student.program ? student.program.title : null,
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      results: student.examResults.map((result: any) => ({
        examSession: {
          title: result.examSession.title,
          examDate: result.examSession.examDate,
          level: result.examSession.level,
        },
        score: result.score,
        maxScore: result.maxScore,
        percentage: result.percentage,
        status: result.status,
        teacherComment: result.teacherComment,
        certificateAvailable: result.certificateAvailable,
      })),
    });
  } catch (error) {
    console.error("Results check error:", error);
    return Response.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
