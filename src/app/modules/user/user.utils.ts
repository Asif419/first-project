import { TAcademicSemester } from '../academicSemester/academicSemester.interface';
import { User } from './user.model';

const findLastStudentId = async () => {
  const lastStudent = await User.findOne(
    {
      role: 'student',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastStudent?.id ? lastStudent.id : undefined;
};

export const generateStudentId = async (payload: TAcademicSemester) => {
  let currentId = (0).toString();
  const lastStudentId = await findLastStudentId();
  if (lastStudentId) {
    const lastStudentSemesterYear = lastStudentId?.substring(0, 4);
    const lastStudentSemesterCode = lastStudentId?.substring(4, 6);
    const currentSemesterCode = payload.code;
    const currentYear = payload.year;

    if (
      lastStudentId &&
      lastStudentSemesterCode == currentSemesterCode &&
      lastStudentSemesterYear == currentYear
    ) {
      currentId = lastStudentId.substring(6);
    }
  }
  let incrementId = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementId = `${payload.year}${payload.code}${incrementId}`;
  return incrementId;
};

const findLastAdminID = async () => {
  const lastAdmin = await User.findOne(
    {
      role: 'admin',
    },
    {
      id: 1,
      _id: 0,
    },
  )
    .sort({
      createdAt: -1,
    })
    .lean();
  return lastAdmin?.id ? lastAdmin.id : undefined;
};

export const generateAdminID = async () => {
  let currentId: string = (0).toString();
  const lastAdminID = await findLastAdminID();
  if (lastAdminID) {
    currentId = lastAdminID.split('-')[1];
  }
  let incrementedID = (Number(currentId) + 1).toString().padStart(4, '0');
  incrementedID = `A-${incrementedID}`;

  return incrementedID;
};
