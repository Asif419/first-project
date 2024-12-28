import express from 'express';
import { adminControllers } from './admin.controller';
import { adminValidations } from './admin.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/', adminControllers.getAllAdmins);
router.get('/:id', adminControllers.getSingleAdminByID);
router.patch(
  '/:id',
  validateRequest(adminValidations.updateAdminValidationSchema),
  adminControllers.updateAdmin,
);
router.delete('/:id', adminControllers.deleteAdmin);

export const AdminsRoutes = router;
