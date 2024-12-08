import express from 'express';
import { studentControllers } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';

const router = express.Router();

// router.post('/create-student', studentControllers.createStudent);
router.get('/', studentControllers.getAllStudents);
router.get('/:studentId', studentControllers.getSingleStudentById);
router.patch(
  '/:studentId',
  validateRequest(studentValidations.updateStudentValidationSchema),
  studentControllers.updateStudent,
);
router.delete('/:studentId', studentControllers.deleteStudent);

export const StudentRoutes = router;
