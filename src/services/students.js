//
import { StudentsCollection } from '../db/structModelChema.js';

export const getAllStudents = async () => {
    const students = await StudentsCollection.find();
    return students;
};
// getAllStudents повертає - видає весь масив студентів згідно шаблону описаному в studentsSchema за рах методу find()
export const getStudentById = async (studentId) => {
    const student = await StudentsCollection.findById(studentId);
    return student;
};
// getStudentById знаходить обєкт одного студента по айді за рах мет findById
