import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/db";
import { headers } from "next/headers";
import { jsPDF } from "jspdf";

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const certificate = await prisma.certificate.findUnique({
      where: { id: params.id },
      include: {
        user: true,
        course: true,
      },
    });

    if (!certificate) {
      return NextResponse.json({ error: "Certificate not found" }, { status: 404 });
    }

    if (certificate.userId !== session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    // Generate PDF
    const doc = new jsPDF({
      orientation: "landscape",
      unit: "mm",
      format: "a4",
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // Background
    doc.setFillColor(250, 250, 250);
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    // Border
    doc.setDrawColor(0, 0, 0);
    doc.setLineWidth(2);
    doc.rect(10, 10, pageWidth - 20, pageHeight - 20);

    doc.setLineWidth(0.5);
    doc.rect(15, 15, pageWidth - 30, pageHeight - 30);

    // Title
    doc.setFontSize(16);
    doc.setTextColor(100, 100, 100);
    doc.text("CERTIFICATE OF COMPLETION", pageWidth / 2, 35, { align: "center" });

    doc.setFontSize(28);
    doc.setTextColor(0, 0, 0);
    doc.text("TeachNLearn Academy", pageWidth / 2, 50, { align: "center" });

    // Content
    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("This is to certify that", pageWidth / 2, 75, { align: "center" });

    doc.setFontSize(24);
    doc.setTextColor(0, 0, 0);
    doc.text(certificate.user.name || certificate.user.email, pageWidth / 2, 90, { align: "center" });

    doc.setFontSize(14);
    doc.setTextColor(100, 100, 100);
    doc.text("has successfully completed", pageWidth / 2, 105, { align: "center" });

    doc.setFontSize(20);
    doc.setTextColor(0, 0, 0);
    doc.text(certificate.course.title, pageWidth / 2, 120, { align: "center" });

    // Date and Certificate Number
    const formattedDate = new Date(certificate.issuedAt).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text("Date of Completion", pageWidth / 2 - 40, 145, { align: "center" });
    doc.text("Certificate Number", pageWidth / 2 + 40, 145, { align: "center" });

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text(formattedDate, pageWidth / 2 - 40, 153, { align: "center" });
    doc.text(certificate.certificateNumber, pageWidth / 2 + 40, 153, { align: "center" });

    // Signature
    doc.setLineWidth(0.5);
    doc.line(pageWidth / 2 - 30, 175, pageWidth / 2 + 30, 175);

    doc.setFontSize(12);
    doc.setTextColor(0, 0, 0);
    doc.text("TeachNLearn Academy", pageWidth / 2, 182, { align: "center" });

    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text("Authorized Signature", pageWidth / 2, 188, { align: "center" });

    // Generate PDF buffer
    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="certificate-${certificate.certificateNumber}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Failed to generate certificate:", error);
    return NextResponse.json({ error: "Failed to generate certificate" }, { status: 500 });
  }
}
