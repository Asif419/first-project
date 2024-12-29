import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { SemesterRegistrationController } from './semesterRegistration.controller';
import { SemesterRegistrationVAlidations } from './semesterRegistration.validation';

const router = express.Router();

router.post(
  '/create-semester-registration',
  validateRequest(
    SemesterRegistrationVAlidations.createSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.createSemesterRegistration,
);
router.get('/', SemesterRegistrationController.getAllSemesterRegistrations);
router.get(
  '/:id',
  SemesterRegistrationController.getSingleSemesterRegistration,
);
router.patch(
  '/:id',
  validateRequest(
    SemesterRegistrationVAlidations.updateSemesterRegistrationValidationSchema,
  ),
  SemesterRegistrationController.updateSemesterRegistration,
);
router.delete(
  '/:id',
  SemesterRegistrationController.createSemesterRegistration,
);

export const SemesterRegistrationRoutes = router;
