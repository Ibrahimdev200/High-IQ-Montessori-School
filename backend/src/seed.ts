import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import QRCode from 'qrcode';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Reset database records
  await prisma.attendance.deleteMany();
  await prisma.grade.deleteMany();
  await prisma.cBTResult.deleteMany();
  await prisma.cBTExam.deleteMany();
  await prisma.invoice.deleteMany();
  await prisma.book.deleteMany();
  await prisma.transportRoute.deleteMany();
  await prisma.medicalRecord.deleteMany();
  await prisma.inventoryItem.deleteMany();
  await prisma.lessonPlan.deleteMany();
  await prisma.staff.deleteMany();
  await prisma.student.deleteMany();
  await prisma.user.deleteMany();
  await prisma.systemSetting.deleteMany();

  const hashedPassword = await bcrypt.hash('password123', 10);

  // 1. Create ADMIN User
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@highiq.edu.ng',
      password: hashedPassword,
      name: 'Dr. John Admin',
      role: 'ADMIN',
      phone: '+234 801 234 5678'
    }
  });

  // 2. Create PRINCIPAL User
  const principalUser = await prisma.user.create({
    data: {
      email: 'principal@highiq.edu.ng',
      password: hashedPassword,
      name: 'Mrs. Adewale Cynthia',
      role: 'PRINCIPAL',
      phone: '+234 802 345 6789'
    }
  });

  // 3. Create TEACHER User & Staff record
  const teacherUser = await prisma.user.create({
    data: {
      email: 'teacher@highiq.edu.ng',
      password: hashedPassword,
      name: 'Mr. Babatunde Emeka',
      role: 'TEACHER',
      phone: '+234 803 456 7890'
    }
  });
  const teacherStaff = await prisma.staff.create({
    data: {
      userId: teacherUser.id,
      employeeId: 'HIQ-TCH-001',
      department: 'Academics',
      qualification: 'B.Ed. Montessori Education, University of Ibadan',
      salary: 180000.0,
      hireDate: '2023-09-01',
      status: 'ACTIVE'
    }
  });

  // 4. Create STUDENT User & Student record
  const studentUser = await prisma.user.create({
    data: {
      email: 'student@highiq.edu.ng',
      password: hashedPassword,
      name: 'Adebayo Oluwaseun',
      role: 'STUDENT',
      phone: '+234 804 567 8901'
    }
  });
  
  // Generate student QR code
  const qrData = JSON.stringify({
    name: 'Adebayo Oluwaseun',
    admissionNo: 'HIQ-STUD-2026-0042',
    class: 'Primary 5',
    guardian: 'Chief Adebayo Ola',
    school: 'High IQ Montessori School'
  });
  const qrCodeBase64 = await QRCode.toDataURL(qrData);

  const studentRecord = await prisma.student.create({
    data: {
      userId: studentUser.id,
      admissionNo: 'HIQ-STUD-2026-0042',
      class: 'Primary 5',
      dateOfBirth: '2016-04-12',
      gender: 'MALE',
      qrCode: qrCodeBase64,
      guardianName: 'Chief Adebayo Ola',
      guardianPhone: '+234 809 111 2222',
      guardianEmail: 'parent@highiq.edu.ng',
      previousSchool: 'Lagos Prep Academy',
      medicalInfo: 'Allergy to peanuts, Blood Group O+'
    }
  });

  // 5. Create PARENT User
  const parentUser = await prisma.user.create({
    data: {
      email: 'parent@highiq.edu.ng',
      password: hashedPassword,
      name: 'Chief Adebayo Ola',
      role: 'PARENT',
      phone: '+234 809 111 2222'
    }
  });

  // 6. Create FINANCE User & Staff record
  const financeUser = await prisma.user.create({
    data: {
      email: 'finance@highiq.edu.ng',
      password: hashedPassword,
      name: 'Mr. Kunle Adeyemi',
      role: 'FINANCE',
      phone: '+234 805 678 9012'
    }
  });
  await prisma.staff.create({
    data: {
      userId: financeUser.id,
      employeeId: 'HIQ-FIN-001',
      department: 'Finance',
      qualification: 'B.Sc. Accounting, ICAN',
      salary: 160000.0,
      hireDate: '2024-01-15',
      status: 'ACTIVE'
    }
  });

  // 7. Create HR User & Staff record
  const hrUser = await prisma.user.create({
    data: {
      email: 'hr@highiq.edu.ng',
      password: hashedPassword,
      name: 'Mrs. Janet Nwosu',
      role: 'HR',
      phone: '+234 806 789 0123'
    }
  });
  await prisma.staff.create({
    data: {
      userId: hrUser.id,
      employeeId: 'HIQ-HR-001',
      department: 'HR',
      qualification: 'M.Sc. Human Resource Management',
      salary: 155000.0,
      hireDate: '2024-02-10',
      status: 'ACTIVE'
    }
  });

  // 8. Create LIBRARIAN User & Staff record
  const librarianUser = await prisma.user.create({
    data: {
      email: 'librarian@highiq.edu.ng',
      password: hashedPassword,
      name: 'Ms. Ngozi Chidi',
      role: 'LIBRARIAN',
      phone: '+234 807 890 1234'
    }
  });
  await prisma.staff.create({
    data: {
      userId: librarianUser.id,
      employeeId: 'HIQ-LIB-001',
      department: 'Logistics',
      qualification: 'B.Sc. Library Studies',
      salary: 110000.0,
      hireDate: '2024-03-01',
      status: 'ACTIVE'
    }
  });

  // 9. Create HOSTEL User & Staff record
  const hostelUser = await prisma.user.create({
    data: {
      email: 'hostel@highiq.edu.ng',
      password: hashedPassword,
      name: 'Mr. Paul Okoye',
      role: 'HOSTEL',
      phone: '+234 808 901 2345'
    }
  });
  await prisma.staff.create({
    data: {
      userId: hostelUser.id,
      employeeId: 'HIQ-HST-001',
      department: 'Logistics',
      qualification: 'B.Sc. Sociology',
      salary: 100000.0,
      hireDate: '2024-05-12',
      status: 'ACTIVE'
    }
  });

  // 10. Create TRANSPORT User & Staff record
  const transportUser = await prisma.user.create({
    data: {
      email: 'transport@highiq.edu.ng',
      password: hashedPassword,
      name: 'Mr. Tunde Driver',
      role: 'TRANSPORT',
      phone: '+234 809 012 3456'
    }
  });
  await prisma.staff.create({
    data: {
      userId: transportUser.id,
      employeeId: 'HIQ-TRN-001',
      department: 'Logistics',
      qualification: 'Trade Test Level 1, Professional Driver License',
      salary: 95000.0,
      hireDate: '2022-01-10',
      status: 'ACTIVE'
    }
  });

  // 11. Create CLINIC User & Staff record
  const clinicUser = await prisma.user.create({
    data: {
      email: 'clinic@highiq.edu.ng',
      password: hashedPassword,
      name: 'Nurse Funmi Coker',
      role: 'CLINIC',
      phone: '+234 810 123 4567'
    }
  });
  await prisma.staff.create({
    data: {
      userId: clinicUser.id,
      employeeId: 'HIQ-NUR-001',
      department: 'Logistics',
      qualification: 'Registered Nurse (RN), Lagos State Medical Board',
      salary: 130000.0,
      hireDate: '2023-01-20',
      status: 'ACTIVE'
    }
  });

  // --- Seed Secondary Records ---

  // A. Grades
  await prisma.grade.createMany({
    data: [
      {
        studentId: studentRecord.id,
        subject: 'Mathematics',
        ca1: 18,
        ca2: 17,
        exam: 52,
        total: 87,
        grade: 'A (Excellent)',
        term: '1st Term',
        session: '2025/2026',
        aiComment: 'Adebayo has displayed outstanding algebraic logic. High capability with arithmetic blocks.',
        approved: true
      },
      {
        studentId: studentRecord.id,
        subject: 'English Language',
        ca1: 15,
        ca2: 16,
        exam: 48,
        total: 79,
        grade: 'A (Excellent)',
        term: '1st Term',
        session: '2025/2026',
        aiComment: 'Adebayo writes exceptionally well. Has an expansive vocabulary and structures work neatly.',
        approved: true
      },
      {
        studentId: studentRecord.id,
        subject: 'Quantitative Reasoning',
        ca1: 16,
        ca2: 14,
        exam: 45,
        total: 75,
        grade: 'A (Excellent)',
        term: '1st Term',
        session: '2025/2026',
        aiComment: 'Displays outstanding critical thinking. Connects abstract logic grids seamlessly.',
        approved: true
      }
    ]
  });

  // B. CBT Exams
  const cbtMath = await prisma.cBTExam.create({
    data: {
      title: 'Mathematics Term Quiz',
      subject: 'Mathematics',
      class: 'Primary 5',
      duration: 10,
      status: 'ACTIVE',
      questions: JSON.stringify([
        {
          id: 1,
          question: 'Solve for x: 3x + 7 = 22',
          options: ['A) 3', 'B) 5', 'C) 7', 'D) 15'],
          correctAnswer: 'B'
        },
        {
          id: 2,
          question: 'What is the value of 12 * 8?',
          options: ['A) 84', 'B) 92', 'C) 96', 'D) 108'],
          correctAnswer: 'C'
        },
        {
          id: 3,
          question: 'In a Montessori counting beads board, what digit color represents 100?',
          options: ['A) Red', 'B) Blue', 'C) Green', 'D) Yellow'],
          correctAnswer: 'A'
        }
      ])
    }
  });

  // C. Invoices
  await prisma.invoice.createMany({
    data: [
      {
        studentId: studentRecord.id,
        title: 'Primary 5 Tuition Fees - 1st Term',
        amount: 250000.0,
        paidAmount: 250000.0,
        status: 'PAID',
        dueDate: '2026-09-01'
      },
      {
        studentId: studentRecord.id,
        title: 'Primary 5 Tuition Fees - 2nd Term',
        amount: 250000.0,
        paidAmount: 100000.0,
        status: 'PARTIAL',
        dueDate: '2027-01-10'
      }
    ]
  });

  // D. Books
  await prisma.book.createMany({
    data: [
      { title: 'The Absorbent Mind', author: 'Maria Montessori', isbn: '978-0805041569', status: 'AVAILABLE' },
      { title: 'The Discovery of the Child', author: 'Maria Montessori', isbn: '978-0345336569', status: 'AVAILABLE' },
      { title: 'Introduction to Robotics 4th Edition', author: 'John J. Craig', isbn: '978-0133489835', status: 'AVAILABLE' },
      { title: 'Advanced English Grammar', author: 'Martin Hewings', isbn: '978-1107697386', status: 'AVAILABLE' }
    ]
  });

  // E. Transport Routes
  await prisma.transportRoute.create({
    data: {
      name: 'Ikorodu Bus Terminal to School (Route A)',
      driverName: 'Mr. Tunde Driver',
      driverPhone: '+234 809 012 3456',
      vehicleNo: 'LAG-441-HIQ',
      fee: 25000.0,
      currentLat: 6.6186,
      currentLng: 3.5029,
      status: 'EN_ROUTE'
    }
  });

  // F. Clinic Log
  await prisma.medicalRecord.create({
    data: {
      studentId: studentRecord.id,
      symptoms: 'Mild Headache & body temperature of 38.2C',
      diagnosis: 'Mild Fever',
      treatment: 'Administered 5ml Paracetamol syrup. Rested for 1 hour.',
      date: '2026-07-22',
      nurseName: 'Nurse Funmi Coker'
    }
  });

  // G. System Settings
  await prisma.systemSetting.createMany({
    data: [
      { key: 'school_name', value: 'High IQ Montessori School' },
      { key: 'current_session', value: '2025/2026' },
      { key: 'current_term', value: '1st Term' },
      { key: 'academic_calendar_url', value: '/files/calendar_2025_2026.pdf' }
    ]
  });

  // H. Lesson Plans
  await prisma.lessonPlan.create({
    data: {
      teacherId: teacherStaff.id,
      class: 'Primary 5',
      subject: 'Mathematics',
      topic: 'Simple Equations',
      objectives: 'Understand variable variables, solve simple addition/subtraction equation balances.',
      content: 'Using balancing scales with weights representing unknowns. Solve x + 4 = 10, etc.',
      aiGenerated: true
    }
  });

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
