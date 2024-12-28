import express from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';

const router = express.Router();

router.get('/', facultyControllers.getAllFaculties);
router.get('/:id', facultyControllers.getSingleFacultyByID);
router.patch(
  '/:id',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  facultyControllers.updateFaculty,
);
router.delete('/:id', facultyControllers.deleteFaculty);

export const FacultiesRoutes = router;
