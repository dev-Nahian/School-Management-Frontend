import { apiClient as api } from '../lib/axios';

export type FeeType = 'ADMISSION' | 'TUITION' | 'EXAM' | 'TRANSPORT' | 'DEVELOPMENT' | 'OTHER';
export type InvoiceStatus = 'UNPAID' | 'PARTIALLY_PAID' | 'PAID' | 'OVERDUE';
export type PaymentMethod = 'CASH' | 'BANK' | 'CARD' | 'MOBILE_BANKING' | 'OTHER';

export interface FeeStructure {
  id: string;
  name: string;
  feeType: FeeType;
  amount: number;
  isRecurring?: boolean;
  billingFrequency?: string;
  dueDayOfMonth?: number;
  class?: { name: string };
  academicYear?: { name: string };
}

export interface InvoiceModel {
  id: string;
  invoiceNumber: string;
  studentId: string;
  feeStructureId?: string;
  billingPeriod?: string;
  student?: {
    firstName: string;
    lastName: string;
    studentId: string;
  };
  title: string;
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: InvoiceStatus;
  items: { title: string; amount: number }[];
  payments?: {
    id: string;
    receiptNumber: string;
    amount: number;
    paymentMethod: PaymentMethod;
    paymentDate: string;
    notes?: string;
  }[];
}

export interface FinanceDashboardMetrics {
  todayCollection: number;
  monthlyCollection: number;
  expectedTotal: number;
  collectedTotal: number;
  pendingTotal: number;
  overdueTotal: number;
  recentPayments: {
    id: string;
    receiptNumber: string;
    studentName: string;
    studentId: string;
    invoiceNumber: string;
    amount: number;
    paymentMethod: PaymentMethod;
    date: string;
  }[];
}

export const financeService = {
  getDashboardMetrics: async (): Promise<FinanceDashboardMetrics> => {
    const response = await api.get('/v1/finance/dashboard');
    return response.data.data;
  },

  getFeeStructures: async (): Promise<FeeStructure[]> => {
    const response = await api.get('/v1/finance/structures');
    return response.data.data;
  },

  createFeeStructure: async (input: {
    name: string;
    feeType: FeeType;
    amount: number;
    classId?: string;
    isRecurring?: boolean;
    dueDayOfMonth?: number;
  }): Promise<FeeStructure> => {
    const response = await api.post('/v1/finance/structures', input);
    return response.data.data;
  },

  getInvoices: async (studentId?: string): Promise<InvoiceModel[]> => {
    const response = await api.get('/v1/finance/invoices', {
      params: { studentId },
    });
    return response.data.data;
  },

  createInvoice: async (input: {
    studentId: string;
    title: string;
    dueDate: string;
    items: { title: string; amount: number }[];
  }): Promise<InvoiceModel> => {
    const response = await api.post('/v1/finance/invoices', input);
    return response.data.data;
  },

  recordPayment: async (input: {
    invoiceId: string;
    amount: number;
    paymentMethod: PaymentMethod;
    notes?: string;
  }): Promise<any> => {
    const response = await api.post('/v1/finance/payments', input);
    return response.data.data;
  },

  generateRecurringInvoices: async (input?: {
    billingPeriod?: string;
    classId?: string;
  }): Promise<any> => {
    const response = await api.post('/v1/finance/generate-recurring', input || {});
    return response.data;
  },

  updateOverdueStatus: async (): Promise<any> => {
    const response = await api.post('/v1/finance/update-overdue');
    return response.data;
  },
};
