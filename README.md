# Shanahan Transportation Commission Portal

A comprehensive, real-time commission management system built for freight transportation companies. This portal transforms the traditionally chaotic process of tracking sales commissions into an elegant, automated, and transparent experience for both administrators and salespeople.

---

## The Problem

Freight transportation companies face a unique challenge: **commissions are triggered by customer payments, not invoices**. This creates a complex web of:

- Partial payments and short pays that need proportional commission calculations
- Multiple salespeople (and CSRs) splitting commissions on the same load
- Customers with varying payment behaviors—some pay on time, others are chronically late
- Zero visibility for salespeople into *why* their commission hasn't been paid yet
- Manual spreadsheet tracking that's error-prone and time-consuming
- Privacy concerns—salespeople shouldn't see what their colleagues earn

Traditional solutions either expose too much data or provide too little transparency. **This portal solves both.**

---

## The Solution

The Shanahan Commission Portal provides **role-based visibility** where everyone sees exactly what they need—nothing more, nothing less:

| User | What They See |
|------|---------------|
| **Owner (Tom)** | Everything. All commissions, all salespeople, all customers, full control. |
| **Admin (Stephanie)** | Full visibility, can run commission cycles, but can't change system settings. |
| **Salesperson (Mike)** | Only their own commissions, loads, and customers. Can see *why* payments are pending. |
| **CSR** | Load and customer data for service purposes. Zero financial/commission visibility. |
| **Accounting** | Financial data and commission runs. No user management access. |

---

## Key Capabilities

### Intelligent Commission Tracking
- **Trigger on Payment, Not Invoice**: Commissions calculate when money hits the bank, not when the invoice goes out
- **Partial Payment Handling**: If a customer pays 60% of an invoice, salespeople get 60% of their commission—automatically
- **Split Commission Support**: Multiple recipients per load with configurable percentage rates
- **Bi-Monthly Commission Runs**: Structured pay periods (10th and 24th) with draft/finalize workflow

### Scoring & Intelligence
- **Customer Trust Score (0-100)**: Algorithmic assessment based on payment timeliness, partial payment frequency, dispute history, and communication responsiveness
- **Salesperson Performance Score**: Collection efficiency rating that reflects not just sales volume, but quality of customer relationships
- **Payment Pattern Detection**: Automatic classification (On Time, Slow, Partial Payer, Problematic)

### Communication & Accountability
- **@Tagging System**: Salespeople can tag Tom, Stephanie, or Accounting on specific loads when issues arise
- **Notes Per Load**: Timestamped, attributed notes documenting collection efforts ("Called ABC, they said check is in the mail")
- **Dispute Flagging**: Formal mechanism to escalate problematic loads for admin attention
- **Full Audit Trail**: Every action, note, and status change is tracked

### Granular Permission System
- **6 Role Presets**: Owner, Admin, Manager, Salesperson, CSR, Accounting
- **19 Individual Permissions**: Fine-tune exactly what each user can see and do
- **Scope Controls**: Permissions can be set to None, Own Only, Team, or All
- **Custom Overrides**: Start from a preset, then customize specific permissions

### Data Visualization
- **Multiple Chart Types**: Pie charts, bar charts, line graphs, donut charts
- **Interactive Tables**: Sort by any column, filter by multiple criteria, search across all fields
- **Export Functionality**: One-click CSV/Excel export with current filters applied
- **Real-Time Metrics**: KPI cards that update as data changes

---

## Application Pages

### Admin Dashboard

#### Overview Tab
The command center. At a glance:
- Total outstanding commissions across all salespeople
- Commissions paid this month
- Pending loads count
- Average days to payment
- Collection health score (system-wide)
- Commission distribution pie chart
- Weekly payment trend chart
- Recent activity feed

#### By Salesperson Tab
Drill into individual salesperson performance:
- Performance score with visual indicator
- Pending vs. paid commissions
- Average days to collection
- Monthly target progress
- Expandable load details per salesperson
- Quick actions: view loads, run report, send reminder

#### By Customer Tab
Customer-centric view of receivables:
- Trust score with color-coded badge
- Payment pattern classification
- Outstanding amount and open invoices
- Average payment days
- Assigned salespeople
- Click to see all loads for that customer

#### Commission Runs Tab
Manage the bi-monthly commission cycle:
- Create new commission run
- Review draft runs before finalizing
- See total amount and salesperson count
- Finalize to lock and process payments
- Historical run archive

#### Permissions Tab
Full user access control:
- User table with search and role filtering
- Click any user to edit their permissions
- Permission presets for quick assignment
- 19 granular toggles organized in 4 categories
- Add new users
- Activate/deactivate accounts

#### Profile Tab
Personal account management:
- Profile card with avatar
- Editable contact information
- Account information display
- Performance overview stats

#### Settings Tab
System configuration:
- General settings
- Commission rate configuration (TL Sales, LTL Sales, CSR rates)
- Notification preferences (email/push toggles)
- Security settings (password, 2FA)
- User management quick access

---

### Salesperson Dashboard

#### My Dashboard Tab
Personalized earnings view:
- Pending commissions (what's coming)
- Paid this month
- Paid YTD
- Loads awaiting payment
- Performance score
- Monthly target progress bar
- Earnings trend chart
- Commission breakdown by customer

#### My Loads Tab
All loads assigned to this salesperson:
- Status indicators (Paid, Pending, Partial, Overdue, Disputed)
- Customer name and load number
- Billed vs. received amounts
- Days outstanding
- Click to see full load details with notes
- Filter by status, date range, customer

#### My Customers Tab
Customers this salesperson manages:
- Trust score and payment pattern
- Open invoices and outstanding amount
- Quick view of recent loads
- Add notes about customer relationships

#### My History Tab
Commission payment history:
- Payment date and amount
- Associated loads
- Commission run reference
- YTD earnings summary

#### Profile & Settings
Same functionality as admin, scoped to personal account.

---

## Technical Architecture

### Stack
| Layer | Technology |
|-------|------------|
| **Frontend** | React 18 with TypeScript |
| **Build Tool** | Vite (fast HMR, optimized builds) |
| **Styling** | Tailwind CSS (utility-first, consistent design) |
| **Charts** | Recharts (composable, responsive) |
| **Icons** | Lucide React (consistent, tree-shakeable) |
| **State** | React useState/useEffect (simple, no Redux overhead) |

### Project Structure
```
src/
├── components/
│   ├── charts/          # Recharts wrappers (Pie, Bar, Line, Donut)
│   ├── common/          # Reusable UI (DataTable, Modal, StatusPill, etc.)
│   └── layout/          # Header, Sidebar, Layout wrapper
├── data/
│   └── mockData.ts      # Comprehensive mock data for all entities
├── pages/
│   ├── admin/           # Admin dashboard tabs
│   └── salesperson/     # Salesperson dashboard tabs
└── types/
    └── index.ts         # TypeScript interfaces for all entities
```

### Type Safety
Every entity is fully typed:
- `User`, `UserPermissions`, `PermissionPreset`
- `Customer`, `Load`, `LoadNote`, `CommissionRecipient`
- `Salesperson`, `CommissionRun`, `ActivityEvent`
- `AdminMetrics`, `SalespersonMetrics`
- Chart data types with proper Recharts compatibility

### Design Principles

**1. Progressive Disclosure**
Users see summary cards first. Click to drill down. Never overwhelmed.

**2. Consistent Visual Language**
- Green (#1B7340) = Primary actions, positive states, Shanahan brand
- Status colors are consistent across all views
- Score badges use the same 0-100 scale everywhere

**3. Responsive Tables**
- Sortable columns
- Filterable rows
- Searchable content
- Exportable data

**4. Modal Workflows**
Complex actions (add note, view load details, edit permissions) happen in focused modals without losing context.

---

## Security Model

### Permission Hierarchy
```
Owner (Tom)
  └── Can manage permissions for everyone
  └── Can configure system settings
  └── Can edit commission rates

Admin (Stephanie)
  └── Can see everything
  └── Can run commission cycles
  └── Cannot change permissions or rates

Manager
  └── Can see team data
  └── Cannot see other teams
  └── Cannot run commission cycles

Salesperson
  └── Can see only own data
  └── Cannot see colleagues' commissions
  └── Can add notes and tag admins

CSR
  └── Can see loads and customers (for service)
  └── Cannot see any financial data
  └── Cannot see commission information

Accounting
  └── Can see all financial data
  └── Can run commission cycles
  └── Cannot manage users or permissions
```

### Data Isolation
- Salespeople queries are scoped to `salespersonId`
- CSR queries exclude financial fields entirely
- Permission checks happen at render time (mock) and would happen at API level (production)

---

## What Makes This Different

### 1. Visibility Without Exposure
Salespeople can see exactly why their commission is pending (customer hasn't paid, partial payment received, disputed) without seeing what their colleagues earn.

### 2. Accountability Through Transparency
The notes and tagging system creates a paper trail. When Mike tags Tom on a disputed load, there's a record. When Dorothy in accounting sees "customer promised payment by Friday," she knows what's happening.

### 3. Intelligence, Not Just Data
Trust scores and performance scores turn raw numbers into actionable insights. A salesperson who keeps bringing slow-pay customers will see their score reflect it. A customer who always short-pays gets flagged before it becomes a pattern.

### 4. Automation Where It Matters
- Partial payments automatically calculate proportional commissions
- Split commissions distribute according to configured rates
- Commission runs aggregate everything—no manual spreadsheet work

### 5. Portable Architecture
This is a standalone portal, not welded to any specific TMS. The data layer can be re-plugged to McLeod, TMW, MercuryGate, or any system that exposes load and payment data.

---

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation
```bash
# Clone the repository
git clone https://github.com/Bahtiyar-byte/shanahan-commission-portal.git

# Navigate to project directory
cd shanahan-commission-portal

# Install dependencies
npm install

# Start development server
npm run dev
```

### Build for Production
```bash
npm run build
```

### Preview Production Build
```bash
npm run preview
```

---

## Demo Access

The application includes comprehensive mock data for demonstration:

**Admin View (Tom Shanahan)**
- Full access to all features
- Can switch to salesperson view via header toggle

**Salesperson View (Mike Bronowski)**
- Limited to own data
- Demonstrates permission restrictions

Toggle between views using the "Switch View" button in the header.

---

## Roadmap

### Phase 1: Current (Mockup)
- [x] Complete UI/UX implementation
- [x] All dashboard views
- [x] Permission system
- [x] Mock data layer

### Phase 2: Backend Integration
- [ ] REST API endpoints
- [ ] Database schema (PostgreSQL)
- [ ] Authentication (JWT + refresh tokens)
- [ ] Real permission enforcement

### Phase 3: TMS Integration
- [ ] McLeod LoadMaster connector
- [ ] Payment webhook receivers
- [ ] Automated commission calculations
- [ ] Bi-monthly run scheduling

### Phase 4: Advanced Features
- [ ] Email notifications
- [ ] Mobile-responsive optimization
- [ ] PDF report generation
- [ ] Audit log viewer

---

## Built By

**Digital Ronin**

Commission portal designed and developed for Shanahan Transportation.

---

## License

Proprietary - Shanahan Transportation

---

*This portal transforms commission chaos into commission clarity.*
