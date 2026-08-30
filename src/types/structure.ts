export type SubjectType = 'CORE' | 'ELECTIVE' | 'LAB' | 'OPTIONAL';

export interface AcademicYear {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ClassModel {
  id: string;
  name: string;
  code: string;
  displayOrder: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  sections?: SectionModel[];
  subjects?: SubjectModel[];
}

export interface SectionModel {
  id: string;
  name: string;
  capacity: number;
  classId: string;
  academicYearId: string;
  classTeacherId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  class?: ClassModel;
  academicYear?: AcademicYear;
  classTeacher?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
}

export interface SubjectModel {
  id: string;
  name: string;
  code: string;
  type: SubjectType;
  classId?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  class?: ClassModel;
}

export interface TeacherAssignmentModel {
  id: string;
  teacherId: string;
  subjectId: string;
  sectionId: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  teacher?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  subject?: SubjectModel;
  section?: SectionModel;
}

export interface CreateAcademicYearInput {
  name: string;
  startDate: string;
  endDate: string;
  isCurrent?: boolean;
}

export interface CreateClassInput {
  name: string;
  code: string;
  displayOrder?: number;
}

export interface CreateSectionInput {
  name: string;
  capacity?: number;
  classId: string;
  academicYearId: string;
  classTeacherId?: string | null;
}

export interface CreateSubjectInput {
  name: string;
  code: string;
  type: SubjectType;
  classId?: string | null;
}

export interface AssignSubjectTeacherInput {
  teacherId: string;
  subjectId: string;
  sectionId: string;
}
