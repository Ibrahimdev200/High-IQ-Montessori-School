import { Request, Response } from 'express';
import { prisma } from '../db';

// Log Attendance (Manual or Bulk)
export const logAttendance = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, status, type, refId } = req.body; // refId can be studentId or staffId

    // Check if record already exists for this date and user
    const existing = await prisma.attendance.findFirst({
      where: { date, refId, type }
    });

    let record;
    if (existing) {
      record = await prisma.attendance.update({
        where: { id: existing.id },
        data: { status }
      });
    } else {
      record = await prisma.attendance.create({
        data: { date, status, type, refId }
      });
    }

    res.json({ message: 'Attendance recorded successfully', record });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// QR Code Check-In Simulator
export const qrCheckIn = async (req: Request, res: Response): Promise<void> => {
  try {
    const { qrData, date } = req.body; // qrData is JSON string from scanned student QR code
    const parsed = JSON.parse(qrData);

    const student = await prisma.student.findUnique({
      where: { admissionNo: parsed.admissionNo },
      include: { user: { select: { name: true } } }
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found matching QR card' });
      return;
    }

    const checkInDate = date || new Date().toISOString().split('T')[0];

    const existing = await prisma.attendance.findFirst({
      where: { date: checkInDate, refId: student.id, type: 'STUDENT' }
    });

    let record;
    if (existing) {
      record = await prisma.attendance.update({
        where: { id: existing.id },
        data: { status: 'PRESENT' }
      });
    } else {
      record = await prisma.attendance.create({
        data: {
          date: checkInDate,
          status: 'PRESENT',
          type: 'STUDENT',
          refId: student.id
        }
      });
    }

    res.json({
      message: `Check-in successful! Welcome, ${student.user.name}`,
      student: student.user.name,
      admissionNo: student.admissionNo,
      record
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Invalid QR code scan data' });
  }
};

// Get Attendance Reports
export const getAttendanceReport = async (req: Request, res: Response): Promise<void> => {
  try {
    const { date, type } = req.query; // date: YYYY-MM-DD, type: STUDENT or STAFF
    const queryDate = (date as string) || new Date().toISOString().split('T')[0];

    const logs = await prisma.attendance.findMany({
      where: {
        date: queryDate,
        type: type ? (type as string) : undefined
      }
    });

    res.json({ date: queryDate, logs });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
