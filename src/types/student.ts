export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'SUSPENDED';
export type RelationshipType = 'FATHER' | 'MOTHER' | 'GUARDIAN' | 'OTHER';

export interface ParentModel {
  id: string;
  parentId: string;
  userId?: string | null;
  firstName: string;
  lastName: string;
  phone: string;
  email?: string | null;
  address?: string | null;
  occupation?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface StudentParentModel {
  id: string;
  studentId: string;
  parentId: string;
  relationship: RelationshipType;
  isPrimary: boolean;
  parent?: ParentModel;
}

export interface StudentModel {
  id: string;
  studentId: string;
  userId?: string | null;
  firstName: string;
  lastName: string;
  gender?: string | null;
  dateOfBirth?: string | null;
  photoUrl?: string | null;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  classId: string;
  sectionId: string;
  rollNumber: string;
  admissionDate: string;
  status: StudentStatus;
  createdAt: string;
  updatedAt: string;
  class?: {
    id: string;
    name: string;
    code: string;
  };
  section?: {
    id: string;
    name: string;
  };
  parents?: StudentParentModel[];
}

export interface CreateStudentInput {
  firstName: string;
  lastName: string;
  gender?: string;
  dateOfBirth?: string;
  phone?: string;
  email?: string;
  address?: string;
  classId: string;
  sectionId: string;
  rollNumber: string;
  admissionDate?: string;
  status?: StudentStatus;
  photoUrl?: string;
}

export interface StudentQueryParams {
  search?: string;
  classId?: string;
  sectionId?: string;
  status?: StudentStatus;
  sortBy?: 'name' | 'rollNumber' | 'admissionDate' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}
