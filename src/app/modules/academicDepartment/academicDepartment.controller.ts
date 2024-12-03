import httpStatus from 'http-status';
import catchAsync from '../../utils/catchAsync';
import sendResponse from '../../utils/sendResponse';
import { AcademicDepartmentServices } from './academicDepartment.service';

const createAcademicDepartment = catchAsync(async (req, res) => {
  const result =
    await AcademicDepartmentServices.createAcademicDepartmentIntoDB(req.body);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is created Successfully',
    data: result,
  });
});

const getAllAcademicDepartments = catchAsync(async (req, res) => {
  const result = await AcademicDepartmentServices.getAllAcademicDepartment();

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Departments are fetched Successfully',
    data: result,
  });
});

const getSingleAcademicDepartment = catchAsync(async (req, res) => {
  const departmentId = req.params.departmentId;
  const result =
    await AcademicDepartmentServices.getSingleAcademicDepartment(departmentId);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is fetched Successfully',
    data: result,
  });
});

const updateAcademicDepartment = catchAsync(async (req, res) => {
  const departmentId = req.params.departmentId;
  const payload = req.body;

  const result = await AcademicDepartmentServices.updateAcademicDepartment(
    departmentId,
    payload,
  );
  //   console.log(result);

  sendResponse(res, {
    statusCode: httpStatus.OK,
    success: true,
    message: 'Academic Department is updated Successfully',
    data: result,
  });
});

export const AcademicDepartmentController = {
  createAcademicDepartment,
  getAllAcademicDepartments,
  getSingleAcademicDepartment,
  updateAcademicDepartment,
};
