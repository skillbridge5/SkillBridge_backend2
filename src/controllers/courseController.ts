import { Request, Response } from 'express';
import prisma from '../config/prisma';

// --- Course ---
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({ include: { category: true, instructor: true, modules: true, learningOutcomes: true, prerequisites: true } });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const getCourseById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const course = await prisma.course.findUnique({ where: { id }, include: { category: true, instructor: true, modules: { include: { lessons: true } }, learningOutcomes: true, prerequisites: true } });
    if (!course) return res.status(404).json({ error: 'Course not found' });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, shortDescription, detailedDescription, imageUrl, priceOriginal, priceDiscounted, status, level, duration, categoryId, instructorId } = req.body;
    const course = await prisma.course.create({
      data: { title, shortDescription, detailedDescription, imageUrl, priceOriginal, priceDiscounted, status, level, duration, categoryId, instructorId },
    });
    res.status(201).json(course);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, shortDescription, detailedDescription, imageUrl, priceOriginal, priceDiscounted, status, level, duration, categoryId, instructorId } = req.body;
    const course = await prisma.course.update({
      where: { id },
      data: { title, shortDescription, detailedDescription, imageUrl, priceOriginal, priceDiscounted, status, level, duration, categoryId, instructorId },
    });
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.course.delete({ where: { id } });
    res.json({ message: 'Course deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// --- CourseModule ---
export const getModulesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const modules = await prisma.courseModule.findMany({ where: { courseId }, include: { lessons: true } });
    res.json(modules);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createModule = async (req: Request, res: Response) => {
  try {
    const { courseId, title, duration, order } = req.body;
    const module = await prisma.courseModule.create({ data: { courseId, title, duration, order } });
    res.status(201).json(module);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, duration, order } = req.body;
    const module = await prisma.courseModule.update({ where: { id }, data: { title, duration, order } });
    res.json(module);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteModule = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.courseModule.delete({ where: { id } });
    res.json({ message: 'Module deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// --- CourseLesson ---
export const getLessonsByModule = async (req: Request, res: Response) => {
  try {
    const { moduleId } = req.params;
    const lessons = await prisma.courseLesson.findMany({ where: { moduleId } });
    res.json(lessons);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createLesson = async (req: Request, res: Response) => {
  try {
    const { moduleId, title, duration, order } = req.body;
    const lesson = await prisma.courseLesson.create({ data: { moduleId, title, duration, order } });
    res.status(201).json(lesson);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title, duration, order } = req.body;
    const lesson = await prisma.courseLesson.update({ where: { id }, data: { title, duration, order } });
    res.json(lesson);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteLesson = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.courseLesson.delete({ where: { id } });
    res.json({ message: 'Lesson deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// --- LearningOutcome ---
export const getLearningOutcomesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const outcomes = await prisma.learningOutcome.findMany({ where: { courseId } });
    res.json(outcomes);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createLearningOutcome = async (req: Request, res: Response) => {
  try {
    const { courseId, text } = req.body;
    const outcome = await prisma.learningOutcome.create({ data: { courseId, text } });
    res.status(201).json(outcome);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updateLearningOutcome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const outcome = await prisma.learningOutcome.update({ where: { id }, data: { text } });
    res.json(outcome);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deleteLearningOutcome = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.learningOutcome.delete({ where: { id } });
    res.json({ message: 'Learning outcome deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// --- Prerequisite ---
export const getPrerequisitesByCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const prerequisites = await prisma.prerequisite.findMany({ where: { courseId } });
    res.json(prerequisites);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const createPrerequisite = async (req: Request, res: Response) => {
  try {
    const { courseId, text } = req.body;
    const prerequisite = await prisma.prerequisite.create({ data: { courseId, text } });
    res.status(201).json(prerequisite);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const updatePrerequisite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { text } = req.body;
    const prerequisite = await prisma.prerequisite.update({ where: { id }, data: { text } });
    res.json(prerequisite);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

export const deletePrerequisite = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.prerequisite.delete({ where: { id } });
    res.json({ message: 'Prerequisite deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}; 