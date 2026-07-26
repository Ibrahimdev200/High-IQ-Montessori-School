import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';
import { prisma } from '../db';

// Get all students
export const getStudents = async (req: Request, res: Response): Promise<void> => {
  try {
    const students = await prisma.student.findMany({
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
    res.json(students);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Get student by ID
export const getStudentById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const student = await prisma.student.findUnique({
      where: { id: id as string },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            phone: true,
            avatar: true
          }
        },
        grades: true,
        cbtResults: {
          include: {
            exam: {
              select: {
                title: true,
                subject: true
              }
            }
          }
        },
        invoices: true,
        medicalRecords: true
      }
    });

    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    res.json(student);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create Student
export const createStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      email,
      password,
      name,
      phone,
      admissionNo,
      className,
      dateOfBirth,
      gender,
      guardianName,
      guardianPhone,
      guardianEmail,
      previousSchool,
      medicalInfo
    } = req.body;

    // Check duplicate email
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ error: 'Email already registered' });
      return;
    }

    // Check duplicate admission number
    const existingAdmission = await prisma.student.findUnique({ where: { admissionNo } });
    if (existingAdmission) {
      res.status(400).json({ error: 'Admission number already exists' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password || 'student123', 10);

    // Create user and student in transaction
    const result = await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          name,
          role: 'STUDENT',
          phone
        }
      });

      // Generate a QR Code representation of student details
      const qrData = JSON.stringify({
        name,
        admissionNo,
        class: className,
        guardian: guardianName,
        school: 'High IQ Montessori School'
      });
      const qrCodeBase64 = await QRCode.toDataURL(qrData);

      const student = await tx.student.create({
        data: {
          userId: user.id,
          admissionNo,
          class: className,
          dateOfBirth,
          gender,
          qrCode: qrCodeBase64,
          guardianName,
          guardianPhone,
          guardianEmail,
          previousSchool,
          medicalInfo
        }
      });

      return { user, student };
    });

    res.status(201).json({
      message: 'Student registered successfully',
      student: result.student,
      user: {
        id: result.user.id,
        email: result.user.email,
        name: result.user.name
      }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Update student info
export const updateStudent = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, phone, className, status, guardianName, guardianPhone, medicalInfo } = req.body;

    const student = await prisma.student.findUnique({ where: { id: id as string } });
    if (!student) {
      res.status(404).json({ error: 'Student not found' });
      return;
    }

    await prisma.$transaction(async (tx) => {
      await tx.student.update({
        where: { id: id as string },
        data: {
          class: className,
          status,
          guardianName,
          guardianPhone,
          medicalInfo
        }
      });

      if (name || phone) {
        await tx.user.update({
          where: { id: student.userId },
          data: {
            name,
            phone
          }
        });
      }
    });

    res.json({ message: 'Student profile updated successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
