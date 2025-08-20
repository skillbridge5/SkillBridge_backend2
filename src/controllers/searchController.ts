import { Request, Response } from 'express';
import prisma from '../config/prisma';

export const searchAll = async (req: Request, res: Response) => {
  try {
    const { query = '', type = 'all', limit = '10' } = req.query;
    const searchQuery = query as string;
    const searchType = type as string;
    const limitNum = parseInt(limit as string, 10);

    if (!searchQuery.trim()) {
      return res.status(400).json({ 
        error: 'Search query is required',
        message: 'Please provide a search term'
      });
    }

    const results: any = {
      applications: [],
      students: [],
      courses: [],
      totalResults: 0
    };

    // Search applications
    if (searchType === 'all' || searchType === 'applications') {
      const applications = await prisma.studentApplication.findMany({
        where: {
          OR: [
            { fullName: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } },
            { phone: { contains: searchQuery, mode: 'insensitive' } },
            { paymentReference: { contains: searchQuery, mode: 'insensitive' } },
            { university: { contains: searchQuery, mode: 'insensitive' } },
            { telegramHandle: { contains: searchQuery, mode: 'insensitive' } },
            { address: { contains: searchQuery, mode: 'insensitive' } },
            { course: { title: { contains: searchQuery, mode: 'insensitive' } } }
          ]
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
              category: {
                select: {
                  name: true
                }
              }
            }
          },
          student: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        take: limitNum,
        orderBy: {
          submittedAt: 'desc'
        }
      });

      results.applications = applications;
    }

    // Search students (users with STUDENT role)
    if (searchType === 'all' || searchType === 'students') {
      const students = await prisma.user.findMany({
        where: {
          role: 'STUDENT',
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } }
          ]
        },
        include: {
          studentProfile: true,
          StudentApplication: {
            select: {
              id: true,
              status: true,
              submittedAt: true,
              course: {
                select: {
                  title: true
                }
              }
            },
            orderBy: {
              submittedAt: 'desc'
            },
            take: 5
          }
        },
        take: limitNum,
        orderBy: {
          createdAt: 'desc'
        }
      });

      results.students = students;
    }

    // Search courses
    if (searchType === 'all' || searchType === 'courses') {
      const courses = await prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { shortDescription: { contains: searchQuery, mode: 'insensitive' } },
            { detailedDescription: { contains: searchQuery, mode: 'insensitive' } },
            { category: { name: { contains: searchQuery, mode: 'insensitive' } } },
            { instructor: { name: { contains: searchQuery, mode: 'insensitive' } } },
            { instructor: { email: { contains: searchQuery, mode: 'insensitive' } } }
          ]
        },
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              StudentApplication: true
            }
          }
        },
        take: limitNum,
        orderBy: {
          createdAt: 'desc'
        }
      });

      results.courses = courses;
    }

    // Calculate total results
    results.totalResults = 
      results.applications.length + 
      results.students.length + 
      results.courses.length;

    res.json({
      success: true,
      query: searchQuery,
      type: searchType,
      results,
      summary: {
        applications: results.applications.length,
        students: results.students.length,
        courses: results.courses.length,
        total: results.totalResults
      }
    });

  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ 
      error: 'Search failed',
      message: (error as Error).message 
    });
  }
};

export const searchApplications = async (req: Request, res: Response) => {
  try {
    const { query = '', status, limit = '20', page = '1' } = req.query;
    const searchQuery = query as string;
    const statusFilter = status as string;
    const limitNum = parseInt(limit as string, 10);
    const pageNum = parseInt(page as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};

    if (searchQuery.trim()) {
      whereClause.OR = [
        { fullName: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } },
        { phone: { contains: searchQuery, mode: 'insensitive' } },
        { paymentReference: { contains: searchQuery, mode: 'insensitive' } },
        { university: { contains: searchQuery, mode: 'insensitive' } },
        { telegramHandle: { contains: searchQuery, mode: 'insensitive' } },
        { address: { contains: searchQuery, mode: 'insensitive' } },
        { course: { title: { contains: searchQuery, mode: 'insensitive' } } }
      ];
    }

    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    const [applications, total] = await Promise.all([
      prisma.studentApplication.findMany({
        where: whereClause,
        include: {
          course: {
            select: {
              id: true,
              title: true,
              category: {
                select: {
                  name: true
                }
              }
            }
          },
          student: {
            select: {
              id: true,
              name: true,
              email: true
            }
          }
        },
        skip,
        take: limitNum,
        orderBy: {
          submittedAt: 'desc'
        }
      }),
      prisma.studentApplication.count({
        where: whereClause
      })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      applications,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Application search error:', error);
    res.status(500).json({ 
      error: 'Application search failed',
      message: (error as Error).message 
    });
  }
};

export const searchStudents = async (req: Request, res: Response) => {
  try {
    const { query = '', limit = '20', page = '1' } = req.query;
    const searchQuery = query as string;
    const limitNum = parseInt(limit as string, 10);
    const pageNum = parseInt(page as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {
      role: 'STUDENT'
    };

    if (searchQuery.trim()) {
      whereClause.OR = [
        { name: { contains: searchQuery, mode: 'insensitive' } },
        { email: { contains: searchQuery, mode: 'insensitive' } }
      ];
    }

    const [students, total] = await Promise.all([
      prisma.user.findMany({
        where: whereClause,
        include: {
          studentProfile: true,
          StudentApplication: {
            select: {
              id: true,
              status: true,
              submittedAt: true,
              course: {
                select: {
                  title: true
                }
              }
            },
            orderBy: {
              submittedAt: 'desc'
            },
            take: 5
          }
        },
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.user.count({
        where: whereClause
      })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      students,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Student search error:', error);
    res.status(500).json({ 
      error: 'Student search failed',
      message: (error as Error).message 
    });
  }
};

export const searchCourses = async (req: Request, res: Response) => {
  try {
    const { query = '', status, category, limit = '20', page = '1' } = req.query;
    const searchQuery = query as string;
    const statusFilter = status as string;
    const categoryFilter = category as string;
    const limitNum = parseInt(limit as string, 10);
    const pageNum = parseInt(page as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const whereClause: any = {};

    if (searchQuery.trim()) {
      whereClause.OR = [
        { title: { contains: searchQuery, mode: 'insensitive' } },
        { shortDescription: { contains: searchQuery, mode: 'insensitive' } },
        { detailedDescription: { contains: searchQuery, mode: 'insensitive' } },
        { category: { name: { contains: searchQuery, mode: 'insensitive' } } },
        { instructor: { name: { contains: searchQuery, mode: 'insensitive' } } },
        { instructor: { email: { contains: searchQuery, mode: 'insensitive' } } }
      ];
    }

    if (statusFilter) {
      whereClause.status = statusFilter;
    }

    if (categoryFilter) {
      whereClause.categoryId = categoryFilter;
    }

    const [courses, total] = await Promise.all([
      prisma.course.findMany({
        where: whereClause,
        include: {
          category: {
            select: {
              id: true,
              name: true
            }
          },
          instructor: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              StudentApplication: true
            }
          }
        },
        skip,
        take: limitNum,
        orderBy: {
          createdAt: 'desc'
        }
      }),
      prisma.course.count({
        where: whereClause
      })
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      courses,
      pagination: {
        currentPage: pageNum,
        totalPages,
        totalItems: total,
        itemsPerPage: limitNum,
        hasNextPage: pageNum < totalPages,
        hasPreviousPage: pageNum > 1
      }
    });

  } catch (error) {
    console.error('Course search error:', error);
    res.status(500).json({ 
      error: 'Course search failed',
      message: (error as Error).message 
    });
  }
}; 

export const quickSearch = async (req: Request, res: Response) => {
  try {
    const { query = '', limit = '5' } = req.query;
    const searchQuery = query as string;
    const limitNum = parseInt(limit as string, 10);

    if (!searchQuery.trim()) {
      return res.status(400).json({ 
        error: 'Search query is required',
        message: 'Please provide a search term'
      });
    }

    // Quick search across all entities with limited results
    const [applications, students, courses] = await Promise.all([
      // Search applications
      prisma.studentApplication.findMany({
        where: {
          OR: [
            { fullName: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } },
            { phone: { contains: searchQuery, mode: 'insensitive' } },
            { paymentReference: { contains: searchQuery, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          fullName: true,
          email: true,
          status: true,
          submittedAt: true,
          course: {
            select: {
              title: true
            }
          }
        },
        take: limitNum,
        orderBy: {
          submittedAt: 'desc'
        }
      }),

      // Search students
      prisma.user.findMany({
        where: {
          role: 'STUDENT',
          OR: [
            { name: { contains: searchQuery, mode: 'insensitive' } },
            { email: { contains: searchQuery, mode: 'insensitive' } }
          ]
        },
        select: {
          id: true,
          name: true,
          email: true,
          createdAt: true,
          _count: {
            select: {
              StudentApplication: true
            }
          }
        },
        take: limitNum,
        orderBy: {
          createdAt: 'desc'
        }
      }),

      // Search courses
      prisma.course.findMany({
        where: {
          OR: [
            { title: { contains: searchQuery, mode: 'insensitive' } },
            { shortDescription: { contains: searchQuery, mode: 'insensitive' } },
            { category: { name: { contains: searchQuery, mode: 'insensitive' } } }
          ]
        },
        select: {
          id: true,
          title: true,
          shortDescription: true,
          status: true,
          category: {
            select: {
              name: true
            }
          },
          instructor: {
            select: {
              name: true
            }
          },
          _count: {
            select: {
              StudentApplication: true
            }
          }
        },
        take: limitNum,
        orderBy: {
          createdAt: 'desc'
        }
      })
    ]);

    const totalResults = applications.length + students.length + courses.length;

    res.json({
      success: true,
      query: searchQuery,
      results: {
        applications,
        students,
        courses
      },
      summary: {
        applications: applications.length,
        students: students.length,
        courses: courses.length,
        total: totalResults
      },
      hasMore: totalResults >= limitNum
    });

  } catch (error) {
    console.error('Quick search error:', error);
    res.status(500).json({ 
      error: 'Quick search failed',
      message: (error as Error).message 
    });
  }
}; 