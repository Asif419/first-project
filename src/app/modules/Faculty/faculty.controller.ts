import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { FacultyServices } from './faculty.service';

const getAllFaculties = catchAsync(async (req, res) => {
  const result = await FacultyServices.getAllFacultyFromDB(req.query);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculties are retrieved successfully',
    data: result,
  });
});

const getSingleFacultyByID = catchAsync(async (req, res) => {
  const { facultyID } = req.params;
  const result = await FacultyServices.getSingleFacultyFromDB(facultyID);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is retrieved successfully',
    data: result,
  });
});

const updateFaculty = catchAsync(async (req, res) => {
  const { facultyID } = req.params;
  const { faculty } = req.body;
  const result = await FacultyServices.updateFacultyIntoDB(facultyID, faculty);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is updated successfully',
    data: result,
  });
});

const deleteFaculty = catchAsync(async (req, res) => {
  const { facultyID } = req.params;
  const result = await FacultyServices.deleteFacultyFromDB(facultyID);

  //send response
  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Faculty is deleted successfully',
    data: result,
  });
});

export const facultyControllers = {
  getAllFaculties,
  getSingleFacultyByID,
  updateFaculty,
  deleteFaculty,
};
