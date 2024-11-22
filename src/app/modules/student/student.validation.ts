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
const studentValidationSchema = z.object({
  id: z.string().min(1, 'ID is required'),
  password: z.string().max(20, 'password is required'),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female', 'other']),
  dateOfBirth: z.string().optional(),
  email: z.string().email('Invalid email format').min(1, 'Email is required'),
  contactNo: z.string().min(1, 'Contact Number is required'),
  emergencyContactNo: z.string().min(1, 'Emergency Contact Number is required'),
  bloodGroup: z
    .enum(['O+', 'O-', 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-'])
    .optional(),
  presentAddress: z.string().min(1, 'Present Address is required'),
  permanentAddress: z.string().min(1, 'Permanent Address is required'),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImg: z.string().url('Profile Image must be a valid URL').optional(),
  isActive: z.enum(['active', 'blocked']).default('active'),
  isDeleted: z.boolean(),
});

export default studentValidationSchema;
