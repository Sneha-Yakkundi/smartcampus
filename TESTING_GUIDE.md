# 🚀 Smart Campus - Quick Start & Testing Guide

## ✅ ALL 8 FEATURES IMPLEMENTED & READY TO TEST

---

## 📋 Summary of Implementations

### ✨ 1. AI-Based Resource Recommendation System
- Multi-factor scoring algorithm (5 factors)
- Considers: occupancy, capacity match, user history, department, building
- Returns top 5 recommended resources
- **Endpoint**: `GET /api/resources/recommendations/smart`

### 🔒 2. Smart Conflict Detection  
- Prevents double-booking
- Shows next available time slots
- "Room occupied 10-12. Available after 12:15 PM" messaging
- **Endpoint**: `GET /api/resources/availability`

### 📋 3. Cancel Bookings
- Students/Faculty can cancel their own bookings
- One-click cancellation from Bookings page
- Toast notification confirmation
- **Endpoint**: `PUT /api/bookings/:id/cancel`

### 🔧 4. Resource Maintenance System
- Admin marks resources "under-maintenance"
- Users cannot book maintenance resources
- Maintenance notes visible to users
- **Endpoint**: `PUT /api/resources/maintenance/:resourceId`

### ✔️ 5. Approval Workflow
- Complete admin approval system
- Pending → Approved/Rejected
- Admin notes support
- Email notifications
- **Endpoints**: 
  - `GET /api/bookings/pending`
  - `PUT /api/bookings/:bookingId/approve`
  - `PUT /api/bookings/:bookingId/reject`

### 🏢 6. Department-Based Booking Access
- Three departments: CSE, ECE, Mechanical
- Resources can be restricted to departments
- Users select department at registration
- **RBAC** (Role-Based Access Control) implemented

### 👥 7. Booking Priority System
- Faculty gets higher priority (2) vs Students (1)
- Faculty bookings approved first
- Faculty shown as "FACULTY" badge
- **Registration Keys**:
  - Faculty: `faculty123`
  - Admin: `admin123`

### 🔍 8. Search + Filter System
- Filter by: type, building, floor, capacity, department
- Text search by name/location
- Availability filtering by date/time
- **Endpoint**: `GET /api/resources/search`

---

## 🎯 Quick Setup (5 minutes)

### Step 1: Start Servers
```bash
# Terminal 1
cd C:\Users\DEEKSHA M\smartcampus\server
npm run dev

# Terminal 2  
cd C:\Users\DEEKSHA M\smartcampus\client
npm run dev
```

### Step 2: Check URLs
- **Frontend**: http://localhost:5173
- **Server**: http://localhost:5000

---

## 🧪 Complete Testing Flow

### TEST SETUP: Create 3 User Accounts

#### Account 1: Student
```
Name: John Student
Email: student@test.com
Password: pass123
Department: CSE
(Leave Faculty/Admin keys empty)
```

#### Account 2: Faculty
```
Name: Dr. Faculty
Email: faculty@test.com
Password: pass123
Department: ECE
Faculty Key: faculty123
(Leave Admin key empty)
```

#### Account 3: Admin
```
Name: Admin User
Email: admin@test.com
Password: pass123
(No department needed)
Admin Key: admin123
```

---

## 📝 Feature Testing Checklist

### TEST 1: Registration & Faculty Role
- [ ] Register as Student → Creates student account
- [ ] Register with faculty key `faculty123` → Creates faculty account
- [ ] Register with admin key `admin123` → Creates admin account
- [ ] Faculty shows "FACULTY" role in profile

---

### TEST 2: AI Recommendation System
1. **Create Test Resources** (as Admin):
   ```json
   POST /api/resources
   {
     "name": "Lab A - CSE",
     "type": "lab",
     "location": "Building A, Floor 2",
     "building": "Building A",
     "floor": 2,
     "capacity": 30,
     "department": "CSE"
   }
   ```
   
   Create 3-4 resources with different capacities/departments

2. **Test Recommendation**:
   - As Student: Open Resources page
   - Look for "Get Recommendations" button or link
   - Enter: Date (tomorrow), Time (10:00-12:00), Capacity (25)
   - ✅ **Should show top 5 resources with scores like "95", "88", "76"**

---

### TEST 3: Search & Filter System
1. Open "Resources" page
2. Try filters:
   - [ ] Search by name: "Lab"
   - [ ] Filter by building: "Building A"
   - [ ] Filter by floor: "2"
   - [ ] Filter by capacity: "30"
   - [ ] Filter by type: "lab"
   - [ ] Filter by department: "CSE"
   - [ ] Availability filter: Select date & time
3. ✅ **Should return matching resources**

---

### TEST 4: Conflict Detection
1. **As Student**: Create a booking
   - Resource: Lab A
   - Date: Tomorrow
   - Time: 10:00 - 12:00
   - Click "Book Resource"
   - Status: Should say "pending" (awaiting admin approval)

2. **As Admin**: Approve the booking
   - Go to Admin Dashboard
   - Click "✓ Approve" on the booking
   - ✅ **Booking status changes to "approved"**

3. **As Faculty**: Try to book same resource same time
   - Try booking Lab A for 11:00 - 13:00
   - ✅ **Should get error**: "This room is occupied from 10:00-12:00. Available again after 12:00 PM"

---

### TEST 5: Faculty Priority
1. **Student creates booking**:
   - Booking ID: 5
   - Status: pending
   - Priority badge: "STUDENT"

2. **Faculty creates booking** (same date/time, different room):
   - Booking ID: 6
   - Status: pending
   - Priority badge: "FACULTY"

3. **Admin goes to Admin Dashboard**:
   - ✅ **Faculty booking (ID: 6) should appear BEFORE student booking**

---

### TEST 6: Booking Approval Workflow
1. **Student creates booking** (as Student account)
   - Expected status: "PENDING"

2. **Admin reviews** (as Admin account)
   - Go to Admin Dashboard
   - See "Total Pending Bookings: 1"
   - Add admin notes (optional)
   - Click "✓ Approve"

3. **Check results**:
   - ✅ Booking status changes to "APPROVED"
   - ✅ Student receives email notification
   - ✅ Booking now appears in student's booking list

---

### TEST 7: Maintenance System
1. **As Admin**: 
   - Go to Admin Dashboard
   - Find a resource
   - Click "Set Maintenance"
   - Enter notes: "Daily cleaning in progress"

2. **As Student**:
   - Try to search for resources
   - ✅ **Maintenance resource should NOT appear**
   - Try to book it directly by ID
   - ✅ **Should get error**: "This resource is under maintenance. Daily cleaning in progress"

3. **As Admin**: Remove maintenance
   - Set status back to "available"
   - ✅ **Resource reappears in search**

---

### TEST 8: Cancel Booking
1. **Student has an approved booking**
2. Go to "My Bookings" page
3. Find the booking card
4. Click "Cancel Booking" button
5. ✅ **Status changes to "CANCELLED"**
6. ✅ **Toast notification**: "Booking cancelled successfully"

---

### TEST 9: Department-Based Access
1. **Admin creates resource restricted to CSE**:
   ```
   PUT /api/resources/maintenance/1
   Department: CSE
   ```

2. **ECE Student tries to book it**:
   - Select the resource
   - Try to book
   - ✅ **Should get error**: "This resource is restricted to CSE department"

3. **CSE Student tries to book it**:
   - ✅ **Should work successfully**

---

### TEST 10: Email Notifications
1. **Create a booking as Student**
2. **Admin approves it**
3. ✅ **Check email** (if email configured):
   - "Your booking has been approved"
   - Shows resource name, date, time

---

## 🎬 Live Demo Script (5 minutes)

```
1. "Here's the Smart Campus application"
   → Show login screen

2. "Feature 1: Three role registration"
   → Register as faculty with key faculty123
   → Show Faculty role assigned

3. "Feature 2: Search & Filter"
   → Go to Resources
   → Show filtering by multiple criteria
   → Filter by: type=lab, building=A, capacity=30

4. "Feature 3: AI Recommendations"
   → Show recommendation algorithm
   → "This algorithm scores resources on 5 factors"
   → Show top 5 recommendations with scores

5. "Feature 4: Smart Conflict Detection"
   → Show existing booking (10-12)
   → Try to book overlapping time (11-13)
   → Show error: "Available again after 12:00"

6. "Feature 5 & 7: Approval Workflow + Priority"
   → Create booking as student (priority=1)
   → Create booking as faculty (priority=2)
   → Go to Admin Dashboard
   → Show faculty booking appears first
   → Approve one, reject one with notes

7. "Feature 6: Department Access"
   → Show CSE resource restricted to CSE
   → Try to book as ECE student → Blocked
   → Book as CSE student → Success

8. "Feature 8: Cancel Booking"
   → Open an approved booking
   → Click "Cancel Booking"
   → Show status changes to CANCELLED

9. "Feature 4: Maintenance"
   → Admin marks resource "under-maintenance"
   → Resource disappears from search
   → Show maintenance note: "...in progress"
```

---

## 📊 API Endpoints Reference

### Authentication
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login

### Resources
- `GET /api/resources` - All resources
- `GET /api/resources/search?type=lab&building=A` - Search & filter
- `GET /api/resources/recommendations/smart?date=2026-06-15&startTime=10:00&endTime=12:00` - AI recommendations
- `GET /api/resources/availability?resourceId=1&date=2026-06-15` - Check availability
- `PUT /api/resources/maintenance/1` - Set maintenance
- `POST /api/resources` - Create resource (admin)

### Bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - My bookings
- `GET /api/bookings/pending` - Pending bookings (admin)
- `PUT /api/bookings/:id/approve` - Approve booking (admin)
- `PUT /api/bookings/:id/reject` - Reject booking (admin)
- `PUT /api/bookings/:id/cancel` - Cancel booking (user)

---

## 🐛 Troubleshooting

### Problem: Port 5000 in use
```bash
taskkill /IM node.exe /F
npm run dev
```

### Problem: Registration keys not working
- Student: Leave all keys empty (default)
- Faculty: Use `faculty123` in Faculty Key field
- Admin: Use `admin123` in Admin Key field

### Problem: Can't see pending bookings
- Must be logged in as admin
- Must have created bookings first
- Go to `/admin` page

### Problem: Search not returning results
- Check resource status is "available" (not "under-maintenance")
- Verify filter parameters match resources
- Check resource department matches if filtering by department

---

## 📸 UI Highlights

1. **Login Page**: Clean dark/light mode
2. **Register Page**: Three role options with secret key fields
3. **Resources Page**: Search, filter, and AI recommendations
4. **Bookings Page**: Shows approval status and priority badges
5. **Admin Dashboard**: Pending bookings with approve/reject buttons
6. **Sidebar**: Role-specific menu items

---

## ✅ Verification Checklist

Before demo, verify:
- [ ] Server running on port 5000
- [ ] Client running on port 5173
- [ ] Can register as all 3 roles
- [ ] Can create resources
- [ ] Can create bookings (see "pending" status)
- [ ] Admin dashboard shows pending bookings
- [ ] Can approve/reject bookings
- [ ] Can cancel bookings
- [ ] Search filters work
- [ ] Maintenance system works
- [ ] Faculty priority visible in admin dashboard

---

## 🎓 Key Points for Viva

1. **AI Algorithm**: "5-factor scoring system considering occupancy, capacity, user history, department, and building"

2. **Smart Conflict Detection**: "Real-time availability checking with next available slot suggestions"

3. **RBAC**: "Three roles (Admin, Faculty, Student) with different access levels and priorities"

4. **Approval Workflow**: "Enterprise-level pending → approved/rejected workflow with admin notes"

5. **Department Access**: "Fine-grained resource access control by department"

6. **Priority System**: "Faculty gets higher priority in approvals, shown first in queue"

7. **Search/Filter**: "Complex query system with multiple filters combined"

8. **Cancellation**: "User self-service cancellation with real-time status updates"

---

## 🎉 Ready to Present!

All features are implemented and working. Follow the testing checklist above to demonstrate each feature to evaluators.

**Total Development Time**: Comprehensive smart campus booking system with AI, RBAC, and enterprise features.

**Key Highlights for Evaluation**:
- Advanced AI algorithm for recommendations
- Enterprise-level approval workflow
- Professional UI with dark mode
- Role-based access control (RBAC)
- Real-time notifications
- Production-ready error handling
