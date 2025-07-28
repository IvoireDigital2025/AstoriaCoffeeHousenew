# Coffee Pro Admin Dashboard & Forms System - Complete Guide

## 📋 **Database Schema Overview**

### **Core Tables:**

1. **marketing_contacts** - Newsletter subscribers and leads
   ```sql
   id, email, phone, name, source, preferences, subscribed, created_at
   ```

2. **contact_messages** - Customer inquiries via contact form
   ```sql
   id, name, email, subject, message, created_at
   ```

3. **loyalty_customers** - QR loyalty program members
   ```sql
   id, name, phone, email, total_visits, current_points, total_rewards, created_at, updated_at
   ```

4. **loyalty_visits** - Customer check-in records
   ```sql
   id, customer_id, visit_date, points_earned, notes
   ```

5. **loyalty_rewards** - Free coffee redemptions
   ```sql
   id, customer_id, reward_type, points_used, redeemed_at, notes
   ```

6. **franchise_applications** - Franchise inquiries
   ```sql
   id, first_name, last_name, email, phone, business_experience, investment_capacity, preferred_location, timeline_to_open, additional_info, status, created_at, updated_at
   ```

7. **qr_tokens** - Secure QR code authentication
   ```sql
   id, token, expires_at, used, created_at
   ```

8. **user_sessions** - Admin authentication sessions
   ```sql
   sid, sess, expire
   ```

---

## 🔐 **Admin Authentication System**

### **Login Component (admin-login.tsx)**
- **Simple password-based authentication**
- **Default password**: "Coffeeproegypt" (configurable via ADMIN_PASSWORD env var)
- **Session-based authentication** with PostgreSQL session store
- **Features**:
  - Password input with loading state
  - Toast notifications for success/error
  - Automatic redirect to dashboard on success
  - Professional login form with Coffee Pro branding

### **Authentication Flow**:
1. POST `/api/admin/login` with password
2. Server validates against ADMIN_PASSWORD environment variable
3. Sets `req.session.adminAuthenticated = true`
4. Session saved to PostgreSQL for persistence
5. Frontend stores session cookie automatically

### **Middleware Protection**:
```javascript
const requireAdminAuth = (req, res, next) => {
  if (!req.session.adminAuthenticated) {
    return res.status(401).json({ message: "Authentication required" });
  }
  next();
};
```

---

## 🎛️ **Admin Dashboard Features**

### **Tabbed Interface Structure**:
1. **Marketing Contacts** - Newsletter subscriber management
2. **Contact Messages** - Customer inquiry management  
3. **Loyalty Program** - QR loyalty system management
4. **Franchise Applications** - Franchise inquiry management
5. **QR Codes** - QR code generation for staff

### **Statistics Cards**:
- **Total Contacts** with user icon
- **Subscribed Contacts** with mail icon
- **Recent Messages** with message icon
- **Active Customers** with customer icon

---

## 📧 **Marketing Contacts Management**

### **Features**:
- **Search functionality** - Filter by name, email, or phone
- **Source filtering** - Filter by acquisition source (newsletter, community, loyalty, contact)
- **Contact details display** - Name, email, phone, source, subscription date
- **Delete functionality** - Remove individual contacts
- **Export capability** - Download contact data
- **Subscription status tracking** - Active/inactive subscribers

### **Data Sources**:
- Newsletter signups from homepage, community, contact pages
- Loyalty program registrations
- Contact form submissions with opt-in
- Community page interactions

---

## 💬 **Contact Messages Management**

### **Features**:
- **Message listing** - Chronological display of all inquiries
- **Full message details** - Name, email, subject, message content
- **Timestamp tracking** - When each message was received
- **Search capability** - Find specific messages
- **Response tracking** - Mark messages as read/unread
- **Export functionality** - Download message history

### **Contact Form Integration**:
- **4-field form**: Name, Email, Subject, Message
- **Validation**: Zod schema validation on both frontend and backend
- **Auto-notification**: New messages trigger admin notifications
- **Success feedback**: Confirmation message to customers

---

## 🎁 **QR Loyalty Program System**

### **Customer Management**:
- **Customer database** - Name, phone, email, visit history
- **Points tracking** - Current points, total visits, rewards redeemed
- **Visit history** - Date/time of each check-in
- **Reward redemption** - Track free coffee redemptions
- **Customer search** - Find customers by name, phone, or email

### **QR Code System**:
- **Admin-only QR generation** - Staff prints codes for display
- **Secure token system** - 60-second check-in window after scan
- **Location validation** - Geolocation verification (100m radius)
- **Dual QR codes**: 
  - Loyalty check-in QR (token-based)
  - Website access QR (direct link)

### **Check-in Process**:
1. Customer scans QR code in store
2. Redirected to check-in page with location validation
3. Enters name, phone, email
4. System validates location and token
5. Awards 1 point per visit
6. 5 points = 1 free coffee

### **Reward Management**:
- **5-point system** - 1 point per visit, 5 points for reward
- **Admin redemption interface** - Staff can redeem rewards
- **Redemption history** - Track all reward usage
- **Customer notifications** - Points balance updates

---

## 🏢 **Franchise Application System**

### **Application Form Fields**:
- **Personal Info**: First name, last name, email, phone
- **Business Experience**: Text area for relevant experience
- **Investment Capacity**: Dropdown ($80K+, $100K+, $150K+, $200K+)
- **Preferred Location**: Text input for desired location
- **Timeline to Open**: Dropdown (3-6 months, 6-12 months, 1+ years)
- **Additional Information**: Optional text area

### **Application Management**:
- **Status filtering** - All, Pending, Approved, Rejected
- **Status update functionality** - Admin can change application status
- **Application details view** - Full application information
- **Contact information** - Direct access to applicant details
- **Timeline tracking** - Submission and update timestamps

### **Status Workflow**:
- **Pending** - Initial submission status
- **Approved** - Applications moving forward
- **Rejected** - Applications not accepted
- **Visual indicators** - Color-coded status badges

---

## 📱 **Newsletter Signup System**

### **Three Variants**:

1. **Default Variant** - Full form with name, email, phone
2. **Compact Variant** - Email-only for sidebars
3. **Inline Variant** - Single-line email signup

### **Form Features**:
- **Zod validation** - Email format and required field validation
- **Success states** - Confirmation message after signup
- **Error handling** - User-friendly error messages
- **Loading states** - Visual feedback during submission
- **Auto-reset** - Form clears after successful submission

### **Integration Points**:
- Homepage hero section
- Community page sidebar
- Contact page bottom
- Footer areas

---

## 🛠️ **Technical Implementation**

### **Frontend Stack**:
- **React** with TypeScript
- **Wouter** for routing
- **TanStack Query** for data fetching
- **React Hook Form** with Zod validation
- **Shadcn/UI** components
- **Tailwind CSS** for styling

### **Backend API Endpoints**:

#### Authentication:
- `POST /api/admin/login` - Admin login
- `POST /api/admin/logout` - Admin logout

#### Marketing:
- `GET /api/admin/marketing/contacts` - Fetch all contacts
- `DELETE /api/admin/marketing/contacts/:id` - Delete contact
- `POST /api/marketing/newsletter` - Newsletter signup

#### Contact Management:
- `GET /api/admin/contact/messages` - Fetch all messages
- `POST /api/contact` - Submit contact form

#### Loyalty System:
- `GET /api/admin/loyalty/customers` - Fetch customers
- `GET /api/admin/loyalty/visits` - Fetch visit history
- `GET /api/admin/loyalty/rewards` - Fetch redemption history
- `POST /api/loyalty/checkin` - Process customer check-in
- `POST /api/admin/loyalty/redeem` - Redeem customer reward

#### Franchise:
- `GET /api/admin/franchise/applications` - Fetch applications
- `PATCH /api/admin/franchise/applications/:id/status` - Update status
- `POST /api/franchise/apply` - Submit application

#### QR Codes:
- `GET /api/admin/qr-codes` - Generate QR codes for display

### **Security Features**:
- **Session-based authentication** with PostgreSQL storage
- **CSRF protection** via same-site cookies
- **Input validation** with Zod schemas
- **SQL injection prevention** with parameterized queries
- **Location validation** for loyalty check-ins
- **Token expiration** for QR codes (60 seconds)

---

## 🎨 **UI/UX Features**

### **Design System**:
- Coffee-themed color palette (browns, creams, ambers)
- Professional dashboard layout
- Mobile-responsive design
- Loading states and skeletons
- Toast notifications
- Form validation feedback

### **Interactive Elements**:
- **Sortable tables** - Click headers to sort data
- **Search bars** - Real-time filtering
- **Filter dropdowns** - Category-based filtering
- **Action buttons** - Delete, edit, approve/reject
- **Status badges** - Visual status indicators
- **QR code display** - Downloadable codes for printing

### **Data Visualization**:
- **Statistics cards** - Key metrics display
- **Customer journey tracking** - Visit and reward history
- **Application pipeline** - Status-based organization
- **Contact source analysis** - Acquisition channel tracking

---

## 📊 **Analytics & Reporting**

### **Available Metrics**:
- Total marketing contacts and growth rate
- Contact acquisition by source (newsletter, loyalty, etc.)
- Customer loyalty engagement (visits, points, redemptions)
- Franchise interest and conversion rates
- Contact form submission trends
- QR code scan analytics

### **Export Capabilities**:
- CSV export of all contact lists
- Message history downloads
- Customer loyalty reports
- Franchise application summaries

---

## 🚀 **Deployment Requirements**

### **Environment Variables**:
```
DATABASE_URL=postgresql://...
SESSION_SECRET=random-secret-key
ADMIN_PASSWORD=your-admin-password
NODE_ENV=production
```

### **Database Setup**:
- PostgreSQL database with all tables created
- Session store table for authentication
- Proper indexes for search functionality

### **File Structure**:
```
/client/src/pages/admin-dashboard.tsx - Main dashboard
/client/src/pages/admin-login.tsx - Authentication
/client/src/components/newsletter-signup.tsx - Newsletter forms
/server/routes.ts - API endpoints
/server/storage.ts - Database operations
/shared/schema.ts - Type definitions
```

This comprehensive system provides a complete business management solution with customer engagement, lead generation, loyalty programs, and franchise management capabilities.