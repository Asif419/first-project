import { Request, Response } from 'express';
import { StudentServices } from './student.service';
// import Joi from 'Joi';
// import studentValidationSchema from './student.validation';
import { z } from 'zod';
import studentValidationSchema from './student.validation';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;

    // Zod validation
    const zodPerseData = studentValidationSchema.parse(studentData);
    // Joi validation
    // const { error, value } = studentValidationSchema.validate(studentData);
    // if (error) {
    //     res.status(500).json({
    //       success: false,
    //       message: 'Something went wrong',
    //       error: error.details,
    //     });
    //   }

    // will call service function to send this data
    const result = await StudentServices.createStudentIntoDB(zodPerseData);

    // send response
    res.status(200).json({
      success: true,
      message: 'Student is created successfully',
      data: result,
    });
  } catch (err: any) {
    //send response
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

const getAllStudents = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentsFromDB();

    // send response
    res.status(200).json({
      success: true,
      message: 'Students are retrieved successfully',
      data: result,
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

const getSingleStudentById = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentId);

    //send response
    res.status(200).json({
      success: true,
      message: 'Student is retrieved successfully',
      data: result,
    });
  } catch (err: any) {
    //send response
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

const deleteStudent = async (req: Request, res: Response) => {
  try {
    const { studentId } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentId);

    //send response
    res.status(200).json({
      success: true,
      message: 'Student is deleted successfully',
      data: result,
    });
  } catch (err: any) {
    //send response
    res.status(500).json({
      success: false,
      message: err.message || 'Something went wrong',
      error: err,
    });
  }
};

export const studentControllers = {
  createStudent,
  getAllStudents,
  getSingleStudentById,
  deleteStudent,
};
