import { Schema, model, connect } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';

import {
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import config from '../../config';

const userNameSchema = new Schema<TUserName>({
  // sending error message
  // ---------------------
  firstName: {
    type: String,
    //Trimming to solve extra space before and after the word
    trim: true,
    required: [true, 'First Name is required'],
    maxlength: [20, "First Name can't be more than 20"],
    // custom validate
    validate: {
      validator: function (value: string) {
        const firstNameStr =
          value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();
        return firstNameStr === value;
        // console.log(value);
      },
      message: '{VALUE} is not in capitalize format',
    },
  },
  middleName: {
    type: String,
    require: false,
  },
  lastName: {
    type: String,
    require: [true, 'Last Name is required'],

    // validate using third party validator
    validate: {
      validator: (value: string) => validator.isAlpha(value),
      message: '{VALUE} is not valid',
    },
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: { type: String, required: true },
  fatherOccupation: { type: String, required: true },
  fatherContactNo: { type: String, required: true },
  motherName: { type: String, required: true },
  motherOccupation: { type: String, required: true },
  motherContactNo: { type: String, required: true },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: { type: String, required: true },
  occupation: { type: String, required: true },
  contactNo: { type: String, required: true },
  address: { type: String, required: true },
});

const studentSchema = new Schema<TStudent, StudentModel>(
  {
    // id unique validation
    //--------------------
    id: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      maxlength: [20, 'Password cannot be more than 20 characters'],
    },
    name: {
      type: userNameSchema,
      required: true,
    },
    // enum writing in correct way and use of {VALUE}
    // -----------------------
    gender: {
      type: String,
      enum: {
        values: ['male', 'female', 'other'],
        message: '{VALUE} is not valid',
      },
      required: true,
    },
    dateOfBirth: { type: String },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: '{VALUE} is not valid email type',
      },
    },
    contactNo: { type: String, required: true },
    emergencyContactNo: { type: String, required: true },
    bloodGroup: {
      type: String,
      enum: ['O+', 'O-', 'A+', 'A-', 'AB+', 'AB-', 'B+', 'B-'],
    },
    presentAddress: { type: String, required: true },
    permanentAddress: { type: String, required: true },
    guardian: {
      type: guardianSchema,
      required: true,
    },
    localGuardian: {
      type: localGuardianSchema,
      required: true,
    },
    profileImg: { type: String, required: false },
    isActive: {
      type: String,
      enum: ['active', 'blocked'],
      default: 'active',
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

// pre save middleware / hook, will work on create(), save() method
studentSchema.pre('save', async function (next) {
  // hashing password
  // eslint-disable-next-line @typescript-eslint/no-this-alias
  const user = this;
  user.password = await bcrypt.hash(
    user.password,
    Number(config.bcrypt_salt_rounds),
  );
  next();
});

// virtual
studentSchema.virtual('fullname').get(function () {
  if (typeof this.name.middleName == 'undefined') {
    return `${this.name.firstName} ${this.name.lastName}`;
  } else {
    return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
  }
});

// post save middleware / hook
studentSchema.post('save', function (doc, next) {
  doc.password = '';
  next();
});

//pre find middleware
studentSchema.pre('find', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('findOne', function (next) {
  this.find({ isDeleted: { $ne: true } });
  next();
});

studentSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { isDeleted: { $ne: true } } });
  next();
});

// creating a custom static method
studentSchema.statics.isUserExists = async function (id: string) {
  const exitingUser = await Student.findOne({ id });
  return exitingUser;
};

// creating a custom instance method
// studentSchema.methods.isUserExists = async function (id: string) {
//   const existingUser = await Student.findOne({ id });
//   return existingUser;
// };

// model creation
export const Student = model<TStudent, StudentModel>('Student', studentSchema);
