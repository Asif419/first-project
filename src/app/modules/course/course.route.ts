import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
const router = express.Router();

router.post(
  '/create-course',
  validateRequest(CourseValidations.createCourseValidationSchema),
  CourseControllers.createCourse,
);

router.get('/', CourseControllers.getAllCourses);
router.get('/:id', CourseControllers.getSingleCourseByID);
router.patch(
  '/:id',
  validateRequest(CourseValidations.updateCourseValidationSchema),
  CourseControllers.updateCourse,
);
router.delete('/:id', CourseControllers.deleteCourse);
router.put(
  '/:id/assign-faculties',
  validateRequest(CourseValidations.FacultiesWithCourseVAlidationSchema),
  CourseControllers.assignFacultiesWithCourse,
); //use put: if exist update it otherwise create new
router.delete(
  '/:id/remove-faculties',
  validateRequest(CourseValidations.FacultiesWithCourseVAlidationSchema),
  CourseControllers.removeFacultiesWithCourse,
);

export const CourseRoutes = router;
