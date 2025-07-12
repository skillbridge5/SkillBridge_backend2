import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Helper to include expertise names in instructor queries
const instructorInclude = {
  user: true,
  instructorExpertise: {
    include: {
      expertise: true,
    },
  },
  // Optionally include courses, etc.
};

// GET /api/instructors?status=ACTIVE&expertise=Web%20Development
export const getAllInstructors = async (req: Request, res: Response) => {
  try {
    const { status, expertise } = req.query;
    const where: any = {};
    if (status) where.status = status;
    if (expertise) {
      where.instructorExpertise = {
        some: {
          expertise: {
            name: expertise,
          },
        },
      };
    }
    const instructors = await prisma.instructorProfile.findMany({
      where,
      include: instructorInclude,
    });
    res.json(instructors.map(formatInstructor));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// GET /api/instructors/:id
export const getInstructorById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const instructor = await prisma.instructorProfile.findUnique({
      where: { id },
      include: instructorInclude,
    });
    if (!instructor) return res.status(404).json({ error: 'Instructor not found' });
    res.json(formatInstructor(instructor));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// POST /api/instructors
export const createInstructor = async (req: Request, res: Response) => {
  try {
    const { userId, phone, yearsOfExperience, bio, status, rating, students, expertise } = req.body;
    // expertise: string[] of expertise names
    let expertiseIds: string[] = [];
    if (Array.isArray(expertise)) {
      for (const name of expertise) {
        const exp = await prisma.expertise.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        expertiseIds.push(exp.id);
      }
    }
    const instructor = await prisma.instructorProfile.create({
      data: {
        userId,
        phone,
        yearsOfExperience,
        bio,
        status,
        rating,
        students,
        instructorExpertise: expertiseIds.length > 0 ? {
          create: expertiseIds.map((expertiseId: string) => ({ expertiseId })),
        } : undefined,
      },
      include: instructorInclude,
    });
    res.status(201).json(formatInstructor(instructor));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// PUT /api/instructors/:id
export const updateInstructor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { phone, yearsOfExperience, bio, status, rating, students, expertise } = req.body;
    let expertiseIds: string[] = [];
    if (Array.isArray(expertise)) {
      for (const name of expertise) {
        const exp = await prisma.expertise.upsert({
          where: { name },
          update: {},
          create: { name },
        });
        expertiseIds.push(exp.id);
      }
    }
    await prisma.instructorExpertise.deleteMany({ where: { instructorId: id } });
    const instructor = await prisma.instructorProfile.update({
      where: { id },
      data: {
        phone,
        yearsOfExperience,
        bio,
        status,
        rating,
        students,
        instructorExpertise: expertiseIds.length > 0 ? {
          create: expertiseIds.map((expertiseId: string) => ({ expertiseId })),
        } : undefined,
      },
      include: instructorInclude,
    });
    res.json(formatInstructor(instructor));
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// DELETE /api/instructors/:id
export const deleteInstructor = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.instructorExpertise.deleteMany({ where: { instructorId: id } });
    await prisma.instructorProfile.delete({ where: { id } });
    res.json({ message: 'Instructor deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Helper to format instructor response
function formatInstructor(instructor: any) {
  return {
    ...instructor,
    expertise: instructor.instructorExpertise?.map((ie: any) => ie.expertise?.name) || [],
    user: instructor.user,
    // Optionally add courses, etc.
  };
} 