import { Request, Response } from 'express';
import prisma from '../config/prisma';

// Get dashboard statistics
export const getDashboardStats = async (req: Request, res: Response) => {
  try {
    // Get current date and last month date
    const now = new Date();
    const lastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const thisMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // Calculate statistics
    const [
      totalStudents,
      lastMonthStudents,
      thisMonthStudents,
      totalCourses,
      lastMonthCourses,
      thisMonthCourses,
      totalApplications,
      lastMonthApplications,
      thisMonthApplications,
      pendingApplications,
      newStudentsThisMonth,
      totalInstructors,
      popularCourses,
      recentApplications,
    ] = await Promise.all([
      // Total students
      prisma.user.count({
        where: { role: 'STUDENT', status: 'ACTIVE' },
      }),
      // Students from last month
      prisma.user.count({
        where: {
          role: 'STUDENT',
          status: 'ACTIVE',
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      // Students from this month
      prisma.user.count({
        where: {
          role: 'STUDENT',
          status: 'ACTIVE',
          createdAt: {
            gte: thisMonth,
          },
        },
      }),
      // Total published courses
      prisma.course.count({
        where: { status: 'PUBLISHED' },
      }),
      // Courses from last month
      prisma.course.count({
        where: {
          status: 'PUBLISHED',
          createdAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      // Courses from this month
      prisma.course.count({
        where: {
          status: 'PUBLISHED',
          createdAt: {
            gte: thisMonth,
          },
        },
      }),
      // Total applications
      prisma.studentApplication.count(),
      // Applications from last month
      prisma.studentApplication.count({
        where: {
          submittedAt: {
            gte: lastMonth,
            lt: thisMonth,
          },
        },
      }),
      // Applications from this month
      prisma.studentApplication.count({
        where: {
          submittedAt: {
            gte: thisMonth,
          },
        },
      }),
      // Pending applications
      prisma.studentApplication.count({
        where: { status: 'PENDING' },
      }),
      // New students this month
      prisma.user.count({
        where: {
          role: 'STUDENT',
          status: 'ACTIVE',
          createdAt: {
            gte: thisMonth,
          },
        },
      }),
      // Total instructors
      prisma.user.count({
        where: { role: 'INSTRUCTOR', status: 'ACTIVE' },
      }),
      // Popular courses (top 3 by student count - using applications as proxy)
      prisma.course.findMany({
        where: { status: 'PUBLISHED' },
        include: {
          _count: {
            select: { StudentApplication: true },
          },
          category: true,
        },
        orderBy: {
          StudentApplication: {
            _count: 'desc',
          },
        },
        take: 3,
      }),
      // Recent applications
      prisma.studentApplication.findMany({
        include: {
          course: {
            select: { title: true },
          },
          student: {
            select: { name: true },
          },
        },
        orderBy: { submittedAt: 'desc' },
        take: 5,
      }),
    ]);

    // Calculate percentage changes
    const studentGrowth = lastMonthStudents > 0 
      ? Math.round(((thisMonthStudents - lastMonthStudents) / lastMonthStudents) * 100)
      : thisMonthStudents > 0 ? 100 : 0;

    const courseGrowth = lastMonthCourses > 0
      ? Math.round(((thisMonthCourses - lastMonthCourses) / lastMonthCourses) * 100)
      : thisMonthCourses > 0 ? 100 : 0;

    const applicationGrowth = lastMonthApplications > 0
      ? Math.round(((thisMonthApplications - lastMonthApplications) / lastMonthApplications) * 100)
      : thisMonthApplications > 0 ? 100 : 0;

    // Format popular courses data
    const formattedPopularCourses = popularCourses.map(course => ({
      id: course.id,
      title: course.title,
      category: course.category.name,
      students: course._count.StudentApplication, // Using applications as proxy for students
      rating: 4.5 + Math.random() * 0.5, // Mock rating for now
    }));

    // Format recent applications data
    const formattedRecentApplications = recentApplications.map(app => ({
      id: app.id,
      studentName: app.student?.name || app.fullName,
      courseTitle: app.course.title,
      status: app.status,
      submittedAt: app.submittedAt,
    }));

    const dashboardData = {
      // Key metrics with growth percentages
      totalStudents: {
        value: totalStudents,
        growth: studentGrowth,
        growthText: `${studentGrowth >= 0 ? '+' : ''}${studentGrowth}% from last month`,
      },
      activeCourses: {
        value: totalCourses,
        growth: courseGrowth,
        growthText: `${courseGrowth >= 0 ? '+' : ''}${courseGrowth}% from last month`,
      },
      applications: {
        value: totalApplications,
        growth: applicationGrowth,
        growthText: `${applicationGrowth >= 0 ? '+' : ''}${applicationGrowth}% from last month`,
      },
      revenue: {
        value: 0, // TODO: Implement revenue calculation when payment system is ready
        growth: 0,
        growthText: 'Revenue tracking coming soon',
      },

      // Current status metrics
      pendingApplications: {
        value: pendingApplications,
        label: 'Awaiting review',
      },
      newStudents: {
        value: newStudentsThisMonth,
        label: 'This month',
      },
      completionRate: {
        value: 0, // TODO: Implement completion rate calculation
        label: 'Course completion',
      },
      totalCourses: {
        value: totalCourses,
        label: 'All courses',
      },

      // Lists
      recentApplications: formattedRecentApplications,
      popularCourses: formattedPopularCourses,
    };

    res.json({
      success: true,
      data: dashboardData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Get dashboard chart data (for future use)
export const getDashboardCharts = async (req: Request, res: Response) => {
  try {
    // Get last 6 months of data
    const months = [];
    const now = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const month = new Date(now.getFullYear(), now.getMonth() - i, 1);
      months.push(month);
    }

    const chartData = await Promise.all(
      months.map(async (month) => {
        const nextMonth = new Date(month.getFullYear(), month.getMonth() + 1, 1);
        
        const [students, courses, applications] = await Promise.all([
          prisma.user.count({
            where: {
              role: 'STUDENT',
              status: 'ACTIVE',
              createdAt: {
                gte: month,
                lt: nextMonth,
              },
            },
          }),
          prisma.course.count({
            where: {
              status: 'PUBLISHED',
              createdAt: {
                gte: month,
                lt: nextMonth,
              },
            },
          }),
          prisma.studentApplication.count({
            where: {
              submittedAt: {
                gte: month,
                lt: nextMonth,
              },
            },
          }),
        ]);

        return {
          month: month.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          students,
          courses,
          applications,
        };
      })
    );

    res.json({
      success: true,
      data: chartData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
}; 