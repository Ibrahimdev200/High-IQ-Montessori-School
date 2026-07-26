import { Request, Response } from 'express';
import { prisma } from '../db';

// Get Invoices
export const getInvoices = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        student: {
          include: {
            user: { select: { name: true } }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(invoices);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Create Invoice
export const createInvoice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { studentId, title, amount, dueDate } = req.body;
    const invoice = await prisma.invoice.create({
      data: {
        studentId,
        title,
        amount: Number(amount),
        dueDate,
        status: 'UNPAID'
      }
    });
    res.status(201).json({ message: 'Invoice created successfully', invoice });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Record Payment (simulates Paystack / Flutterwave callback)
export const recordPayment = async (req: Request, res: Response): Promise<void> => {
  try {
    const { invoiceId, amountPaid } = req.body;

    const invoice = await prisma.invoice.findUnique({
      where: { id: invoiceId }
    });

    if (!invoice) {
      res.status(404).json({ error: 'Invoice not found' });
      return;
    }

    const newPaidAmount = invoice.paidAmount + Number(amountPaid);
    let status = 'PARTIAL';
    if (newPaidAmount >= invoice.amount) {
      status = 'PAID';
    }

    const updated = await prisma.invoice.update({
      where: { id: invoiceId },
      data: {
        paidAmount: newPaidAmount,
        status
      }
    });

    res.json({ message: 'Payment recorded successfully', invoice: updated });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

// Financial Dashboard Statistics
export const getFinanceStats = async (req: Request, res: Response): Promise<void> => {
  try {
    const invoices = await prisma.invoice.findMany();
    const staffList = await prisma.staff.findMany();

    const totalInvoiced = invoices.reduce((sum, inv) => sum + inv.amount, 0);
    const totalCollected = invoices.reduce((sum, inv) => sum + inv.paidAmount, 0);
    const totalOutstanding = totalInvoiced - totalCollected;

    // Payroll: aggregate monthly staff salaries
    const monthlyPayroll = staffList.reduce((sum, s) => sum + s.salary, 0);

    // Mock expenses
    const schoolExpenses = [
      { id: 1, category: 'Utilities', amount: 350000, date: '2026-07-10', description: 'Diesel generator fueling' },
      { id: 2, category: 'Maintenance', amount: 150000, date: '2026-07-12', description: 'Repairs in Montessori Creche' },
      { id: 3, category: 'ICT Equipment', amount: 800000, date: '2026-07-20', description: 'Purchased 4 new desktop computers' }
    ];
    const totalExpenses = schoolExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    res.json({
      revenueSummary: {
        totalInvoiced,
        totalCollected,
        totalOutstanding
      },
      payrollSummary: {
        monthlyPayroll,
        staffCount: staffList.length
      },
      expenses: schoolExpenses,
      totalExpenses,
      netCashFlow: totalCollected - totalExpenses
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
