import { apiClient as api } from '../lib/axios';
import type {
  AcademicYear,
  ClassModel,
  SectionModel,
  SubjectModel,
  TeacherAssignmentModel,
  CreateAcademicYearInput,
  CreateClassInput,
  CreateSectionInput,
  CreateSubjectInput,
  AssignSubjectTeacherInput,
} from '../types/structure';

export const structureService = {
  // Academic Years
  getAcademicYears: async (): Promise<AcademicYear[]> => {
    const response = await api.get('/v1/structure/academic-years');
    return response.data.data;
  },

  createAcademicYear: async (input: CreateAcademicYearInput): Promise<AcademicYear> => {
    const response = await api.post('/v1/structure/academic-years', input);
    return response.data.data;
  },

  setCurrentAcademicYear: async (id: string): Promise<AcademicYear> => {
    const response = await api.patch(`/v1/structure/academic-years/${id}/set-current`);
    return response.data.data;
  },

  // Classes
  getClasses: async (): Promise<ClassModel[]> => {
    const response = await api.get('/v1/structure/classes');
    return response.data.data;
  },

  createClass: async (input: CreateClassInput): Promise<ClassModel> => {
    const response = await api.post('/v1/structure/classes', input);
    return response.data.data;
  },

  // Sections
  getSections: async (): Promise<SectionModel[]> => {
    const response = await api.get('/v1/structure/sections');
    return response.data.data;
  },

  createSection: async (input: CreateSectionInput): Promise<SectionModel> => {
    const response = await api.post('/v1/structure/sections', input);
    return response.data.data;
  },

  assignClassTeacher: async (sectionId: string, classTeacherId: string | null): Promise<SectionModel> => {
    const response = await api.patch(`/v1/structure/sections/${sectionId}/class-teacher`, { classTeacherId });
    return response.data.data;
  },

  // Subjects
  getSubjects: async (): Promise<SubjectModel[]> => {
    const response = await api.get('/v1/structure/subjects');
    return response.data.data;
  },

  createSubject: async (input: CreateSubjectInput): Promise<SubjectModel> => {
    const response = await api.post('/v1/structure/subjects', input);
    return response.data.data;
  },

  // Teacher Assignments
  getTeacherAssignments: async (): Promise<TeacherAssignmentModel[]> => {
    const response = await api.get('/v1/structure/teacher-assignments');
    return response.data.data;
  },

  assignSubjectTeacher: async (input: AssignSubjectTeacherInput): Promise<TeacherAssignmentModel> => {
    const response = await api.post('/v1/structure/teacher-assignments', input);
    return response.data.data;
  },

  deleteClass: async (id: string): Promise<void> => {
    await api.delete(`/v1/structure/classes/${id}`);
  },

  deleteSection: async (id: string): Promise<void> => {
    await api.delete(`/v1/structure/sections/${id}`);
  },

  deleteSubject: async (id: string): Promise<void> => {
    await api.delete(`/v1/structure/subjects/${id}`);
  },

  deleteAcademicYear: async (id: string): Promise<void> => {
    await api.delete(`/v1/structure/academic-years/${id}`);
  },

  deleteTeacherAssignment: async (id: string): Promise<void> => {
    await api.delete(`/v1/structure/teacher-assignments/${id}`);
  },
};
