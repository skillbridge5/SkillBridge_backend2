import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';

const storage = new CloudinaryStorage({
  cloudinary,
  params: (req, file) => ({
    folder: 'receipts',
    allowed_formats: ['jpg', 'png', 'pdf'],
    public_id: `receipt_${Date.now()}`
  })
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

export const uploadReceipt = upload.single('receipt');
