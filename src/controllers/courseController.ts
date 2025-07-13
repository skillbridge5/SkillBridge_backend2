import { Request, Response } from 'express';
import prisma from '../config/prisma';

// --- Course ---
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({ 
      include: { 
        category: true, 
        instructor: true, 
        modules: { 
          include: { lessons: true },
          orderBy: { order: 'asc' }
        }, 
        learningOutcomes: true, 
        prerequisites: true 
      } 
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({ 
      where: { id }, 
      include: { 
        category: true, 
        instructor: true, 
        modules: { 
          include: { lessons: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' }
        }, 
        learningOutcomes: true, 
        prerequisites: true 
      } 
    });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Enhanced course creation with comprehensive data
export const createCourseWithDetails = async (req: Request, res: Response) => {
  try {
    const {
      // Basic course data
      title,
      shortDescription,
      detailedDescription,
      imageUrl,
      priceOriginal,
      priceDiscounted,
      status = 'DRAFT',
      level,
      duration,
      categoryId,
      instructorId,
      
      // Additional course metadata
      slug,
      rating,
      reviews,
      students,
      enrollmentYear,
      
      // Nested data
      learningOutcomes = [],
      prerequisites = [],
      curriculum = [] // This will be converted to modules and lessons
    } = req.body;

    // Validate required fields
    if (!title || !shortDescription || !detailedDescription || !priceOriginal || !priceDiscounted || !level || !duration || !categoryId || !instructorId) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, shortDescription, detailedDescription, priceOriginal, priceDiscounted, level, duration, categoryId, instructorId' 
      });
    }

    // Use transaction to ensure all data is created atomically
    const createdCourse = await prisma.$transaction(async (tx) => {
      // Create the main course
      const course = await tx.course.create({
        data: {
          title,
          shortDescription,
          detailedDescription,
          imageUrl,
          priceOriginal: parseFloat(priceOriginal),
          priceDiscounted: parseFloat(priceDiscounted),
          status: status as any,
          level: level as any,
          duration,
          categoryId,
          instructorId,
        },
      });

      // Create learning outcomes
      if (learningOutcomes.length > 0) {
        await tx.learningOutcome.createMany({
          data: learningOutcomes.map((outcome: string) => ({
            courseId: course.id,
            text: outcome
          }))
        });
      }

      // Create prerequisites
      if (prerequisites.length > 0) {
        await tx.prerequisite.createMany({
          data: prerequisites.map((prereq: string) => ({
            courseId: course.id,
            text: prereq
          }))
        });
      }

      // Create modules and lessons from curriculum
      if (curriculum.length > 0) {
        for (let moduleIndex = 0; moduleIndex < curriculum.length; moduleIndex++) {
          const moduleData = curriculum[moduleIndex];
          
          const module = await tx.courseModule.create({
            data: {
              courseId: course.id,
              title: moduleData.title,
              duration: moduleData.duration,
              order: moduleIndex + 1
            }
          });

          // Create lessons for this module
          if (moduleData.lessons && moduleData.lessons.length > 0) {
            await tx.courseLesson.createMany({
              data: moduleData.lessons.map((lesson: any, lessonIndex: number) => ({
                moduleId: module.id,
                title: lesson.title,
                duration: lesson.duration || '30 min',
                order: lessonIndex + 1
              }))
            });
          }
        }
      }

      // Only return the new course ID
      return course.id;
    });

    // Fetch the complete course with all related data OUTSIDE the transaction
    const result = await prisma.course.findUnique({
      where: { id: createdCourse },
      include: {
        category: true,
        instructor: true,
        modules: {
          include: { lessons: { orderBy: { order: 'asc' } } },
          orderBy: { order: 'asc' }
        },
        learningOutcomes: true,
        prerequisites: true
      }
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('Error creating course with details:', error);
    res.status(500).json({ 
      error: 'Failed to create course with details',
      details: (error as Error).message 
    });
  }
};

// Comprehensive course update with all details
export const updateCourseWithDetails = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      // Basic course data
      title,
      shortDescription,
      detailedDescription,
      imageUrl,
      priceOriginal,
      priceDiscounted,
      status,
      level,
      duration,
      categoryId,
      instructorId,
      
      // Additional course metadata
      slug,
      rating,
      reviews,
      students,
      enrollmentYear,
      
      // Nested data
      learningOutcomes = [],
      prerequisites = [],
      curriculum = [] // This will replace all existing modules and lessons
    } = req.body;

    // Validate required fields
    if (!title || !shortDescription || !detailedDescription || !priceOriginal || !priceDiscounted || !level || !duration || !categoryId || !instructorId) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, shortDescription, detailedDescription, priceOriginal, priceDiscounted, level, duration, categoryId, instructorId' 
      });
    }

    // Check if course exists
    const existingCourse = await prisma.course.findUnique({ where: { id } });
    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Use transaction to ensure all data is updated atomically
    const result = await prisma.$transaction(async (tx) => {
      // Update the main course
      const course = await tx.course.update({
        where: { id },
        data: {
          title,
          shortDescription,
          detailedDescription,
          imageUrl,
          priceOriginal: parseFloat(priceOriginal),
          priceDiscounted: parseFloat(priceDiscounted),
          status: status as any,
          level: level as any,
          duration,
          categoryId,
          instructorId,
        },
      });

      // Delete existing learning outcomes and create new ones
      await tx.learningOutcome.deleteMany({ where: { courseId: id } });
      if (learningOutcomes.length > 0) {
        await tx.learningOutcome.createMany({
          data: learningOutcomes.map((outcome: string) => ({
            courseId: id,
            text: outcome
          }))
        });
      }

      // Delete existing prerequisites and create new ones
      await tx.prerequisite.deleteMany({ where: { courseId: id } });
      if (prerequisites.length > 0) {
        await tx.prerequisite.createMany({
          data: prerequisites.map((prereq: string) => ({
            courseId: id,
            text: prereq
          }))
        });
      }

      // Delete existing modules and lessons, then create new ones from curriculum
      await tx.courseLesson.deleteMany({
        where: {
          module: {
            courseId: id
          }
        }
      });
      await tx.courseModule.deleteMany({ where: { courseId: id } });

      if (curriculum.length > 0) {
        for (let moduleIndex = 0; moduleIndex < curriculum.length; moduleIndex++) {
          const moduleData = curriculum[moduleIndex];
          
          const module = await tx.courseModule.create({
            data: {
              courseId: id,
              title: moduleData.title,
              duration: moduleData.duration,
              order: moduleIndex + 1
            }
          });

          // Create lessons for this module
          if (moduleData.lessons && moduleData.lessons.length > 0) {
            await tx.courseLesson.createMany({
              data: moduleData.lessons.map((lesson: any, lessonIndex: number) => ({
                moduleId: module.id,
                title: lesson.title,
                duration: lesson.duration || '30 min',
                order: lessonIndex + 1
              }))
            });
          }
        }
      }

      // Return the complete updated course with all related data
      return await tx.course.findUnique({
        where: { id },
        include: {
          category: true,
          instructor: true,
          modules: {
            include: { lessons: { orderBy: { order: 'asc' } } },
            orderBy: { order: 'asc' }
          },
          learningOutcomes: true,
          prerequisites: true
        }
      });
    });

    res.json(result);
  } catch (error) {
    console.error('Error updating course with details:', error);
    res.status(500).json({ 
      error: 'Failed to update course with details',
      details: (error as Error).message 
    });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    // Check if course exists
    const existingCourse = await prisma.course.findUnique({ where: { id } });
    if (!existingCourse) {
      return res.status(404).json({ error: 'Course not found' });
    }

    // Use transaction to delete course and all related data
    await prisma.$transaction(async (tx) => {
      // Delete lessons first (due to foreign key constraints)
      await tx.courseLesson.deleteMany({
        where: {
          module: {
            courseId: id
          }
        }
      });

      // Delete modules
      await tx.courseModule.deleteMany({ where: { courseId: id } });

      // Delete learning outcomes
      await tx.learningOutcome.deleteMany({ where: { courseId: id } });

      // Delete prerequisites
      await tx.prerequisite.deleteMany({ where: { courseId: id } });

      // Finally delete the course
      await tx.course.delete({ where: { id } });
    });

    res.json({ message: 'Course deleted' });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: (error as Error).message });
  }
}; 