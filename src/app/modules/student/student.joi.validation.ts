import Joi from 'Joi';

// creating a schema validation using Joi
const userNameJoiSchema = Joi.object({
  firstName: Joi.string()
    .trim()
    .max(20)
    .regex(/^[A-Z][a-z]*$/, 'capitalize format') // Capitalized validation
    .required()
    .messages({
      'string.empty': 'First Name is required',
      'string.max': "First Name can't be more than 20 characters",
      'string.pattern.name': '{#label} must be capitalized',
    }),
  middleName: Joi.string().optional(),
  lastName: Joi.string()
    .trim()
    .regex(/^[a-zA-Z]+$/, 'alpha') // Alpha-only validation
    .required()
    .messages({
      'string.empty': 'Last Name is required',
      'string.pattern.name': '{#label} must contain only letters',
    }),
});

// Joi schema for `Guardian`
const guardianJoiSchema = Joi.object({
  fatherName: Joi.string().required().messages({
    'string.empty': 'Father Name is required',
  }),
  fatherOccupation: Joi.string().required().messages({
    'string.empty': 'Father Occupation is required',
  }),
  fatherContactNo: Joi.string().required().messages({
    'string.empty': 'Father Contact Number is required',
  }),
  motherName: Joi.string().required().messages({
    'string.empty': 'Mother Name is required',
  }),
  motherOccupation: Joi.string().required().messages({
    'string.empty': 'Mother Occupation is required',
  }),
  motherContactNo: Joi.string().required().messages({
    'string.empty': 'Mother Contact Number is required',
  }),
});

// Joi schema for `LocalGuardian`
const localGuardianJoiSchema = Joi.object({
  name: Joi.string().required().messages({
    'string.empty': 'Local Guardian Name is required',
  }),
  occupation: Joi.string().required().messages({
    'string.empty': 'Occupation is required',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Contact Number is required',
  }),
  address: Joi.string().required().messages({
    'string.empty': 'Address is required',
  }),
});

// Main Joi schema for `Student`
const studentValidationSchema = Joi.object({
  id: Joi.string().required().messages({
    'string.empty': 'ID is required',
  }),
  name: userNameJoiSchema.required(),
  gender: Joi.string().valid('male', 'female', 'other').required().messages({
    'any.only': '{#value} is not valid for gender',
  }),
  dateOfBirth: Joi.string().optional(),
  email: Joi.string().email().required().messages({
    'string.email': '{#value} is not a valid email address',
  }),
  contactNo: Joi.string().required().messages({
    'string.empty': 'Contact Number is required',
  }),
  emergencyContactNo: Joi.string().required().messages({
    'string.empty': 'Emergency Contact Number is required',
  }),
  bloodGroup: Joi.string()
    .valid('O+', 'O-', 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-')
    .optional()
    .messages({
      'any.only': '{#value} is not a valid blood group',
    }),
  presentAddress: Joi.string().required().messages({
    'string.empty': 'Present Address is required',
  }),
  permanentAddress: Joi.string().required().messages({
    'string.empty': 'Permanent Address is required',
  }),
  guardian: guardianJoiSchema.required(),
  localGuardian: localGuardianJoiSchema.required(),
  profileImg: Joi.string().uri().optional().messages({
    'string.uri': 'Profile Image must be a valid URL',
  }),
  isActive: Joi.string().valid('active', 'blocked').default('active').messages({
    'any.only': '{#value} is not valid for isActive',
  }),
});

export default studentValidationSchema;
