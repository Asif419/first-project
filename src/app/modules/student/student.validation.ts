import { z } from 'zod';

// Zod schema for `UserName`
const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .trim()
    .max(20, "First Name can't be more than 20 characters")
    .refine(
      (value) =>
        value.charAt(0) === value.charAt(0).toUpperCase() &&
        value.slice(1) === value.slice(1).toLowerCase(),
      {
        message: 'First Name must be in capitalize format',
      },
    ),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .trim()
    .refine((value) => /^[a-zA-Z]+$/.test(value), {
      message: 'Last Name must only contain letters',
    }),
});

// Zod schema for `Guardian`
const guardianValidationSchema = z.object({
  fatherName: z.string().min(1, 'Father Name is required'),
  fatherOccupation: z.string().min(1, 'Father Occupation is required'),
  fatherContactNo: z.string().min(1, 'Father Contact Number is required'),
  motherName: z.string().min(1, 'Mother Name is required'),
  motherOccupation: z.string().min(1, 'Mother Occupation is required'),
  motherContactNo: z.string().min(1, 'Mother Contact Number is required'),
});

// Zod schema for `LocalGuardian`
const localGuardianValidationSchema = z.object({
  name: z.string().min(1, 'Local Guardian Name is required'),
  occupation: z.string().min(1, 'Occupation is required'),
  contactNo: z.string().min(1, 'Contact Number is required'),
  address: z.string().min(1, 'Address is required'),
});

// Main Zod schema for `Student`
const createStudentValidationSchema = z.object({
  body: z.object({
    password: z.string().max(20),
    student: z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email('Invalid email format')
        .min(1, 'Email is required'),
      contactNo: z.string().min(1, 'Contact Number is required'),
      emergencyContactNo: z
        .string()
        .min(1, 'Emergency Contact Number is required'),
      bloodGroup: z
        .enum(['O+', 'O-', 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-'])
        .optional(),
      presentAddress: z.string().min(1, 'Present Address is required'),
      permanentAddress: z.string().min(1, 'Permanent Address is required'),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema,
      admissionSemester: z.string(),
      academicDepartment: z.string(),
      profileImg: z
        .string()
        .url('Profile Image must be a valid URL')
        .optional(),
    }),
  }),
});

const updateUserNameValidationSchema = z.object({
  firstName: z.string().min(1).max(20).optional(),
  middleName: z.string().optional(),
  lastName: z.string().optional(),
});

const updateGuardianValidationSchema = z.object({
  fatherName: z.string().optional(),
  fatherOccupation: z.string().optional(),
  fatherContactNo: z.string().optional(),
  motherName: z.string().optional(),
  motherOccupation: z.string().optional(),
  motherContactNo: z.string().optional(),
});

const updateLocalGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

export const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: updateUserNameValidationSchema,
      gender: z.enum(['male', 'female', 'other']).optional(),
      dateOfBirth: z.string().optional(),
      email: z.string().email().optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      bloogGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      guardian: updateGuardianValidationSchema.optional(),
      localGuardian: updateLocalGuardianValidationSchema.optional(),
      admissionSemester: z.string().optional(),
      profileImg: z.string().optional(),
      academicDepartment: z.string().optional(),
    }),
  }),
});

export const studentValidations = {
  createStudentValidationSchema,
  updateStudentValidationSchema,
};
