import express from 'express';
import { adminControllers } from './admin.controller';
import { adminValidations } from './admin.validation';
import validateRequest from '../../middlewares/validateRequest';

const router = express.Router();

router.get('/', adminControllers.getAllAdmins);
router.get('/:adminID', adminControllers.getSingleAdminByID);
router.patch(
  '/:adminID',
  validateRequest(adminValidations.updateAdminValidationSchema),
  adminControllers.updateAdmin,
);
router.delete('/:adminID', adminControllers.deleteAdmin);

export const AdminsRoutes = router;
