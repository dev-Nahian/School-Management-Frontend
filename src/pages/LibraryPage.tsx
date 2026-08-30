import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { libraryService } from '../services/library.service';
import { studentService } from '../services/student.service';
import {
  BookOpen,
  Plus,
  Trash2,
  AlertCircle,
  CheckCircle2,
  X,
  Search,
  BookMarked,
  RotateCcw,
  UserCheck,
  Tag,
} from 'lucide-react';
import type { BookModel } from '../services/library.service';

export const LibraryPage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isSuperAdmin = user?.role === 'SUPER_ADMIN';

  // Tabs: 'CATALOG' | 'BORROWINGS'
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'BORROWINGS'>('CATALOG');

  // Search filter
  const [searchQuery, setSearchQuery] = useState('');

  // Modals State
  const [isAddBookModalOpen, setIsAddBookModalOpen] = useState(false);
  const [isIssueBookModalOpen, setIsIssueBookModalOpen] = useState(false);
  const [selectedBookForIssue, setSelectedBookForIssue] = useState<BookModel | null>(null);

  // Forms State
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    category: 'General Science',
    publisher: '',
    isbn: '',
    totalCopies: 5,
  });

  const [issueForm, setIssueForm] = useState({
    studentId: '',
    dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // +14 days
    notes: '',
  });

  const [feedbackMsg, setFeedbackMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // Queries
  const { data: books = [], isLoading: isLoadingBooks } = useQuery({
    queryKey: ['libraryBooks', searchQuery],
    queryFn: () => libraryService.getBooks({ search: searchQuery }),
  });

  const { data: borrowings = [], isLoading: isLoadingBorrowings } = useQuery({
    queryKey: ['libraryBorrowings'],
    queryFn: () => libraryService.getBorrowingHistory(),
  });

  const { data: students = [] } = useQuery({
    queryKey: ['studentsForLibraryIssue'],
    queryFn: () => studentService.getStudents(),
  });

  // Mutations
  const createBookMutation = useMutation({
    mutationFn: libraryService.createBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryBooks'] });
      setIsAddBookModalOpen(false);
      setFeedbackMsg('New book added to library catalog!');
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to add book.');
    },
  });

  const deleteBookMutation = useMutation({
    mutationFn: libraryService.deleteBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryBooks'] });
      setFeedbackMsg('Book removed from catalog.');
    },
  });

  const issueBookMutation = useMutation({
    mutationFn: libraryService.issueBook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryBooks'] });
      queryClient.invalidateQueries({ queryKey: ['libraryBorrowings'] });
      setIsIssueBookModalOpen(false);
      setSelectedBookForIssue(null);
      setFeedbackMsg('Book copy issued to student successfully!');
      setErrorMsg('');
    },
    onError: (err: any) => {
      setErrorMsg(err?.response?.data?.message || err.message || 'Failed to issue book.');
    },
  });

  const returnBookMutation = useMutation({
    mutationFn: (id: string) => libraryService.returnBook(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['libraryBooks'] });
      queryClient.invalidateQueries({ queryKey: ['libraryBorrowings'] });
      setFeedbackMsg('Book copy returned to library stock.');
    },
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-emerald-500/20 bg-gradient-to-r from-emerald-950/40 via-gray-900/60 to-teal-950/40">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="success" className="mb-2 gap-1.5 font-mono">
                <BookOpen className="h-3.5 w-3.5 text-emerald-400" /> Phase 14 Library Management System
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">School Library & Borrowings</h2>
              <p className="text-xs text-gray-400 mt-1">
                Book catalog inventory, borrowing records, stock management, and issue/return tracking.
              </p>
            </div>

            {isSuperAdmin && (
              <div className="flex items-center gap-2">
                <Button size="sm" onClick={() => setIsAddBookModalOpen(true)} className="gap-1.5 text-xs bg-emerald-600 hover:bg-emerald-500">
                  <Plus className="h-4 w-4" /> Add Catalog Book
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Notifications */}
        {feedbackMsg && (
          <div className="p-3 rounded-xl bg-emerald-950/40 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4 shrink-0" /> {feedbackMsg}
          </div>
        )}

        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" /> {errorMsg}
          </div>
        )}

        {/* Tabs Bar */}
        <div className="flex items-center justify-between gap-4 border-b border-gray-800 pb-3">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === 'CATALOG' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('CATALOG')}
              className="gap-1.5 text-xs"
            >
              <BookMarked className="h-4 w-4 text-emerald-400" /> Book Catalog ({books.length})
            </Button>
            <Button
              variant={activeTab === 'BORROWINGS' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('BORROWINGS')}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="h-4 w-4 text-blue-400" /> Borrowings & Loans ({borrowings.length})
            </Button>
          </div>

          {activeTab === 'CATALOG' && (
            <div className="relative w-full max-w-xs">
              <Search className="h-3.5 w-3.5 absolute left-3 top-2.5 text-gray-500" />
              <input
                type="text"
                placeholder="Search title, author, ISBN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-xs text-white placeholder-gray-500"
              />
            </div>
          )}
        </div>

        {/* TAB 1: CATALOG */}
        {activeTab === 'CATALOG' && (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
            {isLoadingBooks ? (
              <Card className="border-gray-800 p-8 text-center text-xs text-gray-400 col-span-full">
                Loading library catalog...
              </Card>
            ) : books.length === 0 ? (
              <Card className="border-gray-800 p-8 text-center text-xs text-gray-400 col-span-full">
                No books found matching criteria.
              </Card>
            ) : (
              books.map((book) => (
                <Card key={book.id} className="border-gray-800 bg-gray-900/50 flex flex-col justify-between hover:border-emerald-500/30 transition-all">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between gap-2">
                      <Badge variant="purple" className="text-[10px] gap-1">
                        <Tag className="h-3 w-3 text-purple-400" /> {book.category}
                      </Badge>
                      <Badge
                        variant={book.availableCopies > 0 ? 'success' : 'error'}
                        className="text-[10px]"
                      >
                        {book.availableCopies > 0 ? `${book.availableCopies}/${book.totalCopies} Available` : 'OUT OF STOCK'}
                      </Badge>
                    </div>

                    <CardTitle className="text-base font-bold text-white mt-2 leading-snug">
                      {book.title}
                    </CardTitle>
                    <p className="text-xs text-emerald-400 mt-0.5">by {book.author}</p>
                  </CardHeader>

                  <CardContent className="space-y-3 pt-0 text-xs">
                    <div className="p-2.5 rounded-xl bg-gray-950/60 border border-gray-800/80 space-y-1 font-mono text-[11px] text-gray-400">
                      <div className="flex justify-between">
                        <span>Book ID:</span>
                        <strong className="text-white">{book.bookId}</strong>
                      </div>
                      {book.isbn && (
                        <div className="flex justify-between">
                          <span>ISBN:</span>
                          <span className="text-gray-300">{book.isbn}</span>
                        </div>
                      )}
                      {book.publisher && (
                        <div className="flex justify-between">
                          <span>Publisher:</span>
                          <span className="text-gray-300">{book.publisher}</span>
                        </div>
                      )}
                    </div>

                    {isSuperAdmin && (
                      <div className="flex items-center justify-between pt-1 border-t border-gray-800">
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={book.availableCopies <= 0}
                          onClick={() => {
                            setSelectedBookForIssue(book);
                            setIsIssueBookModalOpen(true);
                          }}
                          className="h-7 text-[10px] gap-1 text-emerald-300 border-emerald-500/30"
                        >
                          <BookOpen className="h-3 w-3 text-emerald-400" /> Issue Book
                        </Button>

                        <button
                          onClick={() => deleteBookMutation.mutate(book.id)}
                          className="text-gray-500 hover:text-rose-400 p-1"
                          title="Delete book"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        )}

        {/* TAB 2: BORROWINGS */}
        {activeTab === 'BORROWINGS' && (
          <Card className="border-gray-800 bg-gray-900/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm text-white">Active Loans & Historical Borrowing Records</CardTitle>
            </CardHeader>

            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-gray-300">
                  <thead className="bg-gray-950/60 text-gray-400 uppercase font-mono text-[10px] border-b border-gray-800">
                    <tr>
                      <th className="p-3">Book Title</th>
                      <th className="p-3">Borrower Student</th>
                      <th className="p-3">Issue Date</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      {isSuperAdmin && <th className="p-3 text-right">Action</th>}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {isLoadingBorrowings ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400">
                          Loading borrowing records...
                        </td>
                      </tr>
                    ) : borrowings.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-gray-400">
                          No borrowing records found.
                        </td>
                      </tr>
                    ) : (
                      borrowings.map((b) => (
                        <tr key={b.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="p-3 font-medium text-white">
                            <div>{b.book?.title}</div>
                            <span className="text-[10px] text-emerald-400 font-mono">{b.book?.bookId}</span>
                          </td>
                          <td className="p-3">
                            <div>{b.student?.firstName} {b.student?.lastName}</div>
                            <span className="text-[10px] text-gray-400 font-mono">
                              ID: {b.student?.studentId} • {b.student?.class?.name}
                            </span>
                          </td>
                          <td className="p-3 font-mono">{new Date(b.issueDate).toLocaleDateString()}</td>
                          <td className="p-3 font-mono">{new Date(b.dueDate).toLocaleDateString()}</td>
                          <td className="p-3">
                            <Badge
                              variant={
                                b.status === 'RETURNED'
                                  ? 'success'
                                  : b.status === 'OVERDUE'
                                  ? 'error'
                                  : 'purple'
                              }
                              className="text-[10px]"
                            >
                              {b.status}
                            </Badge>
                          </td>
                          {isSuperAdmin && (
                            <td className="p-3 text-right">
                              {b.status !== 'RETURNED' && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={() => returnBookMutation.mutate(b.id)}
                                  className="h-7 text-[10px] gap-1 text-blue-300 border-blue-500/30"
                                >
                                  <RotateCcw className="h-3 w-3" /> Mark Returned
                                </Button>
                              )}
                            </td>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL 1: Add Catalog Book */}
      {isAddBookModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-emerald-400" /> Add Book to Library Catalog
              </h3>
              <button onClick={() => setIsAddBookModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">Book Title</label>
                <input
                  type="text"
                  placeholder="e.g. Fundamentals of Physics"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-gray-300 font-medium block">Author Name</label>
                  <input
                    type="text"
                    placeholder="e.g. David Halliday"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block">Category</label>
                  <input
                    type="text"
                    placeholder="e.g. Science, Fiction, Mathematics"
                    value={bookForm.category}
                    onChange={(e) => setBookForm({ ...bookForm, category: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-gray-300 font-medium block">Publisher (Optional)</label>
                  <input
                    type="text"
                    placeholder="e.g. Wiley"
                    value={bookForm.publisher}
                    onChange={(e) => setBookForm({ ...bookForm, publisher: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block">ISBN (Optional)</label>
                  <input
                    type="text"
                    placeholder="978-0123456789"
                    value={bookForm.isbn}
                    onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-medium block">Total Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={bookForm.totalCopies}
                    onChange={(e) => setBookForm({ ...bookForm, totalCopies: Number(e.target.value) })}
                    className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white font-mono"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsAddBookModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!bookForm.title || !bookForm.author || createBookMutation.isPending}
                onClick={() => createBookMutation.mutate(bookForm)}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                Save to Catalog
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Issue Book to Student */}
      {isIssueBookModalOpen && selectedBookForIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-emerald-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-emerald-400" /> Issue Book Copy
              </h3>
              <button onClick={() => setIsIssueBookModalOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800 text-xs space-y-1">
              <p className="font-bold text-white">{selectedBookForIssue.title}</p>
              <p className="text-[11px] text-emerald-400 font-mono">Book ID: {selectedBookForIssue.bookId}</p>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">Select Borrower Student</label>
                <select
                  value={issueForm.studentId}
                  onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                >
                  <option value="">Select Student</option>
                  {(students as any[]).map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.studentId}) • {s.class?.name || 'Class'}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Return Due Date</label>
                <input
                  type="date"
                  value={issueForm.dueDate}
                  onChange={(e) => setIssueForm({ ...issueForm, dueDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Issue Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Book in good condition"
                  value={issueForm.notes}
                  onChange={(e) => setIssueForm({ ...issueForm, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsIssueBookModalOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!issueForm.studentId || issueBookMutation.isPending}
                onClick={() =>
                  issueBookMutation.mutate({
                    bookId: selectedBookForIssue.id,
                    studentId: issueForm.studentId,
                    dueDate: issueForm.dueDate,
                    notes: issueForm.notes,
                  })
                }
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                Confirm Issue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
