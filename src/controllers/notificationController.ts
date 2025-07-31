import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';

// Get all notifications
export const getNotifications = async (req: Request, res: Response) => {
  try {
    const { page = 1, limit = 10, unreadOnly = false } = req.query;
    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const where: any = {};
    if (unreadOnly === 'true') {
      where.isRead = false;
    }

    const [notifications, total] = await Promise.all([
      prisma.notification.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limitNum,
      }),
      prisma.notification.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limitNum);

    res.json({
      success: true,
      data: {
        notifications,
        pagination: {
          currentPage: pageNum,
          totalPages,
          totalItems: total,
          itemsPerPage: limitNum,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Get unread notifications count
export const getUnreadCount = async (req: Request, res: Response) => {
  try {
    const count = await prisma.notification.count({
      where: { isRead: false },
    });

    res.json({
      success: true,
      data: { unreadCount: count },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Mark notification as read
export const markAsRead = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const notification = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: 'Notification marked as read',
      data: notification,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Mark all notifications as read
export const markAllAsRead = async (req: Request, res: Response) => {
  try {
    await prisma.notification.updateMany({
      where: { isRead: false },
      data: { isRead: true },
    });

    res.json({
      success: true,
      message: 'All notifications marked as read',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Delete notification
export const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    await prisma.notification.delete({
      where: { id },
    });

    res.json({
      success: true,
      message: 'Notification deleted successfully',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Create notification (internal function for other controllers to use)
export const createNotification = async (
  type: 'NEW_APPLICATION' | 'NEW_STUDENT' | 'NEW_COURSE' | 'NEW_INSTRUCTOR' | 'APPLICATION_APPROVED' | 'APPLICATION_REJECTED',
  title: string,
  message: string
) => {
  try {
    const notification = await prisma.notification.create({
      data: {
        type,
        title,
        message,
      },
    });
    return notification;
  } catch (error) {
    console.error('Error creating notification:', error);
    return null;
  }
}; 