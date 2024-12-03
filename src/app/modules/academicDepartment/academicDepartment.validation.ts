import { z } from 'zod';

const createAcademicDepartmentValidationSchema = z.object({
  body: z.object({
    name: z.string({
      invalid_type_error: 'Academic Department must be string',
      required_error: 'Academic Department name is required',
    }),
    academicFaculty: z.string({
      invalid_type_error: 'Academic Department must be string',
      required_error: 'Faculty is required',
    }),
  }),
});

const updateAcademicDepartmentValidationSchema =
  createAcademicDepartmentValidationSchema.partial();

export const AcademicDepartmentValidation = {
  createAcademicDepartmentValidationSchema,
  updateAcademicDepartmentValidationSchema,
};
