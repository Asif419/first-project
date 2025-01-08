import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';
const router = express.Router();

router.post(
  '/create-course',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get(
  '/',
  auth(USER_ROLE.admin, USER_ROLE.faculty, USER_ROLE.student),
  CourseControllers.getAllCourses,
);
router.get(
  '/:id',
  auth(USER_ROLE.admin),
  CourseControllers.getSingleCourseByID,
);
router.patch(
  '/:id',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);
router.delete('/:id', auth(USER_ROLE.admin), CourseControllers.deleteCourse);
router.put(
  '/:id/assign-faculties',
  auth(USER_ROLE.admin),
  validateRequest(CourseValidations.FacultiesWithCourseVAlidationSchema),
  CourseControllers.assignFacultiesWithCourse,
); //use put: if exist update it otherwise create new
router.delete(
  '/:id/remove-faculties',
  validateRequest(CourseValidations.FacultiesWithCourseVAlidationSchema),
  CourseControllers.removeFacultiesWithCourse,
);

export const CourseRoutes = router;
