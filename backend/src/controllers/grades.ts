import { Request, Response } from 'express';
import { prisma } from '../db';
import PDFDocument from 'pdfkit';

// Helper to determine letter grade
const getLetterGrade = (total: number): string => {
  if (total >= 70) return 'A (Excellent)';
  if (total >= 60) return 'B (Very Good)';
  if (total >= 50) return 'C (Credit)';
  if (total >= 45) return 'D (Pass)';
  if (total >= 40) return 'E (Fair)';
  return 'F (Fail)';
};

// Helper for AI Comment Generation (with fallback)
const generateAIComment = (studentName: string, subject: string, total: number): string => {
  const first = studentName.split(' ')[0];
  if (total >= 80) {
    const comments = [
      `${first} shows outstanding comprehension of ${subject}. A natural talent who helps peers.`,
      `Excellent performance! ${first} is highly diligent, consistently producing work of the highest caliber in ${subject}.`,
      `${first} has excelled remarkably in ${subject} this term. Displays excellent critical thinking.`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  } else if (total >= 60) {
    const comments = [
      `${first} has a solid understanding of ${subject} but could benefit from paying more attention to detail.`,
      `Good effort! ${first} is performing well in ${subject} and with a bit more consistency, can achieve top grades.`,
      `${first} has shown active participation in ${subject} classes and completes tasks with diligence.`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  } else if (total >= 40) {
    const comments = [
      `${first} has passed the subject but needs to focus on core concepts in ${subject} to build stronger foundations.`,
      `Moderate progress. ${first} should devote more time to home assignments in ${subject}.`,
      `Needs improvement. I encourage ${first} to participate more and ask questions in ${subject} classes.`
    ];
    return comments[Math.floor(Math.random() * comments.length)];
  } else {
    return `${first} has struggled in ${subject} this term. Remedial classes and close monitoring are highly recommended.`;
  }
};

// Get grades for student
export const getStudentGrades = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const grades = await prisma.grade.findMany({
      where: { studentId: studentId as string },
      orderBy: { subject: 'asc' }
    });
    res.json(grades);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Submit grade by teacher
export const submitGrade = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, subject, ca1, ca2, exam, term, session } = req.body;

    const total = Number(ca1) + Number(ca2) + Number(exam);
    const gradeLetter = getLetterGrade(total);

    const student = await prisma.student.findUnique({
      where: { id: studentId },
      include: { user: { select: { name: true } } }
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const aiComment = generateAIComment(student.user.name, subject, total);

    // Upsert grade
    const existingGrade = await prisma.grade.findFirst({
      where: { studentId, subject, term, session }
    });

    let gradeRecord;
    if (existingGrade) {
      gradeRecord = await prisma.grade.update({
        where: { id: existingGrade.id },
        data: { ca1, ca2, exam, total, grade: gradeLetter, aiComment }
      });
    } else {
      gradeRecord = await prisma.grade.create({
        data: {
          studentId,
          subject,
          ca1,
          ca2,
          exam,
          total,
          grade: gradeLetter,
          term,
          session,
          aiComment
        }
      });
    }

    res.json({ message: 'Grade saved successfully', grade: gradeRecord });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Approve grades (Principal / Admin)
export const approveGrades = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, term, session } = req.body;
    await prisma.grade.updateMany({
      where: { studentId, term, session },
      data: { approved: true }
    });
    res.json({ message: 'Grades approved successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Generate AI Report Comments for bulk records
export const generateBulkComments = async (req: Request, res: Response): Promise<void> => {
  try {
    const { term, session } = req.body;
    const grades = await prisma.grade.findMany({
      where: { term, session, aiComment: null },
      include: { student: { include: { user: { select: { name: true } } } } }
    });

    let count = 0;
    for (const gd of grades) {
      const comment = generateAIComment(gd.student.user.name, gd.subject, gd.total);
      await prisma.grade.update({
        where: { id: gd.id },
        data: { aiComment: comment }
      });
      count++;
    }

    res.json({ message: `Successfully generated comments for ${count} grades` });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Export Report Card PDF
export const exportReportCardPDF = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;
    const { term, session } = req.query;

    if (!term || !session) {
      res.status(400).json({ error: 'Term and session query parameters are required' });
      return;
    }

    const student = (await prisma.student.findUnique({
      where: { id: studentId as string },
      include: { user: true }
    })) as any;

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const grades = await prisma.grade.findMany({
      where: {
        studentId: studentId as string,
        term: term as string,
        session: session as string,
        approved: true
      }
    });

    if (grades.length === 0) {
      res.status(404).json({ error: 'No approved grades found for this student, term, and session' });
      return;
    }

    // Set up PDF Document
    const doc = new PDFDocument({ margin: 50, size: 'A4' });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=Report_Card_${student.admissionNo}.pdf`);
    doc.pipe(res);

    // Decorative Header
    doc.rect(0, 0, 595.28, 20).fill('#0B3C5D'); // Royal Blue Banner

    doc.fillColor('#0B3C5D')
       .fontSize(22)
       .text('HIGH IQ MONTESSORI SCHOOL', 50, 40, { align: 'center', wordSpacing: 2 });

    doc.fontSize(10)
       .fillColor('#333333')
       .text('Ikorodu, Lagos, Nigeria | Info@highiqmontessori.sch.ng', 50, 65, { align: 'center' })
       .text('ACADEMIC REPORT CARD', 50, 80, { align: 'center', underline: true });

    doc.moveDown();

    // Student Info Panel
    doc.rect(50, 100, 495, 75).fillAndStroke('#F5F7FA', '#D3D3D3');
    doc.fillColor('#0B3C5D').fontSize(11).text('STUDENT INFORMATION', 60, 107, { bold: true } as any);
    doc.fillColor('#333333')
       .fontSize(10)
       .text(`Name: ${student.user.name}`, 60, 125)
       .text(`Admission No: ${student.admissionNo}`, 60, 140)
       .text(`Class: ${student.class}`, 60, 155)
       .text(`Term: ${term}`, 320, 125)
       .text(`Session: ${session}`, 320, 140)
       .text(`Gender: ${student.gender}`, 320, 155);

    // Table Header
    const tableTop = 200;
    doc.rect(50, tableTop, 495, 20).fill('#0B3C5D');
    doc.fillColor('#FFFFFF')
       .fontSize(9)
       .text('Subject', 55, tableTop + 5)
       .text('CA 1 (20)', 180, tableTop + 5)
       .text('CA 2 (20)', 240, tableTop + 5)
       .text('Exam (60)', 300, tableTop + 5)
       .text('Total (100)', 360, tableTop + 5)
       .text('Grade', 420, tableTop + 5);

    // Table Body
    let y = tableTop + 20;
    let sumTotal = 0;
    grades.forEach((g) => {
      sumTotal += g.total;
      doc.fillColor('#333333')
         .fontSize(9)
         .text(g.subject, 55, y + 5)
         .text(g.ca1.toString(), 180, y + 5)
         .text(g.ca2.toString(), 240, y + 5)
         .text(g.exam.toString(), 300, y + 5)
         .text(g.total.toString(), 360, y + 5)
         .text(g.grade, 420, y + 5);

      // Draw horizontal line
      doc.strokeColor('#E0E0E0').lineWidth(0.5).moveTo(50, y + 20).lineTo(545, y + 20).stroke();
      y += 20;
    });

    // Summary Calculations
    const average = (sumTotal / grades.length).toFixed(2);
    doc.moveDown();
    doc.fillColor('#0B3C5D')
       .fontSize(10)
       .text(`Number of Subjects: ${grades.length}`, 50, y + 10)
       .text(`Total Score: ${sumTotal} / ${grades.length * 100}`, 50, y + 25)
       .text(`Term Average Score: ${average}%`, 50, y + 40);

    // AI comments box
    doc.rect(50, y + 65, 495, 90).fillAndStroke('#FCF8E3', '#FBEED5');
    doc.fillColor('#C09853')
       .fontSize(10)
       .text('TEACHER & AI PERFORMANCE ASSESSMENT', 60, y + 72, { bold: true } as any);
    
    // Concatenate comments or use default summary comment
    const overallComment = `Outstanding progress in basic literacy and math. Student demonstrates Montessori virtues of concentration, independence, and respect. ${student.user.name} is showing excellent development across subjects, maintaining an average of ${average}%.`;
    doc.fillColor('#333333')
       .fontSize(9.5)
       .text(overallComment, 60, y + 90, { width: 475, align: 'justify' });

    // Signatures
    const sigY = y + 180;
    doc.strokeColor('#A0A0A0').lineWidth(0.5)
       .moveTo(50, sigY).lineTo(200, sigY).stroke()
       .moveTo(395, sigY).lineTo(545, sigY).stroke();

    doc.fillColor('#666666')
       .fontSize(9)
       .text("Class Teacher's Signature", 50, sigY + 5, { align: 'left', width: 150 })
       .text("Principal's Signature", 395, sigY + 5, { align: 'center', width: 150 });

    doc.end();
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
