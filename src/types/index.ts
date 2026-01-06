export type UserRole = 'admin' | 'salesperson';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export type PaymentPattern = 'On Time' | 'Slow' | 'Partial Payer' | 'Problematic';

export interface Customer {
  id: string;
  name: string;
  totalLoads: number;
  openInvoices: number;
  outstandingAmount: number;
  avgPaymentDays: number;
  trustScore: number;
  paymentPattern: PaymentPattern;
  assignedSalespersonIds: string[];
  notes?: string;
}

export type LoadStatus = 'Paid' | 'Pending' | 'Partial' | 'Overdue' | 'Disputed';

export interface LoadNote {
  id: string;
  date: string;
  author: string;
  content: string;
}

export interface CommissionRecipient {
  id: string;
  name: string;
  role: string;
  rate: number;
  calculated: number;
  status: 'Pending' | 'Paid';
}

export interface Load {
  id: string;
  loadNumber: string;
  customerId: string;
  customerName: string;
  salespersonId: string;
  salespersonName: string;
  origin: string;
  destination: string;
  pickupDate: string;
  deliveryDate: string;
  billedAmount: number;
  receivedAmount: number;
  status: LoadStatus;
  invoiceDate: string;
  daysOutstanding: number;
  commissionRecipients: CommissionRecipient[];
  notes: LoadNote[];
}

export interface Salesperson {
  id: string;
  name: string;
  email: string;
  activeLoads: number;
  pendingCommissions: number;
  paidYTD: number;
  avgDaysToCollection: number;
  performanceScore: number;
  monthlyTarget: number;
  paidThisMonth: number;
}

export type CommissionRunStatus = 'Draft' | 'Finalized';

export interface CommissionRun {
  id: string;
  runId: string;
  period: string;
  status: CommissionRunStatus;
  totalAmount: number;
  salespeopleCount: number;
  createdDate: string;
}

export interface ActivityEvent {
  id: string;
  timestamp: string;
  type: 'payment' | 'commission' | 'flag' | 'note';
  message: string;
  icon: string;
}

export interface AdminMetrics {
  totalOutstandingCommissions: number;
  commissionsPaidThisMonth: number;
  pendingLoadsCount: number;
  avgDaysToPayment: number;
  collectionHealthScore: number;
}

export interface SalespersonMetrics {
  pendingCommissions: number;
  paidThisMonth: number;
  paidYTD: number;
  loadsAwaitingPayment: number;
  performanceScore: number;
  monthlyTarget: number;
}

export interface TrustScoreBreakdown {
  paymentTimeliness: number;
  partialPaymentFrequency: number;
  disputeFrequency: number;
  communicationResponsiveness: number;
}

export interface ChartDataPoint {
  name: string;
  value: number;
  color?: string;
  [key: string]: string | number | undefined;
}

export interface WeeklyPaymentData {
  week: string;
  received: number;
  outstanding: number;
}

export interface MonthlyEarningsData {
  month: string;
  earnings: number;
}
