# 🔒 SmartCampus Security Implementation

## ✅ COMPLETED: Secure Registration System

### 🚨 Problem Fixed
- **Before**: Any user could self-register as "admin" by sending `role: "admin"` in registration
- **After**: Only users with valid `ADMIN_SECRET_KEY` can register as admin

---

## 📋 Registration Flow

### 1️⃣ Student Registration (Default)
```bash
POST /api/auth/register
{
    "name": "Sneha",
    "email": "sneha@example.com",
    "password": "securePassword123"
}

Response:
{
    "message": "User registered successfully",
    "user": {
        "id": 1,
        "name": "Sneha",
        "email": "sneha@example.com",
        "role": "student"  ← Always "student" by default
    }
}
```

### 2️⃣ Admin Registration (With Secret Key)
```bash
POST /api/auth/register
{
    "name": "Admin User",
    "email": "admin@example.com",
    "password": "securePassword123",
    "adminKey": "SMART_CAMPUS_ADMIN_2026"
}

Response:
{
    "message": "User registered successfully",
    "user": {
        "id": 2,
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin"  ← "admin" only if correct key provided
    }
}
```

### 3️⃣ Invalid Admin Key
```bash
POST /api/auth/register
{
    "name": "Hacker",
    "email": "hacker@example.com",
    "password": "password",
    "adminKey": "WRONG_KEY"
}

Response (403 Forbidden):
{
    "message": "Invalid admin key. Registration failed."
}
```

---

## 🔐 Environment Variables

### In `.env` file:
```env
# Admin Secret Key - KEEP THIS SECRET!
ADMIN_SECRET_KEY=SMART_CAMPUS_ADMIN_2026
```

⚠️ **IMPORTANT**: 
- Change this key in production to a strong random string
- Never commit `.env` to git
- Only share with authorized admins

---

## 👥 User Management API Endpoints

### Get Current User Info
```bash
GET /api/auth/me
Headers: Authorization: Bearer <token>

Response:
{
    "id": 1,
    "name": "Sneha",
    "email": "sneha@example.com",
    "role": "student"
}
```

### Get All Users (Admin Only)
```bash
GET /api/auth/users
Headers: Authorization: Bearer <token>

Response (Admin):
[
    {
        "id": 1,
        "name": "Sneha",
        "email": "sneha@example.com",
        "role": "student",
        "createdAt": "2024-01-15T10:30:00Z"
    },
    {
        "id": 2,
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "admin",
        "createdAt": "2024-01-15T11:00:00Z"
    }
]

Response (Student):
{
    "message": "Access denied. Admin only."
}
```

### Promote Student to Admin (Admin Only)
```bash
PUT /api/auth/promote
Headers: Authorization: Bearer <token>
Body:
{
    "userId": 1
}

Response:
{
    "message": "User promoted to admin successfully",
    "user": {
        "id": 1,
        "name": "Sneha",
        "email": "sneha@example.com",
        "role": "admin"
    }
}
```

### Demote Admin to Student (Admin Only)
```bash
PUT /api/auth/demote
Headers: Authorization: Bearer <token>
Body:
{
    "userId": 2
}

Response:
{
    "message": "User demoted to student successfully",
    "user": {
        "id": 2,
        "name": "Admin User",
        "email": "admin@example.com",
        "role": "student"
    }
}

Error (Cannot demote yourself):
{
    "message": "Cannot demote yourself"
}
```

---

## 🛡️ Protected Routes

### Admin-Only Routes
- `GET /api/auth/users` - View all users
- `PUT /api/auth/promote` - Promote user to admin
- `PUT /api/auth/demote` - Demote admin to student
- `POST /api/resources` - Create resources
- `GET /admin` - Admin dashboard
- `POST /api/bookings/:id/status` - Approve/reject bookings

### Student Routes
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - View own bookings
- `PUT /api/bookings/:id/cancel` - Cancel own booking

---

## 📊 User Roles

| Role | Permissions |
|------|-------------|
| **Student** | View resources, Create bookings, Cancel own bookings, View own profile |
| **Admin** | Everything student can do + Create/manage resources, Approve/reject bookings, View all bookings, Manage users |

---

## 🔄 How to Create Initial Admin

### Option 1: During Registration (Easiest)
1. Go to register page
2. Check "Register as Admin (Optional)"
3. Enter the `ADMIN_SECRET_KEY` from `.env`
4. Register

### Option 2: Manual Promotion
1. Register as student
2. Have existing admin promote you via `/api/auth/promote` endpoint
3. Or manually update database: `UPDATE users SET role='admin' WHERE id=1;`

### Option 3: Database Direct (For Development)
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'sneha@example.com';
```

---

## 🚀 Frontend Changes

### Registration Form
- ✅ Removed role dropdown
- ✅ Added optional "Register as Admin" checkbox
- ✅ Only shows admin key input when checkbox is enabled
- ✅ All users default to "student" role

### Admin Routes
- ✅ Protected with `<ProtectedRoute role="admin">`
- ✅ Sidebar shows admin-only links only for admins
- ✅ Admin Dashboard accessible at `/admin`

---

## ✅ Security Checklist

- [x] Registration endpoint prevents self-promotion to admin
- [x] Default role is always "student"
- [x] Admin key required for admin registration
- [x] Admin endpoints check role internally
- [x] Frontend routes protected with AdminRoute component
- [x] `.env` file added to `.gitignore`
- [x] Admin secret key is configurable
- [x] Only admins can promote/demote other users
- [x] Users cannot demote themselves
- [x] All admin endpoints require authentication

---

## 🎯 Best Practices

1. **Never share ADMIN_SECRET_KEY** - Use different keys for dev/prod
2. **Change the key regularly** - Rotate secret keys for security
3. **Use strong passwords** - Enforce password requirements
4. **Monitor admin actions** - Log all admin operations
5. **Regular audits** - Review user roles and permissions

---

## 📱 Frontend Usage Example

```javascript
// Admin can promote user
const promoteUser = async (userId) => {
    try {
        const response = await API.put('/auth/promote', {
            userId: userId
        });
        console.log(response.data);
    } catch (error) {
        console.error(error);
    }
};

// Check if current user is admin
const isAdmin = localStorage.getItem("role") === "admin";
```

