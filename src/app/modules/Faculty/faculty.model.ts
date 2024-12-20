import { model, Schema } from 'mongoose';
import { TFaculty, TUserName } from './faculty.interface';
import validator from 'validator';

const userNameSchema = new Schema<TUserName>({
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

const facultySchema = new Schema<TFaculty>(
  {
    id: {
      type: String,
      required: true,
      unique: true,
    },
    user: {
      type: Schema.Types.ObjectId,
      required: [true, 'User ID is required'],
      unique: true,
      ref: 'User',
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
    dateOfBirth: { type: Date },
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
    profileImg: { type: String, required: false },
    academicDepartment: {
      type: Schema.Types.ObjectId,
      ref: 'AcademicDepartment',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    toJSON: {
      virtuals: true,
    },
  },
);

facultySchema.virtual('fullname').get(function () {
  if (typeof this?.name?.middleName == 'undefined') {
    return `${this?.name?.firstName} ${this?.name?.lastName}`;
  } else {
    return `${this?.name?.firstName} ${this?.name?.middleName} ${this?.name?.lastName}`;
  }
});

export const Faculty = model<TFaculty>('Faculty', facultySchema);
