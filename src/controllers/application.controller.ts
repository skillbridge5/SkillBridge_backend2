

import { Request, Response } from 'express';
import prisma from '../config/prisma';
// import { ApplicationStatus } from '@prisma/client'; // Commented out because it does not exist
import path from 'path';
import { existsSync } from 'fs';
import { ApplicationCreateInput, ApplicationUpdateInput } from '../middlewares/validators/applicationValidation';

export const getAllApplications = async (req: Request, res: Response) => {
  try {
    const { status, search, courseId } = req.query;

    const applications = await prisma.studentApplication.findMany({
      where: {
        status: status as any, // Use 'any' if ApplicationStatus enum is not available
        courseId: courseId as string,
        OR: search ? [
          { fullName: { contains: search as string, mode: 'insensitive' } },
          { email: { contains: search as string, mode: 'insensitive' } },
          { paymentReference: { contains: search as string, mode: 'insensitive' } }
        ] : undefined
      },
      include: {
        course: { select: { title: true } },
        student: { select: { name: true } }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getApplicationById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const application = await prisma.studentApplication.findUnique({
      where: { id },
      include: {
        course: { select: { title: true } },
        student: { select: { name: true } }
      }
    });

    if (!application) return res.status(404).json({ error: 'Application not found' });
    if (!req.user) return res.status(403).json({ error: 'Unauthorized' });

    if (req.user.role !== 'ADMIN' && req.user.role !== 'INSTRUCTOR' &&
        application.studentId !== req.user.id) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json(application);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createApplication = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(403).json({ error: 'Unauthorized' });
    const input: ApplicationCreateInput = req.body;

    const course = await prisma.course.findUnique({ where: { id: input.courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Always set studentId from session
    const data: any = { ...input, studentId: req.user.id };
    delete data.student; // In case someone tries to send a student object
    delete data.studentId; // Remove any spoofed studentId from body, then set correct one
    data.studentId = req.user.id;

    const application = await prisma.studentApplication.create({
      data
    });

    res.status(201).json(application);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const updateApplication = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(403).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const input: ApplicationUpdateInput = req.body;

    const application = await prisma.studentApplication.update({
      where: { id },
      data: {
        ...input,
        reviewedAt: input.status ? new Date() : undefined,
        reviewedBy: input.status ? req.user.id : undefined
      }
    });

    res.json(application);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};

export const getUserApplications = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(403).json({ error: 'Unauthorized' });

    const applications = await prisma.studentApplication.findMany({
      where: { studentId: req.user.id },
      include: {
        course: { select: { title: true } }
      },
      orderBy: { submittedAt: 'desc' }
    });

    res.json(applications);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const uploadApplicationReceipt = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(403).json({ error: 'Unauthorized' });
    if (!req.file || !(req.file as any).location) return res.status(400).json({ error: 'No file uploaded' });

    const { id } = req.params;
    const fileUrl = (req.file as any).location;

    // Find the application first
    const application = await prisma.studentApplication.findUnique({ where: { id } });
    if (!application) return res.status(404).json({ error: 'Application not found' });

    // Only allow students to upload for their own application, admins/instructors for any
    if (
      req.user.role === 'STUDENT' && application.studentId !== req.user.id
    ) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    const updated = await prisma.studentApplication.update({
      where: { id },
      data: { receiptUrl: fileUrl }
    });

    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
};


export const downloadApplicationReceipt = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(403).json({ error: 'Unauthorized' });

    const { id } = req.params;
    const application = await prisma.studentApplication.findUnique({
      where: { id },
      select: { receiptUrl: true, studentId: true }
    });

    if (!application?.receiptUrl) return res.status(404).json({ error: 'Receipt not found' });

    if (application.studentId !== req.user.id &&
        req.user.role !== 'ADMIN' &&
        req.user.role !== 'INSTRUCTOR') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    res.json({ url: application.receiptUrl });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createApplicationWithReceipt = async (req: Request, res: Response) => {
  try {
    if (!req.user) return res.status(403).json({ error: 'Unauthorized' });
    if (!req.file || !(req.file as any).location) {
      return res.status(400).json({ error: 'Receipt file is required' });
    }

    const input: ApplicationCreateInput = req.body;
    const fileUrl = (req.file as any).location;

    // Validate course exists
    const course = await prisma.course.findUnique({ where: { id: input.courseId } });
    if (!course) return res.status(404).json({ error: 'Course not found' });

    // Create application with receipt in a single transaction
    const application = await prisma.studentApplication.create({
      data: {
        ...input,
        studentId: req.user.id,
        receiptUrl: fileUrl,
        status: 'PENDING'
      },
      include: {
        course: { select: { title: true } },
        student: { select: { name: true } }
      }
    });

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully with receipt',
      application
    });
  } catch (error) {
    console.error('Application creation error:', error);
    res.status(400).json({ 
      error: (error as Error).message,
      details: 'Failed to create application with receipt'
    });
  }
};



