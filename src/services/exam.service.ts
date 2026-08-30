import { apiClient as api } from '../lib/axios';

export type ExamTerm = 'FIRST_TERM' | 'MID_TERM' | 'FINAL_TERM' | 'TEST';

export interface Exam {
  id: string;
  title: string;
  term: ExamTerm;
  academicYearId: string;
  academicYear?: { name: string };
  startDate: string;
  endDate: string;
  schedules?: ExamSchedule[];
}

export interface ExamSchedule {
  id: string;
  examId: string;
  classId: string;
  subjectId: string;
  examDate: string;
  fullMarks: number;
  passMarks: number;
  writtenMax: number;
  mcqMax: number;
  practicalMax: number;
  class?: { name: string };
  subject?: { name: string; code: string };
  exam?: { title: string };
}

export interface MarkEntryItem {
  id?: string;
  studentId: string;
  writtenMarks: number;
  mcqMarks: number;
  practicalMarks: number;
  totalMarks: number;
  percentage: number;
  grade: string;
  gpa: number;
  isPassed: boolean;
  remarks?: string;
  student?: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    rollNumber: string;
  };
  subject?: {
    name: string;
    code: string;
  };
}

export interface ReportCardResponse {
  student: {
    id: string;
    firstName: string;
    lastName: string;
    studentId: string;
    rollNumber: string;
    class?: { name: string };
    section?: { name: string };
  };
  markEntries: MarkEntryItem[];
  summary: {
    totalSubjects: number;
    totalObtainedMarks: number;
    totalPossibleMarks: number;
    averagePercentage: number;
    overallGPA: number;
    overallGrade: string;
    resultStatus: 'PASSED' | 'FAILED';
  };
}

export const examService = {
  getExams: async (): Promise<Exam[]> => {
    const response = await api.get('/v1/exams');
    return response.data.data;
  },

  createExam: async (input: {
    title: string;
    term: ExamTerm;
    academicYearId: string;
    startDate: string;
    endDate: string;
  }): Promise<Exam> => {
    const response = await api.post('/v1/exams', input);
    return response.data.data;
  },

  getExamSchedules: async (examId?: string, classId?: string): Promise<ExamSchedule[]> => {
    const response = await api.get('/v1/exams/schedules', {
      params: { examId, classId },
    });
    return response.data.data;
  },

  createExamSchedule: async (input: {
    examId: string;
    classId: string;
    subjectId: string;
    examDate: string;
    fullMarks: number;
    passMarks: number;
    writtenMax: number;
    mcqMax: number;
    practicalMax: number;
  }): Promise<ExamSchedule> => {
    const response = await api.post('/v1/exams/schedules', input);
    return response.data.data;
  },

  saveMarkEntries: async (input: {
    examId: string;
    classId: string;
    sectionId: string;
    subjectId: string;
    marks: {
      studentId: string;
      writtenMarks: number;
      mcqMarks: number;
      practicalMarks: number;
      remarks?: string;
    }[];
  }): Promise<MarkEntryItem[]> => {
    const response = await api.post('/v1/exams/marks', input);
    return response.data.data;
  },

  getStudentReportCard: async (studentId: string, examId?: string): Promise<ReportCardResponse> => {
    const response = await api.get(`/v1/exams/report-card/${studentId}`, {
      params: { examId },
    });
    return response.data.data;
  },
};
