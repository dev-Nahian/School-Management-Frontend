import { apiClient as api } from '../lib/axios';

export interface BookModel {
  id: string;
  bookId: string;
  isbn?: string;
  title: string;
  author: string;
  category: string;
  publisher?: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
}

export type BorrowStatus = 'ISSUED' | 'RETURNED' | 'OVERDUE' | 'LOST';

export interface BookBorrowingModel {
  id: string;
  bookId: string;
  book?: BookModel;
  studentId: string;
  student?: {
    id: string;
    studentId: string;
    firstName: string;
    lastName: string;
    class?: { name: string };
    section?: { name: string };
  };
  issueDate: string;
  dueDate: string;
  returnDate?: string;
  status: BorrowStatus;
  notes?: string;
}

export const libraryService = {
  getBooks: async (params?: { search?: string; category?: string }): Promise<BookModel[]> => {
    const response = await api.get('/v1/library/books', { params });
    return response.data.data;
  },

  createBook: async (input: {
    title: string;
    author: string;
    category: string;
    publisher?: string;
    isbn?: string;
    totalCopies: number;
  }): Promise<BookModel> => {
    const response = await api.post('/v1/library/books', input);
    return response.data.data;
  },

  deleteBook: async (id: string): Promise<void> => {
    await api.delete(`/v1/library/books/${id}`);
  },

  issueBook: async (input: {
    bookId: string;
    studentId: string;
    dueDate: string;
    notes?: string;
  }): Promise<BookBorrowingModel> => {
    const response = await api.post('/v1/library/issue', input);
    return response.data.data;
  },

  returnBook: async (borrowingId: string, notes?: string): Promise<BookBorrowingModel> => {
    const response = await api.post(`/v1/library/return/${borrowingId}`, { notes });
    return response.data.data;
  },

  getBorrowingHistory: async (studentId?: string): Promise<BookBorrowingModel[]> => {
    const response = await api.get('/v1/library/borrowings', { params: { studentId } });
    return response.data.data;
  },
};
