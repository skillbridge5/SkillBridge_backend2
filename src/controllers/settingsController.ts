import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';

const settingsUpdateSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  contactEmail: z.string().email('Valid email is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: z.string().min(1, 'Address is required'),
});

// Get platform settings
export const getPlatformSettings = async (req: Request, res: Response) => {
  try {
    // Get the first (and should be only) settings record
    let settings = await prisma.platformSettings.findFirst();
    
    // If no settings exist, create default settings
    if (!settings) {
      settings = await prisma.platformSettings.create({
        data: {
          siteName: 'SkillBridge',
          contactEmail: 'contact@skillbridge.com',
          siteDescription: 'Bridging Gaps, Building Skills, Transforming Futures',
          contactPhone: '+251 2345 4365',
          address: '123 Education Street, Learning City',
        },
      });
    }
    
    res.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Update platform settings
export const updatePlatformSettings = async (req: Request, res: Response) => {
  try {
    const parsed = settingsUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parsed.error.issues,
      });
    }

    const { siteName, contactEmail, siteDescription, contactPhone, address } = parsed.data;

    // Get existing settings or create new ones
    let settings = await prisma.platformSettings.findFirst();
    
    if (settings) {
      // Update existing settings
      settings = await prisma.platformSettings.update({
        where: { id: settings.id },
        data: {
          siteName,
          contactEmail,
          siteDescription,
          contactPhone,
          address,
        },
      });
    } else {
      // Create new settings
      settings = await prisma.platformSettings.create({
        data: {
          siteName,
          contactEmail,
          siteDescription,
          contactPhone,
          address,
        },
      });
    }

    res.json({
      success: true,
      message: 'Platform settings updated successfully',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Reset platform settings to defaults
export const resetPlatformSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.platformSettings.findFirst();
    
    const defaultSettings = {
      siteName: 'SkillBridge',
      contactEmail: 'contact@skillbridge.com',
      siteDescription: 'Bridging Gaps, Building Skills, Transforming Futures',
      contactPhone: '+251 2345 4365',
      address: '123 Education Street, Learning City',
    };

    if (settings) {
      // Update existing settings to defaults
      settings = await prisma.platformSettings.update({
        where: { id: settings.id },
        data: defaultSettings,
      });
    } else {
      // Create new settings with defaults
      settings = await prisma.platformSettings.create({
        data: defaultSettings,
      });
    }

    res.json({
      success: true,
      message: 'Platform settings reset to defaults successfully',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
}; 