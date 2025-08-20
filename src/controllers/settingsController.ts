import { Request, Response } from 'express';
import { z } from 'zod';
import prisma from '../config/prisma';

// General Settings Schema
const generalSettingsUpdateSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  contactEmail: z.string().email('Valid email is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  contactPhone: z.string().min(1, 'Contact phone is required'),
  address: z.string().min(1, 'Address is required'),
});

// Email Settings Schema
const emailSettingsUpdateSchema = z.object({
  smtpHost: z.string().min(1, 'SMTP host is required'),
  smtpPort: z.number().int().min(1, 'SMTP port is required'),
  smtpUsername: z.string().email('Valid email is required'),
  smtpPassword: z.string().min(1, 'SMTP password is required'),
});

// Security Settings Schema
const securitySettingsUpdateSchema = z.object({
  allowUserRegistration: z.boolean(),
  requireEmailVerification: z.boolean(),
  enableNotifications: z.boolean(),
  maintenanceMode: z.boolean(),
});

// Social Settings Schema
const socialSettingsUpdateSchema = z.object({
  facebookUrl: z.string().url().optional().or(z.literal('')),
  twitterUrl: z.string().url().optional().or(z.literal('')),
  linkedinUrl: z.string().url().optional().or(z.literal('')),
  instagramUrl: z.string().url().optional().or(z.literal('')),
});

// Advanced Settings Schema
const advancedSettingsUpdateSchema = z.object({
  debugMode: z.boolean(),
  logLevel: z.enum(['error', 'warn', 'info', 'debug']),
  cacheEnabled: z.boolean(),
  maxUploadSize: z.number().int().min(1),
  sessionTimeout: z.number().int().min(60),
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
    const parsed = generalSettingsUpdateSchema.safeParse(req.body);
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

// Email Settings Functions
export const getEmailSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.emailSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.emailSettings.create({
        data: {
          smtpHost: 'smtp.gmail.com',
          smtpPort: 587,
          smtpUsername: 'admin@edutech.com',
          smtpPassword: '',
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

export const updateEmailSettings = async (req: Request, res: Response) => {
  try {
    const parsed = emailSettingsUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parsed.error.issues,
      });
    }

    const { smtpHost, smtpPort, smtpUsername, smtpPassword } = parsed.data;

    let settings = await prisma.emailSettings.findFirst();
    
    if (settings) {
      settings = await prisma.emailSettings.update({
        where: { id: settings.id },
        data: {
          smtpHost,
          smtpPort,
          smtpUsername,
          smtpPassword,
        },
      });
    } else {
      settings = await prisma.emailSettings.create({
        data: {
          smtpHost,
          smtpPort,
          smtpUsername,
          smtpPassword,
        },
      });
    }

    res.json({
      success: true,
      message: 'Email settings updated successfully',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Security Settings Functions
export const getSecuritySettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.securitySettings.findFirst();
    
    if (!settings) {
      settings = await prisma.securitySettings.create({
        data: {
          allowUserRegistration: true,
          requireEmailVerification: true,
          enableNotifications: true,
          maintenanceMode: false,
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

export const updateSecuritySettings = async (req: Request, res: Response) => {
  try {
    const parsed = securitySettingsUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parsed.error.issues,
      });
    }

    const { allowUserRegistration, requireEmailVerification, enableNotifications, maintenanceMode } = parsed.data;

    let settings = await prisma.securitySettings.findFirst();
    
    if (settings) {
      settings = await prisma.securitySettings.update({
        where: { id: settings.id },
        data: {
          allowUserRegistration,
          requireEmailVerification,
          enableNotifications,
          maintenanceMode,
        },
      });
    } else {
      settings = await prisma.securitySettings.create({
        data: {
          allowUserRegistration,
          requireEmailVerification,
          enableNotifications,
          maintenanceMode,
        },
      });
    }

    res.json({
      success: true,
      message: 'Security settings updated successfully',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Social Settings Functions
export const getSocialSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.socialSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.socialSettings.create({
        data: {
          facebookUrl: 'https://facebook.com/yourpage',
          twitterUrl: 'https://twitter.com/yourhandle',
          linkedinUrl: 'https://linkedin.com/company/yourcompany',
          instagramUrl: 'https://instagram.com/yourhandle',
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

export const updateSocialSettings = async (req: Request, res: Response) => {
  try {
    const parsed = socialSettingsUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parsed.error.issues,
      });
    }

    const { facebookUrl, twitterUrl, linkedinUrl, instagramUrl } = parsed.data;

    let settings = await prisma.socialSettings.findFirst();
    
    if (settings) {
      settings = await prisma.socialSettings.update({
        where: { id: settings.id },
        data: {
          facebookUrl: facebookUrl || null,
          twitterUrl: twitterUrl || null,
          linkedinUrl: linkedinUrl || null,
          instagramUrl: instagramUrl || null,
        },
      });
    } else {
      settings = await prisma.socialSettings.create({
        data: {
          facebookUrl: facebookUrl || null,
          twitterUrl: twitterUrl || null,
          linkedinUrl: linkedinUrl || null,
          instagramUrl: instagramUrl || null,
        },
      });
    }

    res.json({
      success: true,
      message: 'Social settings updated successfully',
      data: settings,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: (error as Error).message,
    });
  }
};

// Advanced Settings Functions
export const getAdvancedSettings = async (req: Request, res: Response) => {
  try {
    let settings = await prisma.advancedSettings.findFirst();
    
    if (!settings) {
      settings = await prisma.advancedSettings.create({
        data: {
          debugMode: false,
          logLevel: 'info',
          cacheEnabled: true,
          maxUploadSize: 5242880, // 5MB
          sessionTimeout: 3600, // 1 hour
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

export const updateAdvancedSettings = async (req: Request, res: Response) => {
  try {
    const parsed = advancedSettingsUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        details: parsed.error.issues,
      });
    }

    const { debugMode, logLevel, cacheEnabled, maxUploadSize, sessionTimeout } = parsed.data;

    let settings = await prisma.advancedSettings.findFirst();
    
    if (settings) {
      settings = await prisma.advancedSettings.update({
        where: { id: settings.id },
        data: {
          debugMode,
          logLevel,
          cacheEnabled,
          maxUploadSize,
          sessionTimeout,
        },
      });
    } else {
      settings = await prisma.advancedSettings.create({
        data: {
          debugMode,
          logLevel,
          cacheEnabled,
          maxUploadSize,
          sessionTimeout,
        },
      });
    }

    res.json({
      success: true,
      message: 'Advanced settings updated successfully',
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