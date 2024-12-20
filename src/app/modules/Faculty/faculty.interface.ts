import { Types } from 'mongoose';

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TFaculty = {
  id: string;
  user: Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female' | 'other';
  dateOfBirth: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'O+' | 'O-' | 'A+' | 'A-' | 'AB+' | 'AB-' | 'B+' | 'B-';
  presentAddress: string;
  permanentAddress: string;
  designation: 'Professor' | 'Associate Professor' | 'Lecturer';
  academicDepartment: Types.ObjectId;
  profileImg?: string;
  isDeleted: boolean;
};
