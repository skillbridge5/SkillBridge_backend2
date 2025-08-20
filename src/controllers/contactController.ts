import { Request, Response } from 'express';
import prisma from '../config/prisma';
import { Parser } from 'json2csv';

// Public: Create a contact message
export const createContactMessage = async (req: Request, res: Response) => {
  try {
    const { name, email, phone, message } = req.body;
    if (!name || !email || !phone || !message) {
      return res.status(400).json({ error: 'All fields are required' });
    }
    const contact = await prisma.contactMessage.create({
      data: { name, email, phone, message }
    });
    res.status(201).json(contact);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Admin: List all contact messages (with optional status filter/search)
export const getAllContactMessages = async (req: Request, res: Response) => {
  try {
    const { status, search } = req.query;
    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (search) {
      where.OR = [
        { name: { contains: search as string, mode: 'insensitive' } },
        { email: { contains: search as string, mode: 'insensitive' } },
        { phone: { contains: search as string, mode: 'insensitive' } },
        { message: { contains: search as string, mode: 'insensitive' } }
      ];
    }
    const messages = await prisma.contactMessage.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Admin: View a single contact message
export const getContactMessageById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const message = await prisma.contactMessage.findUnique({ where: { id } });
    if (!message) return res.status(404).json({ error: 'Message not found' });
    res.json(message);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Admin: Delete a contact message
export const deleteContactMessage = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    await prisma.contactMessage.delete({ where: { id } });
    res.json({ message: 'Contact message deleted' });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Admin: Update contact message status
export const updateContactMessageStatus = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    // Validate status
    const validStatuses = ['new', 'read', 'replied'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'Invalid status. Must be one of: new, read, replied' 
      });
    }

    // Check if message exists
    const existingMessage = await prisma.contactMessage.findUnique({ 
      where: { id } 
    });
    
    if (!existingMessage) {
      return res.status(404).json({ error: 'Contact message not found' });
    }

    // Update the status
    const updatedMessage = await prisma.contactMessage.update({
      where: { id },
      data: { status }
    });

    res.json({
      message: 'Contact message status updated successfully',
      data: updatedMessage
    });
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
};

// Admin: Export contact messages to Excel
export const exportContactMessages = async (req: Request, res: Response) => {
  try {
    const messages = await prisma.contactMessage.findMany();
    const parser = new Parser();
    const csv = parser.parse(messages);
    res.header('Content-Type', 'text/csv');
    res.attachment('contact-messages.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}; 