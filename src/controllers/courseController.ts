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

    // Enhanced validation
    console.log('📝 Course creation request:', {
      title,
      shortDescription: shortDescription?.substring(0, 50) + '...',
      level,
      duration,
      categoryId,
      instructorId,
      learningOutcomesCount: learningOutcomes?.length || 0,
      prerequisitesCount: prerequisites?.length || 0,
      curriculumCount: curriculum?.length || 0
    });

    // Validate required fields
    if (!title || !shortDescription || !detailedDescription || !priceOriginal || !priceDiscounted || !level || !duration || !categoryId || !instructorId) {
      return res.status(400).json({ 
        error: 'Missing required fields: title, shortDescription, detailedDescription, priceOriginal, priceDiscounted, level, duration, categoryId, instructorId' 
      });
    }

    // Validate level enum
    const validLevels = ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'ALL_LEVELS'];
    if (!validLevels.includes(level)) {
      return res.status(400).json({
        error: `Invalid level. Must be one of: ${validLevels.join(', ')}`
      });
    }

    // Validate status enum
    const validStatuses = ['DRAFT', 'PUBLISHED'];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({
        error: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    // Validate curriculum structure
    if (curriculum && Array.isArray(curriculum)) {
      for (let i = 0; i < curriculum.length; i++) {
        const module = curriculum[i];
        if (!module.title || !module.duration) {
          return res.status(400).json({
            error: `Module ${i + 1} is missing required fields: title and duration`
          });
        }
        
        if (module.lessons && Array.isArray(module.lessons)) {
          for (let j = 0; j < module.lessons.length; j++) {
            const lesson = module.lessons[j];
            if (!lesson.title) {
              return res.status(400).json({
                error: `Lesson ${j + 1} in module ${i + 1} is missing title`
              });
            }
          }
        }
      }
    }

    // Use transaction to ensure all data is created atomically
    const createdCourse = await prisma.$transaction(async (tx) => {
      console.log('🔄 Starting database transaction...');
      
      // Create the main course
      const course = await tx.course.create({
        data: {
          title,
          shortDescription,
          detailedDescription,
          imageUrl,
          priceOriginal: parseFloat(priceOriginal),
          priceDiscounted: parseFloat(priceDiscounted),
          status: status as 'DRAFT' | 'PUBLISHED',
          level: level as 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS',
          duration,
          categoryId,
          instructorId,
        },
      });
      
      console.log('✅ Course created with ID:', course.id);

      // Create learning outcomes
      if (learningOutcomes && learningOutcomes.length > 0) {
        console.log('📚 Creating learning outcomes:', learningOutcomes.length);
        const outcomesData = learningOutcomes.map((outcome: unknown) => ({
          courseId: course.id,
          text: String(outcome).trim()
        })).filter((outcome: any) => outcome.text.length > 0);
        
        if (outcomesData.length > 0) {
          await tx.learningOutcome.createMany({
            data: outcomesData
          });
          console.log('✅ Learning outcomes created:', outcomesData.length);
        }
      }

      // Create prerequisites
      if (prerequisites && prerequisites.length > 0) {
        console.log('📋 Creating prerequisites:', prerequisites.length);
        const prereqData = prerequisites.map((prereq: unknown) => ({
          courseId: course.id,
          text: String(prereq).trim()
        })).filter((prereq: any) => prereq.text.length > 0);
        
        if (prereqData.length > 0) {
          await tx.prerequisite.createMany({
            data: prereqData
          });
          console.log('✅ Prerequisites created:', prereqData.length);
        }
      }

      // Create modules and lessons from curriculum
      if (curriculum && curriculum.length > 0) {
        console.log('📖 Creating curriculum with modules:', curriculum.length);
        
        for (let moduleIndex = 0; moduleIndex < curriculum.length; moduleIndex++) {
          const moduleData = curriculum[moduleIndex];
          console.log(`📚 Creating module ${moduleIndex + 1}:`, moduleData.title);
          
          const module = await tx.courseModule.create({
            data: {
              courseId: course.id,
              title: moduleData.title.trim(),
              duration: moduleData.duration.trim(),
              order: moduleIndex + 1
            }
          });
          
          console.log(`✅ Module created with ID:`, module.id);

          // Create lessons for this module
          if (moduleData.lessons && Array.isArray(moduleData.lessons) && moduleData.lessons.length > 0) {
            console.log(`📝 Creating ${moduleData.lessons.length} lessons for module:`, moduleData.title);
            
            const lessonsData = moduleData.lessons.map((lesson: unknown, lessonIndex: number) => ({
              moduleId: module.id,
              title: String((lesson as any).title).trim(),
              duration: (lesson as any).duration ? String((lesson as any).duration).trim() : '30 min',
              order: lessonIndex + 1
            })).filter((lesson: any) => lesson.title.length > 0);
            
            if (lessonsData.length > 0) {
              await tx.courseLesson.createMany({
                data: lessonsData
              });
              console.log(`✅ ${lessonsData.length} lessons created for module:`, moduleData.title);
            }
          }
        }
      }

      // Only return the new course ID
      return course.id;
    });

    // Fetch the complete course with all related data OUTSIDE the transaction
    console.log('🔄 Fetching complete course data...');
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

    if (!result) {
      console.error('❌ Failed to fetch created course');
      return res.status(500).json({ error: 'Course created but failed to fetch complete data' });
    }

    console.log('🎉 Course created successfully with all details!');
    console.log('📊 Summary:', {
      courseId: result.id,
      title: result.title,
      modulesCount: result.modules.length,
      totalLessons: result.modules.reduce((acc: number, mod: any) => acc + mod.lessons.length, 0),
      learningOutcomesCount: result.learningOutcomes.length,
      prerequisitesCount: result.prerequisites.length
    });

    res.status(201).json(result);
  } catch (error) {
    console.error('❌ Error creating course with details:', error);
    
    // Provide more specific error messages
    if (error instanceof Error) {
      if (error.message.includes('Foreign key constraint failed')) {
        return res.status(400).json({ 
          error: 'Invalid category or instructor ID. Please check that both exist in the system.',
          details: error.message 
        });
      }
      if (error.message.includes('Unique constraint failed')) {
        return res.status(400).json({ 
          error: 'A course with this title already exists. Please choose a different title.',
          details: error.message 
        });
      }
    }
    
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
          data: learningOutcomes.map((outcome: any) => ({
            courseId: id,
            text: typeof outcome === 'string' ? outcome : outcome.text
          }))
        });
      }

      // Delete existing prerequisites and create new ones
      await tx.prerequisite.deleteMany({ where: { courseId: id } });
      if (prerequisites.length > 0) {
        await tx.prerequisite.createMany({
          data: prerequisites.map((prereq: any) => ({
            courseId: id,
            text: typeof prereq === 'string' ? prereq : prereq.text
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

    
      return true; // just return a flag or id
    });


    const updatedCourse = await prisma.course.findUnique({
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
    res.json(updatedCourse);
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


export const getLandingPageCourses = async (req: Request, res: Response) => {
  try {
    const { category, sort } = req.query;
    const where: any = {}; 
    if (category) {
      where.OR = [
        { categoryId: category },
        { category: { name: { equals: category, mode: 'insensitive' } } }
      ];
    }
    let orderBy: any[] = [];
    if (sort === 'popular') {
      orderBy = [
        { createdAt: 'desc' } // fallback, since Course has no students/rating
      ];
    } else {
      orderBy = [
        { createdAt: 'desc' }
      ];
    }
    const courses = await prisma.course.findMany({
      where,
      orderBy,
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

export const getLandingCoursesPublic = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      where: {}, // Get ALL courses, not just published ones
      include: { 
        category: true, 
        instructor: true, 
        modules: { 
          include: { lessons: true },
          orderBy: { order: 'asc' }
        }, 
        learningOutcomes: true, 
        prerequisites: true 
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}; 

// Test endpoint to validate course data structure
export const testCourseData = async (req: Request, res: Response) => {
  try {
    const { curriculum, learningOutcomes, prerequisites } = req.body;
    
    console.log('🧪 Testing course data structure...');
    console.log('📚 Curriculum:', JSON.stringify(curriculum, null, 2));
    console.log('📖 Learning Outcomes:', JSON.stringify(learningOutcomes, null, 2));
    console.log('📋 Prerequisites:', JSON.stringify(prerequisites, null, 2));
    
    // Validate curriculum structure
    if (curriculum && Array.isArray(curriculum)) {
      console.log('✅ Curriculum is an array with', curriculum.length, 'modules');
      
      for (let i = 0; i < curriculum.length; i++) {
        const module = curriculum[i];
        console.log(`📚 Module ${i + 1}:`, {
          title: module.title,
          duration: module.duration,
          lessonsCount: module.lessons?.length || 0
        });
        
        if (module.lessons && Array.isArray(module.lessons)) {
          for (let j = 0; j < module.lessons.length; j++) {
            const lesson = module.lessons[j];
            console.log(`  📝 Lesson ${j + 1}:`, {
              title: lesson.title,
              duration: lesson.duration
            });
          }
        }
      }
    } else {
      console.log('❌ Curriculum is not a valid array');
    }
    
    // Validate learning outcomes
    if (learningOutcomes && Array.isArray(learningOutcomes)) {
      console.log('✅ Learning outcomes is an array with', learningOutcomes.length, 'items');
      learningOutcomes.forEach((outcome: any, index: number) => {
        console.log(`  📖 Outcome ${index + 1}:`, outcome);
      });
    } else {
      console.log('❌ Learning outcomes is not a valid array');
    }
    
    // Validate prerequisites
    if (prerequisites && Array.isArray(prerequisites)) {
      console.log('✅ Prerequisites is an array with', prerequisites.length, 'items');
      prerequisites.forEach((prereq: any, index: number) => {
        console.log(`  📋 Prerequisite ${index + 1}:`, prereq);
      });
    } else {
      console.log('❌ Prerequisites is not a valid array');
    }
    
    res.json({
      message: 'Course data structure test completed',
      summary: {
        curriculumModules: curriculum?.length || 0,
        totalLessons: curriculum?.reduce((acc: number, mod: any) => acc + (mod.lessons?.length || 0), 0) || 0,
        learningOutcomesCount: learningOutcomes?.length || 0,
        prerequisitesCount: prerequisites?.length || 0
      }
    });
    
  } catch (error) {
    console.error('❌ Error testing course data:', error);
    res.status(500).json({ 
      error: 'Failed to test course data structure',
      details: (error as Error).message 
    });
  }
}; 