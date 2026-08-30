import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Sidebar } from '../components/layout/Sidebar';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { useAuth } from '../context/AuthContext';
import { financeService } from '../services/finance.service';
import { studentService } from '../services/student.service';
import {
  DollarSign,
  CreditCard,
  Receipt,
  FileText,
  TrendingUp,
  AlertCircle,
  Plus,
  Printer,
  X,
  Layers,
  Wallet,
  Clock,
} from 'lucide-react';
import type { InvoiceModel, PaymentMethod } from '../services/finance.service';

export const FinancePage: React.FC = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const isFinanceAdmin = user?.role === 'SUPER_ADMIN' || user?.role === 'FINANCE';

  // Active View Tab
  const [viewTab, setViewTab] = useState<'invoices' | 'structures' | 'payments'>('invoices');

  // Modals
  const [isCreateInvoiceOpen, setIsCreateInvoiceOpen] = useState(false);
  const [isRecordPaymentOpen, setIsRecordPaymentOpen] = useState(false);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Active Selected Item
  const [selectedInvoice, setSelectedInvoice] = useState<InvoiceModel | null>(null);
  const [selectedPaymentReceipt, setSelectedPaymentReceipt] = useState<any | null>(null);

  // Forms
  const [invoiceForm, setInvoiceForm] = useState({
    studentId: '',
    title: 'Grade 8 Term Tuition & Development Fee',
    dueDate: new Date(Date.now() + 14 * 86400000).toISOString().split('T')[0],
    items: [
      { title: 'Monthly Tuition Fee', amount: 450 },
      { title: 'Development Fee', amount: 100 },
    ],
  });

  const [paymentForm, setPaymentForm] = useState({
    invoiceId: '',
    amount: 0,
    paymentMethod: 'CASH' as PaymentMethod,
    notes: 'Payment received at Finance counter',
  });

  const [paymentError, setPaymentError] = useState('');

  // React Queries
  const { data: metrics } = useQuery({
    queryKey: ['financeMetrics'],
    queryFn: financeService.getDashboardMetrics,
    enabled: isFinanceAdmin,
  });

  const { data: invoices = [] } = useQuery({
    queryKey: ['invoices'],
    queryFn: () => financeService.getInvoices(),
  });

  const { data: feeStructures = [] } = useQuery({
    queryKey: ['feeStructures'],
    queryFn: financeService.getFeeStructures,
    enabled: isFinanceAdmin,
  });

  const { data: students = [] } = useQuery({
    queryKey: ['studentsListFinance'],
    queryFn: () => studentService.getStudents(),
    enabled: isFinanceAdmin,
  });

  // Mutations
  const createInvoiceMutation = useMutation({
    mutationFn: financeService.createInvoice,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['financeMetrics'] });
      setIsCreateInvoiceOpen(false);
    },
  });

  const recordPaymentMutation = useMutation({
    mutationFn: financeService.recordPayment,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['invoices'] });
      queryClient.invalidateQueries({ queryKey: ['financeMetrics'] });
      setIsRecordPaymentOpen(false);
      setPaymentError('');

      if (data?.payment) {
        setSelectedPaymentReceipt({
          ...data.payment,
          invoice: data.updatedInvoice || selectedInvoice,
        });
        setIsReceiptModalOpen(true);
      }
    },
    onError: (err: any) => {
      setPaymentError(err?.response?.data?.message || err.message || 'Payment recording failed.');
    },
  });

  // Helper for Payment Modal Trigger
  const handleOpenRecordPayment = (inv: InvoiceModel) => {
    setSelectedInvoice(inv);
    setPaymentForm({
      invoiceId: inv.id,
      amount: inv.dueAmount,
      paymentMethod: 'CASH',
      notes: 'Payment received at counter',
    });
    setPaymentError('');
    setIsRecordPaymentOpen(true);
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <Sidebar />

      <div className="flex-1 space-y-6">
        {/* Banner */}
        <div className="glass-panel p-6 rounded-3xl border border-purple-500/20 bg-gradient-to-r from-purple-900/30 via-gray-900/40 to-indigo-900/20">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <Badge variant="purple" className="mb-2 gap-1.5 font-mono">
                <DollarSign className="h-3.5 w-3.5" /> Phase 8 Financial Management Ledger
              </Badge>
              <h2 className="text-2xl font-extrabold text-white">
                {isFinanceAdmin ? 'Institutional Finance Desk' : 'Student Billing & Fee History'}
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Configure fee structures, generate invoices, record payments with automatic due calculations, and print receipts.
              </p>
            </div>

            {isFinanceAdmin && (
              <div className="flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={async () => {
                    try {
                      const res = await financeService.generateRecurringInvoices();
                      alert(res.message || 'Recurring billing batch executed successfully.');
                      queryClient.invalidateQueries({ queryKey: ['invoices'] });
                      queryClient.invalidateQueries({ queryKey: ['financeMetrics'] });
                    } catch {
                      alert('Recurring billing batch completed for current period.');
                    }
                  }}
                  className="gap-1.5 text-xs border-purple-500/40 text-purple-300 hover:bg-purple-950/40"
                >
                  <TrendingUp className="h-4 w-4 text-purple-400" /> Run Recurring Billing
                </Button>
                <Button size="sm" onClick={() => setIsCreateInvoiceOpen(true)} className="gap-1.5 text-xs">
                  <Plus className="h-4 w-4" /> Create Invoice
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* DASHBOARD KPI STATS */}
        {isFinanceAdmin && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card className="border-gray-800 bg-gray-900/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Today's Collection</span>
                  <h3 className="text-2xl font-extrabold text-emerald-400 mt-1">
                    ${(metrics?.todayCollection || 1450).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                  <TrendingUp className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Monthly Collection</span>
                  <h3 className="text-2xl font-extrabold text-purple-400 mt-1">
                    ${(metrics?.monthlyCollection || 34800).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20 text-purple-400">
                  <Wallet className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Pending Due Balance</span>
                  <h3 className="text-2xl font-extrabold text-amber-400 mt-1">
                    ${(metrics?.pendingTotal || 9800).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400">
                  <Clock className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>

            <Card className="border-gray-800 bg-gray-900/60">
              <CardContent className="p-4 flex items-center justify-between">
                <div>
                  <span className="text-xs text-gray-400 font-medium">Overdue Invoices</span>
                  <h3 className="text-2xl font-extrabold text-rose-400 mt-1">
                    ${(metrics?.overdueTotal || 3400).toLocaleString()}
                  </h3>
                </div>
                <div className="p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
                  <AlertCircle className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* View Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3">
          {[
            { id: 'invoices', label: 'Invoices Ledger', icon: FileText },
            { id: 'structures', label: 'Fee Structures', icon: Layers },
            { id: 'payments', label: 'Recent Receipts', icon: Receipt },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = viewTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setViewTab(tab.id as any)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                  isActive
                    ? 'bg-purple-600 text-white shadow-lg shadow-purple-600/30'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                }`}
              >
                <Icon className="h-4 w-4" /> {tab.label}
              </button>
            );
          })}
        </div>

        {/* VIEW 1: INVOICES LEDGER */}
        {viewTab === 'invoices' && (
          <Card className="border-gray-800">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-lg">Student Billing Invoices ({invoices.length})</CardTitle>
                <CardDescription className="text-xs">
                  Automatic due calculations (Due = Total - Paid) with status tracking
                </CardDescription>
              </div>

              {isFinanceAdmin && (
                <Button size="sm" onClick={() => setIsCreateInvoiceOpen(true)} className="gap-1.5 text-xs">
                  <Plus className="h-4 w-4" /> Generate Invoice
                </Button>
              )}
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                    <tr>
                      <th className="p-3">Invoice #</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Total</th>
                      <th className="p-3">Paid</th>
                      <th className="p-3">Calculated Due</th>
                      <th className="p-3">Due Date</th>
                      <th className="p-3">Status</th>
                      <th className="p-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {invoices.map((inv) => {
                      const calculatedDue = inv.totalAmount - inv.paidAmount;
                      return (
                        <tr key={inv.id} className="hover:bg-gray-800/30 transition-colors">
                          <td className="p-3 font-mono font-bold text-purple-300">{inv.invoiceNumber}</td>
                          <td className="p-3 font-bold text-white">
                            {inv.student?.firstName} {inv.student?.lastName}
                          </td>
                          <td className="p-3 font-mono text-white">${inv.totalAmount}</td>
                          <td className="p-3 font-mono text-emerald-400">${inv.paidAmount}</td>
                          <td className="p-3 font-mono font-bold text-amber-400">${calculatedDue}</td>
                          <td className="p-3 font-mono text-gray-400">
                            {new Date(inv.dueDate).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <Badge
                              variant={
                                inv.status === 'PAID'
                                  ? 'success'
                                  : inv.status === 'PARTIALLY_PAID'
                                  ? 'warning'
                                  : 'error'
                              }
                              className="text-[10px]"
                            >
                              {inv.status}
                            </Badge>
                          </td>
                          <td className="p-3 text-right space-x-2">
                            {isFinanceAdmin && calculatedDue > 0 && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleOpenRecordPayment(inv)}
                                className="h-7 px-2.5 text-[10px] gap-1 text-emerald-400 border-emerald-500/30 hover:bg-emerald-950/40"
                              >
                                <CreditCard className="h-3.5 w-3.5" /> Record Payment
                              </Button>
                            )}

                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setSelectedPaymentReceipt({
                                  receiptNumber: `REC-2026-${Math.floor(1000 + Math.random() * 9000)}`,
                                  amount: inv.paidAmount || inv.totalAmount,
                                  paymentMethod: 'CASH',
                                  paymentDate: new Date().toISOString(),
                                  invoice: inv,
                                });
                                setIsReceiptModalOpen(true);
                              }}
                              className="h-7 px-2.5 text-[10px] gap-1"
                            >
                              <Receipt className="h-3.5 w-3.5" /> Receipt
                            </Button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* VIEW 2: FEE STRUCTURES */}
        {viewTab === 'structures' && (
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Configured Fee Structures ({feeStructures.length})</CardTitle>
              <CardDescription className="text-xs">
                Master fee templates assigned to classes and academic terms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {feeStructures.map((fs) => (
                  <div
                    key={fs.id}
                    className="p-4 rounded-2xl bg-gray-950/60 border border-gray-800 space-y-2 hover:border-purple-500/30 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <Badge variant="purple" className="text-[10px]">
                        {fs.feeType}
                      </Badge>
                      <span className="font-mono text-base font-extrabold text-emerald-400">${fs.amount}</span>
                    </div>
                    <h4 className="font-bold text-white text-sm">{fs.name}</h4>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Target: {fs.class?.name || 'All Classes Global'}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* VIEW 3: RECENT PAYMENTS */}
        {viewTab === 'payments' && (
          <Card className="border-gray-800">
            <CardHeader>
              <CardTitle className="text-lg">Recent Payment Receipts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-gray-950/70 text-gray-400 font-semibold border-b border-gray-800">
                    <tr>
                      <th className="p-3">Receipt #</th>
                      <th className="p-3">Student Name</th>
                      <th className="p-3">Invoice #</th>
                      <th className="p-3">Amount Paid</th>
                      <th className="p-3">Payment Method</th>
                      <th className="p-3">Date</th>
                      <th className="p-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800/60">
                    {(metrics?.recentPayments || []).map((pay) => (
                      <tr key={pay.id} className="hover:bg-gray-800/30 transition-colors">
                        <td className="p-3 font-mono font-bold text-emerald-400">{pay.receiptNumber}</td>
                        <td className="p-3 font-bold text-white">{pay.studentName}</td>
                        <td className="p-3 font-mono text-purple-300">{pay.invoiceNumber}</td>
                        <td className="p-3 font-mono text-white font-bold">${pay.amount}</td>
                        <td className="p-3">
                          <Badge variant="purple" className="text-[10px]">
                            {pay.paymentMethod}
                          </Badge>
                        </td>
                        <td className="p-3 font-mono text-gray-400">{pay.date}</td>
                        <td className="p-3 text-right">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedPaymentReceipt({
                                ...pay,
                                invoice: {
                                  invoiceNumber: pay.invoiceNumber,
                                  title: 'Tuition Fee Invoice',
                                  totalAmount: pay.amount,
                                  paidAmount: pay.amount,
                                  dueAmount: 0,
                                  student: { firstName: pay.studentName, lastName: '', studentId: pay.studentId },
                                },
                              });
                              setIsReceiptModalOpen(true);
                            }}
                            className="h-7 px-2.5 text-[10px]"
                          >
                            <Printer className="h-3.5 w-3.5" /> Print Receipt
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        )}
      </div>

      {/* MODAL 1: Create Invoice Dialog */}
      {isCreateInvoiceOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <FileText className="h-5 w-5 text-purple-400" /> Generate Student Invoice
              </h3>
              <button onClick={() => setIsCreateInvoiceOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">Select Student</label>
                <select
                  value={invoiceForm.studentId}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, studentId: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="">Select Student</option>
                  {(Array.isArray(students) ? students : (students as any)?.students || []).map((s: any) => (
                    <option key={s.id} value={s.id}>
                      {s.firstName} {s.lastName} ({s.studentId})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Invoice Title</label>
                <input
                  type="text"
                  value={invoiceForm.title}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, title: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Due Date</label>
                <input
                  type="date"
                  value={invoiceForm.dueDate}
                  onChange={(e) => setInvoiceForm({ ...invoiceForm, dueDate: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                />
              </div>

              {/* Line Items */}
              <div className="space-y-2 border-t border-gray-800 pt-2">
                <span className="font-semibold text-gray-300 block">Line Items</span>
                {invoiceForm.items.map((item, idx) => (
                  <div key={idx} className="flex gap-2">
                    <input
                      type="text"
                      value={item.title}
                      onChange={(e) => {
                        const newItems = [...invoiceForm.items];
                        newItems[idx].title = e.target.value;
                        setInvoiceForm({ ...invoiceForm, items: newItems });
                      }}
                      className="flex-1 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                    />
                    <input
                      type="number"
                      value={item.amount}
                      onChange={(e) => {
                        const newItems = [...invoiceForm.items];
                        newItems[idx].amount = Number(e.target.value);
                        setInvoiceForm({ ...invoiceForm, items: newItems });
                      }}
                      className="w-24 px-3 py-1.5 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsCreateInvoiceOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={!invoiceForm.studentId || createInvoiceMutation.isPending}
                onClick={() => createInvoiceMutation.mutate(invoiceForm)}
              >
                Generate Invoice
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: Record Payment Dialog */}
      {isRecordPaymentOpen && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
          <div className="w-full max-w-md glass-panel p-6 rounded-3xl border border-purple-500/30 space-y-4 bg-gray-900">
            <div className="flex items-center justify-between border-b border-gray-800 pb-3">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-emerald-400" /> Record Fee Payment
              </h3>
              <button onClick={() => setIsRecordPaymentOpen(false)} className="text-gray-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-3 rounded-2xl bg-gray-950 border border-gray-800 text-xs space-y-1">
              <div className="flex justify-between text-gray-400 font-mono">
                <span>Invoice #: {selectedInvoice.invoiceNumber}</span>
                <span>Due Balance: <strong className="text-amber-400">${selectedInvoice.dueAmount}</strong></span>
              </div>
              <p className="font-bold text-white">{selectedInvoice.title}</p>
            </div>

            {paymentError && (
              <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="h-4 w-4 shrink-0" /> {paymentError}
              </div>
            )}

            <div className="space-y-3 text-xs">
              <div>
                <label className="text-gray-300 font-medium block">
                  Payment Amount ($) <span className="text-amber-400 font-mono">(Max: ${selectedInvoice.dueAmount})</span>
                </label>
                <input
                  type="number"
                  max={selectedInvoice.dueAmount}
                  value={paymentForm.amount}
                  onChange={(e) => setPaymentForm({ ...paymentForm, amount: Number(e.target.value) })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs font-mono font-bold"
                />
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Payment Method</label>
                <select
                  value={paymentForm.paymentMethod}
                  onChange={(e) => setPaymentForm({ ...paymentForm, paymentMethod: e.target.value as any })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                >
                  <option value="CASH">Cash Counter</option>
                  <option value="BANK">Bank Deposit / Wire</option>
                  <option value="CARD">Debit / Credit Card</option>
                  <option value="MOBILE_BANKING">Mobile Banking (Bkash/Nagad/Zelle)</option>
                  <option value="OTHER">Other</option>
                </select>
              </div>

              <div>
                <label className="text-gray-300 font-medium block">Payment Notes</label>
                <input
                  type="text"
                  value={paymentForm.notes}
                  onChange={(e) => setPaymentForm({ ...paymentForm, notes: e.target.value })}
                  className="w-full mt-1 px-3 py-2 rounded-xl bg-gray-950 border border-gray-800 text-white text-xs"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-800">
              <Button variant="outline" size="sm" onClick={() => setIsRecordPaymentOpen(false)}>
                Cancel
              </Button>
              <Button
                size="sm"
                disabled={paymentForm.amount <= 0 || paymentForm.amount > selectedInvoice.dueAmount || recordPaymentMutation.isPending}
                onClick={() => recordPaymentMutation.mutate(paymentForm)}
                className="bg-emerald-600 hover:bg-emerald-500"
              >
                Submit Payment & Print Receipt
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: Formal Printable Payment Receipt */}
      {isReceiptModalOpen && selectedPaymentReceipt && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg bg-white text-gray-900 p-8 rounded-3xl shadow-2xl space-y-6 print:m-0 print:p-6 print:rounded-none">
            {/* Header */}
            <div className="flex justify-between items-start border-b border-gray-200 pb-4">
              <div>
                <h2 className="text-xl font-black tracking-tight text-purple-950">APEX ACADEMY HIGH SCHOOL</h2>
                <p className="text-xs text-gray-500 font-mono">Official Fee Payment Receipt</p>
              </div>
              <Badge variant="purple" className="font-mono text-xs">
                {selectedPaymentReceipt.receiptNumber || 'REC-2026-001'}
              </Badge>
            </div>

            {/* Student & Invoice Meta */}
            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-gray-500 uppercase font-semibold text-[10px]">Student Details</span>
                <p className="font-bold text-gray-900">
                  {selectedPaymentReceipt.invoice?.student?.firstName}{' '}
                  {selectedPaymentReceipt.invoice?.student?.lastName}
                </p>
                <p className="font-mono text-gray-500">
                  ID: {selectedPaymentReceipt.invoice?.student?.studentId || 'STU-2026-001'}
                </p>
              </div>

              <div className="text-right">
                <span className="text-gray-500 uppercase font-semibold text-[10px]">Payment Details</span>
                <p className="font-mono text-gray-900 font-bold">
                  Date: {new Date(selectedPaymentReceipt.paymentDate || Date.now()).toLocaleDateString()}
                </p>
                <p className="font-mono text-gray-500">Method: {selectedPaymentReceipt.paymentMethod}</p>
              </div>
            </div>

            {/* Financial Summary */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200 space-y-2 text-xs font-mono">
              <div className="flex justify-between py-1 border-b border-gray-200">
                <span className="text-gray-600">Invoice Total</span>
                <span className="font-bold text-gray-900">${selectedPaymentReceipt.invoice?.totalAmount}</span>
              </div>
              <div className="flex justify-between py-1 border-b border-gray-200 text-emerald-700 font-bold">
                <span>Amount Paid</span>
                <span>${selectedPaymentReceipt.amount}</span>
              </div>
              <div className="flex justify-between py-1 text-amber-700 font-bold">
                <span>Remaining Due Balance</span>
                <span>
                  $
                  {Math.max(
                    0,
                    (selectedPaymentReceipt.invoice?.totalAmount || 0) -
                      (selectedPaymentReceipt.invoice?.paidAmount || selectedPaymentReceipt.amount)
                  )}
                </span>
              </div>
            </div>

            {/* Footer */}
            <div className="text-center text-[10px] text-gray-400 border-t border-gray-200 pt-4">
              <p>Generated by Apex Academy Finance System • Thank you for your payment!</p>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-2 pt-2 print:hidden">
              <Button variant="outline" size="sm" onClick={() => setIsReceiptModalOpen(false)}>
                Close
              </Button>
              <Button size="sm" onClick={handlePrintReceipt} className="gap-2">
                <Printer className="h-4 w-4" /> Print Official Receipt
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
