export type UserRole = 'owner' | 'admin' | 'manager' | 'salesperson' | 'csr' | 'accounting';

// Granular Permission Definitions
export type PermissionScope = 'none' | 'own' | 'team' | 'all';

export interface UserPermissions {
  // Commission Visibility
  viewCommissions: PermissionScope;           // See commission amounts
  viewCommissionRates: boolean;               // See actual percentage rates
  viewOthersCommissions: boolean;             // See what colleagues earn

  // Load & Customer Access
  viewLoads: PermissionScope;                 // Access to load records
  viewCustomers: PermissionScope;             // Access to customer records
  viewCustomerScores: boolean;                // See trust scores
  viewSalespersonScores: boolean;             // See performance scores

  // Financial Data
  viewFinancialDetails: boolean;              // See billed/received amounts
  viewOutstandingAmounts: boolean;            // See what's owed
  viewPaymentHistory: boolean;                // See payment patterns

  // Actions
  canAddNotes: boolean;                       // Add notes to loads
  canTagUsers: boolean;                       // @mention other users
  canFlagDisputes: boolean;                   // Mark loads as disputed
  canExportData: boolean;                     // Export to CSV/Excel

  // Admin Features
  canManageCommissionRuns: boolean;           // Create/finalize commission runs
  canEditCommissionRates: boolean;            // Change rate configurations
  canManageUsers: boolean;                    // Add/edit/remove users
  canManagePermissions: boolean;              // Change user permissions
  canViewAllReports: boolean;                 // Access all analytics
  canConfigureSystem: boolean;                // System settings
}

// Preset permission templates
export type PermissionPreset = 'owner' | 'admin' | 'manager' | 'salesperson' | 'csr' | 'accounting' | 'custom';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
  permissions: UserPermissions;
  permissionPreset: PermissionPreset;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

// For the user management table
export interface ManagedUser extends User {
  department?: string;
  reportsTo?: string;
  teamId?: string;
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
