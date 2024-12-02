import { academicSemesterNameCodeMapper } from './academicSemester.constant';
import { TAcademicSemester } from './academicSemester.interface';
import { AcademicSemester } from './academicSemester.model';

const createAcademicSemesterIntoDB = async (payload: TAcademicSemester) => {
  if (academicSemesterNameCodeMapper[payload.name] != payload.code) {
    throw new Error('Invalid Semester Code');
  }

  const result = await AcademicSemester.create(payload);
  return result;
};

const getAllAcademicSemestersFromDB = async () => {
  const result = await AcademicSemester.find();
  return result;
};

const getSingleSemesterByIDFromDB = async (id: string) => {
  {
    const result = await AcademicSemester.findById(id);
    return result;
  }
};

const updateAcademicSemester = async (
  id: string,
  payload: TAcademicSemester,
) => {
  if (academicSemesterNameCodeMapper[payload.name] != payload.code) {
    throw new Error('Invalid Semester Code');
  }
  const result = await AcademicSemester.findOneAndUpdate(
    { _id: { $eq: id } },
    { $set: payload },
    { new: true },
  );
  return result;
};

export const AcademicSemesterServices = {
  createAcademicSemesterIntoDB,
  getAllAcademicSemestersFromDB,
  getSingleSemesterByIDFromDB,
  updateAcademicSemester,
};
