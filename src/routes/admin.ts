import { Router } from 'express';
import { listAdmins, createAdmin, updateAdmin, deleteAdmin } from '../controllers/adminController';

const router = Router();

// List & search admin users
router.get('/', listAdmins);

// Create new admin user
router.post('/', createAdmin);

// Update admin user
router.put('/:id', updateAdmin);

// Delete admin user
router.delete('/:id', deleteAdmin);

export default router; 