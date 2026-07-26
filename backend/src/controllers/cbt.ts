import { Request, Response } from 'express';
import { prisma } from '../db';

// Create a CBT Exam (Teacher)
export const createCBTExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, subject, className, duration, questions } = req.body;
    // questions is expected to be an array of objects
    const questionsStr = typeof questions === 'string' ? questions : JSON.stringify(questions);

    const exam = await prisma.cBTExam.create({
      data: {
        title,
        subject,
        class: className,
        duration: Number(duration),
        questions: questionsStr,
        status: 'DRAFT'
      }
    });

    res.status(201).json({ message: 'CBT Exam created successfully', exam });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch Exams for a Class (Student)
export const getCBTExamsForClass = async (req: Request, res: Response): Promise<void> => {
  try {
    const { className } = req.params;
    const exams = await prisma.cBTExam.findMany({
      where: {
        class: className as string,
        status: 'ACTIVE'
      },
      select: {
        id: true,
        title: true,
        subject: true,
        class: true,
        duration: true,
        createdAt: true
      }
    });
    res.json(exams);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Start / Fetch specific exam details (without giving away the correct answers ahead of time)
export const startCBTExam = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const exam = await prisma.cBTExam.findUnique({
      where: { id: id as string }
    });

    if (!exam) {
      res.status(404).json({ error: 'Exam not found' });
      return;
    }

    // Strip out the correct answer property from questions before sending to frontend
    const questions = JSON.parse(exam.questions);
    const sanitizedQuestions = questions.map((q: any) => {
      const { correctAnswer, ...rest } = q;
      return rest;
    });

    res.json({
      id: exam.id,
      title: exam.title,
      subject: exam.subject,
      duration: exam.duration,
      questions: sanitizedQuestions
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Submit CBT Exam Result
export const submitCBTResult = async (req: Request, res: Response): Promise<void> => {
  try {
    const { examId, studentId, answers } = req.body;
    // answers is expected to be an array of selected options, e.g. [{ questionId: 1, selected: 'A' }]

    const exam = await prisma.cBTExam.findUnique({
      where: { id: examId }
    });

    if (!exam) {
      res.status(404).json({ error: 'Exam not found' });
      return;
    }

    const questions = JSON.parse(exam.questions);
    let score = 0;
    const totalQuestions = questions.length;

    // Grade answers
    answers.forEach((submittedAns: any) => {
      const matchingQ = questions.find((q: any) => q.id === submittedAns.questionId);
      if (matchingQ && matchingQ.correctAnswer === submittedAns.selected) {
        score += 1;
      }
    });

    const percentage = totalQuestions > 0 ? (score / totalQuestions) * 100 : 0;

    const resultRecord = await prisma.cBTResult.create({
      data: {
        studentId,
        examId,
        score: percentage,
        answers: JSON.stringify(answers)
      }
    });

    res.json({
      message: 'Exam submitted successfully',
      score: percentage,
      totalCorrect: score,
      totalQuestions,
      resultId: resultRecord.id
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Activate/Deactivate Exam
export const updateExamStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body; // ACTIVE, DRAFT, COMPLETED

    const updated = await prisma.cBTExam.update({
      where: { id: id as string },
      data: { status }
    });

    res.json({ message: `Exam status updated to ${status}`, exam: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
