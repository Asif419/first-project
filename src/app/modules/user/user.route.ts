import express, { NextFunction, Request, Response } from 'express';
import { UserController } from './user.controller';
import { AnyZodObject } from 'zod';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidations } from '../admin/admin.validation';
import { facultyValidations } from '../faculty/faculty.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';

const router = express.Router();

router.post(
  '/create-student',
  auth(USER_ROLE.admin),
  validateRequest(studentValidations.createStudentValidationSchema),
  UserController.createStudent,
);

router.post(
  '/create-admin',
  validateRequest(adminValidations.createAdminValidationSchema),
  UserController.createAdmin,
);

router.post(
  '/create-faculty',
  validateRequest(facultyValidations.createFacultyValidationSchema),
  UserController.createFaculty,
);

export const UserRoutes = router;
