import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { requireRole } from "@/lib/authz";
import { generateCertificatePDF } from "@/lib/certificate";
import { formatDate } from "@/lib/utils";

export async function GET(request: Request, { params }: { params: Promise<{ resultId: string }> }) {
  try {
    const { resultId } = await params;
    const session = await getServerSession(authOptions);
    const denied = requireRole(session, "admin", "teacher");
    if (denied) return denied;

    const result = await prisma.examResult.findUnique({
      where: { id: resultId },
      include: {
        student: { select: { firstName: true, lastName: true } },
        examSession: {
          select: { title: true, program: { select: { title: true } } },
        },
      },
    });

    if (!result) {
      return Response.json({ error: "Result not found" }, { status: 404 });
    }

    if (!result.certificateAvailable || result.status !== "passed") {
      return Response.json({ error: "Certificate not available for this result" }, { status: 400 });
    }

    const pdfBytes = generateCertificatePDF({
      studentName: `${result.student.firstName} ${result.student.lastName}`,
      programTitle: result.examSession.program.title,
      examTitle: result.examSession.title,
      score: result.score,
      maxScore: result.maxScore,
      percentage: result.percentage,
      examDate: formatDate(result.createdAt),
    });

    await prisma.examResult.update({
      where: { id: resultId },
      data: { certificateGeneratedAt: new Date() },
    });

    return new Response(Buffer.from(pdfBytes), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${result.student.firstName}-${result.student.lastName}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Certificate generation error:", error);
    return Response.json({ error: "Internal server error" }, { status: 500 });
  }
}
