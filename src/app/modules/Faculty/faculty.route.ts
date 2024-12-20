import express from 'express';
import { facultyControllers } from './faculty.controller';
import validateRequest from '../../middlewares/validateRequest';
import { facultyValidations } from './faculty.validation';

const router = express.Router();

router.get('/', facultyControllers.getAllFaculties);
router.get('/:facultyID', facultyControllers.getSingleFacultyByID);
router.patch(
  '/:facultyID',
  validateRequest(facultyValidations.updateFacultyValidationSchema),
  facultyControllers.updateFaculty,
);
router.delete('/:facultyID', facultyControllers.deleteFaculty);

export const FacultiesRoutes = router;
