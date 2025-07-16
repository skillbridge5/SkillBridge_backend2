import multer from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import { Request } from 'express';
import { mkdirSync, existsSync } from 'fs';

// Ensure upload directory exists
const uploadDir = path.join(__dirname, '../../uploads/receipts');
if (!existsSync(uploadDir)) {
  mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: uploadDir,
  filename: (req: Request, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `receipt_${uuidv4()}${ext}`);
  }
});

const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png'];
  allowedTypes.includes(file.mimetype) ? cb(null, true) : cb(new Error('Invalid file type'));
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadReceipt = upload.single('receipt');
export const getReceiptPath = (filename: string) => path.join(uploadDir, filename);