import httpStatus from 'http-status';
import config from '../../config';
import AppError from '../../errors/AppError';
import { AcademicSemester } from '../academicSemester/academicSemester.model';
import { TStudent } from '../student/student.interface';
import { Student } from '../student/student.model';
import { TUser } from './user.interface';
import { User } from './user.model';
import {
  generateAdminID,
  generateFacultyID,
  generateStudentId,
} from './user.utils';
import mongoose from 'mongoose';
import { TAdmin } from '../admin/admin.interface';
import { Admin } from '../admin/admin.model';
import { Faculty } from '../faculty/faculty.model';

const createStudentIntoDB = async (password: string, payload: TStudent) => {
  // create a user object
  const userData: Partial<TUser> = {};

  // Custom static method's uses
  //   if (await Student.isUserExists(studentData.id)) {
  //     throw new Error('User already exists');
  //   }

  const admissionSemester = await AcademicSemester.findById(
    payload.admissionSemester,
  );

  if (admissionSemester == null) {
    throw new AppError(httpStatus.NOT_FOUND, 'Something went wrong');
  }

  // starting a session
  const session = await mongoose.startSession();

  try {
    // starting the transaction
    session.startTransaction();
    userData.id = await generateStudentId(admissionSemester);
    userData.password = password || (config.default_password as string);
    userData.role = 'student';

    // create transaction-1
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create transaction-2
    const newStudent = await Student.create([payload], { session });

    if (!newStudent) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Student');
    }

    // commit transaction
    await session.commitTransaction();
    // end session
    await session.endSession();

    return newStudent;
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create student');
  }
};

const createAdminIntoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<TUser> = {};

  // starting a session
  const session = await mongoose.startSession();

  try {
    // starting the transaction
    session.startTransaction();
    userData.id = await generateAdminID();
    userData.password =
      password || (config.default_password_for_admin as string);
    userData.role = 'admin';

    //create transaction -1
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create transaction-2
    const newAdmin = await Admin.create([payload], { session });

    if (!newAdmin) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Admin');
    }
    // commit transaction
    await session.commitTransaction();

    // end session
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create Admin');
  }
};

const createFacultyIntoDB = async (password: string, payload: TAdmin) => {
  const userData: Partial<TUser> = {};

  // starting a session
  const session = await mongoose.startSession();

  try {
    // starting the transaction
    session.startTransaction();
    userData.id = await generateFacultyID();
    userData.password =
      password || (config.default_password_for_faculty as string);
    userData.role = 'faculty';

    //create transaction -1
    const newUser = await User.create([userData], { session });

    if (!newUser.length) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create User');
    }
    payload.id = newUser[0].id;
    payload.user = newUser[0]._id;

    // create transaction-2
    const newFaculty = await Faculty.create([payload], { session });

    if (!newFaculty) {
      throw new AppError(httpStatus.BAD_REQUEST, 'Failed to create Faculty');
    }
    // commit transaction
    await session.commitTransaction();

    // end session
    await session.endSession();
  } catch (err) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to create Faculty');
  }
};

export const UserServices = {
  createStudentIntoDB,
  createAdminIntoDB,
  createFacultyIntoDB,
};
