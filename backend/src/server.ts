import express, { json, Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { prisma } from './db';
import {
  registerUser,
  loginUser,
  getCurrentUser,
  authMiddleware,
  roleMiddleware,
  AuthenticatedRequest
} from './controllers/auth';
import {
  getStudents,
  getStudentById,
  createStudent,
  updateStudent
} from './controllers/students';
import {
  getStudentGrades,
  submitGrade,
  approveGrades,
  generateBulkComments,
  exportReportCardPDF
} from './controllers/grades';
import {
  createCBTExam,
  getCBTExamsForClass,
  startCBTExam,
  submitCBTResult,
  updateExamStatus
} from './controllers/cbt';
import {
  getInvoices,
  createInvoice,
  recordPayment,
  getFinanceStats
} from './controllers/finance';
import {
  logAttendance,
  qrCheckIn,
  getAttendanceReport
} from './controllers/attendance';
import {
  generateLessonPlan,
  analyzePerformance,
  generateParentMessage
} from './controllers/ai';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(json());

// --- Health Check ---
app.get('/api/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'High IQ Montessori School API is fully online' });
});

// --- Auth Routes ---
app.post('/api/auth/register', registerUser);
app.post('/api/auth/login', loginUser);
app.get('/api/auth/me', authMiddleware as any, getCurrentUser as any);

// --- Student Routes ---
app.get('/api/students', authMiddleware as any, getStudents);
app.get('/api/students/:id', authMiddleware as any, getStudentById);
app.post('/api/students', authMiddleware as any, roleMiddleware(['ADMIN', 'PRINCIPAL', 'HR']) as any, createStudent);
app.put('/api/students/:id', authMiddleware as any, roleMiddleware(['ADMIN', 'PRINCIPAL', 'HR']) as any, updateStudent);

// --- Grade & Report Routes ---
app.get('/api/grades/student/:studentId', authMiddleware as any, getStudentGrades);
app.post('/api/grades/submit', authMiddleware as any, roleMiddleware(['ADMIN', 'TEACHER', 'PRINCIPAL']) as any, submitGrade);
app.post('/api/grades/approve', authMiddleware as any, roleMiddleware(['ADMIN', 'PRINCIPAL']) as any, approveGrades);
app.post('/api/grades/bulk-comments', authMiddleware as any, roleMiddleware(['ADMIN', 'PRINCIPAL', 'TEACHER']) as any, generateBulkComments);
app.get('/api/grades/report-card/:studentId', exportReportCardPDF); // Public/Direct download for PDF viewer/downloaders

// --- CBT Routes ---
app.post('/api/cbt/exams', authMiddleware as any, roleMiddleware(['ADMIN', 'TEACHER']) as any, createCBTExam);
app.get('/api/cbt/exams/class/:className', authMiddleware as any, getCBTExamsForClass);
app.get('/api/cbt/exams/:id/start', authMiddleware as any, startCBTExam);
app.post('/api/cbt/exams/submit', authMiddleware as any, submitCBTResult);
app.put('/api/cbt/exams/:id/status', authMiddleware as any, roleMiddleware(['ADMIN', 'TEACHER']) as any, updateExamStatus);

// --- Finance Routes ---
app.get('/api/finance/invoices', authMiddleware as any, roleMiddleware(['ADMIN', 'FINANCE', 'PRINCIPAL']) as any, getInvoices);
app.post('/api/finance/invoices', authMiddleware as any, roleMiddleware(['ADMIN', 'FINANCE']) as any, createInvoice);
app.post('/api/finance/pay', authMiddleware as any, recordPayment);
app.get('/api/finance/stats', authMiddleware as any, roleMiddleware(['ADMIN', 'FINANCE', 'PRINCIPAL']) as any, getFinanceStats);

// --- Attendance Routes ---
app.post('/api/attendance/log', authMiddleware as any, logAttendance);
app.post('/api/attendance/qr-checkin', qrCheckIn); // Open scanner entry
app.get('/api/attendance/report', authMiddleware as any, getAttendanceReport);

// --- AI Service Routes ---
app.post('/api/ai/lesson-plan', authMiddleware as any, roleMiddleware(['ADMIN', 'TEACHER']) as any, generateLessonPlan);
app.get('/api/ai/predict/:studentId', authMiddleware as any, roleMiddleware(['ADMIN', 'TEACHER', 'PRINCIPAL']) as any, analyzePerformance);
app.post('/api/ai/parent-message', authMiddleware as any, roleMiddleware(['ADMIN', 'TEACHER']) as any, generateParentMessage);

// --- Library Endpoints (Inline) ---
app.get('/api/books', authMiddleware as any, async (req: Request, res: Response) => {
  try {
    const books = await prisma.book.findMany();
    res.json(books);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/books/checkout', authMiddleware as any, roleMiddleware(['ADMIN', 'LIBRARIAN']) as any, async (req: Request, res: Response) => {
  try {
    const { bookId, borrowerId, borrowerName, dueDate } = req.body;
    const updated = await prisma.book.update({
      where: { id: bookId },
      data: {
        status: 'BORROWED',
        borrowerId,
        borrowerName,
        dueDate
      }
    });
    res.json({ message: 'Book checked out successfully', book: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/books/return', authMiddleware as any, roleMiddleware(['ADMIN', 'LIBRARIAN']) as any, async (req: Request, res: Response) => {
  try {
    const { bookId } = req.body;
    const updated = await prisma.book.update({
      where: { id: bookId },
      data: {
        status: 'AVAILABLE',
        borrowerId: null,
        borrowerName: null,
        dueDate: null
      }
    });
    res.json({ message: 'Book returned successfully', book: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Transport Endpoints (Inline) ---
app.get('/api/transport/routes', authMiddleware as any, async (req: Request, res: Response) => {
  try {
    const routes = await prisma.transportRoute.findMany();
    res.json(routes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/transport/routes/:id/gps', authMiddleware as any, roleMiddleware(['ADMIN', 'TRANSPORT']) as any, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { currentLat, currentLng, status } = req.body;
    const updated = await prisma.transportRoute.update({
      where: { id: id as string },
      data: { currentLat, currentLng, status }
    });
    res.json({ message: 'GPS coordinates updated', route: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Clinic Endpoints (Inline) ---
app.get('/api/clinic/records', authMiddleware as any, roleMiddleware(['ADMIN', 'CLINIC', 'PRINCIPAL']) as any, async (req: Request, res: Response) => {
  try {
    const records = await prisma.medicalRecord.findMany({
      include: {
        student: { include: { user: { select: { name: true } } } }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(records);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/clinic/records', authMiddleware as any, roleMiddleware(['ADMIN', 'CLINIC']) as any, async (req: Request, res: Response) => {
  try {
    const { studentId, symptoms, diagnosis, treatment, date, nurseName } = req.body;
    const record = await prisma.medicalRecord.create({
      data: { studentId, symptoms, diagnosis, treatment, date, nurseName }
    });
    res.status(201).json({ message: 'Clinic log created successfully', record });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- HR & Staff Profiles (Inline) ---
app.get('/api/staff', authMiddleware as any, roleMiddleware(['ADMIN', 'HR', 'PRINCIPAL']) as any, async (req: Request, res: Response) => {
  try {
    const staff = await prisma.staff.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        }
      }
    });
    res.json(staff);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- Inventory Endpoints (Inline) ---
app.get('/api/inventory', authMiddleware as any, async (req: Request, res: Response) => {
  try {
    const items = await prisma.inventoryItem.findMany();
    res.json(items);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/inventory', authMiddleware as any, roleMiddleware(['ADMIN', 'HR']) as any, async (req: Request, res: Response) => {
  try {
    const { name, category, quantity, condition, location, maintenanceSchedule } = req.body;
    const item = await prisma.inventoryItem.create({
      data: { name, category, quantity: Number(quantity), condition, location, maintenanceSchedule }
    });
    res.status(201).json({ message: 'Inventory item added successfully', item });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// --- System Settings Endpoints (Inline) ---
app.get('/api/settings', async (req: Request, res: Response) => {
  try {
    const settings = await prisma.systemSetting.findMany();
    res.json(settings);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/settings', authMiddleware as any, roleMiddleware(['ADMIN']) as any, async (req: Request, res: Response) => {
  try {
    const { key, value } = req.body;
    const setting = await prisma.systemSetting.upsert({
      where: { key },
      update: { value },
      create: { key, value }
    });
    res.json({ message: 'Setting updated successfully', setting });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`Backend server running on http://localhost:${PORT}`);
});
