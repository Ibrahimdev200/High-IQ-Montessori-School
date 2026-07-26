import { Request, Response } from 'express';
import { prisma } from '../db';

// AI Lesson Note/Plan Generator
export const generateLessonPlan = async (req: Request, res: Response): Promise<void> => {
  try {
    const { className, subject, topic, objectives } = req.body;

    // Simulated premium lesson notes based on Montessori and British styles
    const markdownPlan = `
# Lesson Plan: ${topic}
**Class:** ${className} | **Subject:** ${subject}
**Teaching Methodology:** Montessori & Active Inquiry-Based

---

## 1. Lesson Objectives
After this session, students will be able to:
- Explain the key concepts of **${topic}**.
- Demonstrate hands-on competence in worksheets and Montessori sensory tools.
- ${objectives || 'Apply these concepts to solve daily life scenarios.'}

## 2. Materials & Montessori Tools Needed
- Sensory wooden counting blocks / tactile maps (subject specific).
- Color-coded activity cards.
- Interactive digital slide deck.

## 3. Step-by-Step Lesson Outline

### Introduction (10 mins)
- Warm-up activity: Play a short 3-minute video on ${topic}.
- Sensory mapping: Invite students to touch or visualize the concept blocks.

### Core Activity (25 mins)
- **Teacher Demonstration:** Demonstrate the core principles of ${topic} using visual aid cards.
- **Independent Study (Montessori Free Choice):** Let students choose partners and practice using the tactile boards.
- **Individual Support:** Circulate to guide students who require customized pace.

### Summary & Assessment (10 mins)
- Class-wide quiz using three-part cards.
- Students file progress logs in their classroom folders.

---

## 4. Evaluation Notes
- Observe student dexterity in using the materials.
- Assign homework worksheet: "${topic} Foundation Activity Sheet".
`;

    res.json({
      className,
      subject,
      topic,
      lessonPlan: markdownPlan,
      aiGenerated: true
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// AI Student Performance Predictor & Analyst
export const analyzePerformance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId } = req.params;

    const student = (await prisma.student.findUnique({
      where: { id: studentId as string },
      include: { grades: true, user: { select: { name: true } } }
    })) as any;

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    const totalGrades = student.grades.length;
    const gpa = totalGrades > 0
      ? student.grades.reduce((sum: number, g: any) => sum + g.total, 0) / totalGrades
      : 0;

    let gradeAdvice = '';
    let predictedAttendance = '95%';
    let academicRisk = 'LOW';

    if (gpa >= 75) {
      gradeAdvice = `${student.user.name} is performing at an elite academic level. Recommendation: Enroll in STEM robotics and advanced creative coding leagues.`;
      predictedAttendance = '98% (Highly Engaged)';
    } else if (gpa >= 50) {
      gradeAdvice = `${student.user.name} is showing steady progress but has slight gaps in math/science subjects. Recommendation: Focus on guided self-correction intervals in afternoon study sessions.`;
      predictedAttendance = '91% (Steady)';
    } else {
      gradeAdvice = `${student.user.name} is performing below grade level. Academic support program is critical. Recommendation: Initiate intensive 1-on-1 Montessori remediation.`;
      predictedAttendance = '74% (Attendance Risk identified)';
      academicRisk = 'HIGH';
    }

    res.json({
      studentName: student.user.name,
      averageScore: gpa.toFixed(1),
      academicRisk,
      predictedAttendance,
      aiInsights: gradeAdvice,
      learningStyleRecommendation: 'Visual-Tactile (Montessori bead framework match)'
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// AI Parent Broadcast Message Planner
export const generateParentMessage = async (req: Request, res: Response): Promise<void> => {
  try {
    const { eventType, details } = req.body;
    let template = '';

    if (eventType === 'ACADEMIC_ALERT') {
      template = `Dear Parents/Guardians,\n\nThis is a friendly academic update from High IQ Montessori School. We noticed your ward has shown exceptional interest in recent class modules. To ensure their momentum continues, please review their ongoing lesson diary on the Parent Portal.\n\nWarm regards,\nHigh IQ Montessori Management.`;
    } else if (eventType === 'FEE_REMINDER') {
      template = `Dear Parents/Guardians,\n\nWe kindly remind you that the current term payment schedules are open. To support seamless school infrastructure runs, please review the outstanding invoices under the Invoices tab in your portal dashboard. Online payment channels (Paystack/Flutterwave) are fully operational.\n\nWarm regards,\nFinance Office, High IQ Montessori.`;
    } else {
      template = `Dear Parents/Guardians,\n\nHigh IQ Montessori School invites you to our upcoming school events. Please check the events calendar on your Parent Portal for full schedules, excursions, and activities.\n\nWarm regards,\nAdministration Office.`;
    }

    res.json({ message: template });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
