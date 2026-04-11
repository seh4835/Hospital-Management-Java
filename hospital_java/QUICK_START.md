# 🏥 Hospital Management System - Quick Start Guide

## 🚀 Get Started in 3 Steps

### **Step 1: Start Backend (Terminal 1)**
```bash
cd "c:\Users\Seher\Desktop\Hospital Management Java\hospital_java"
java -cp "lib/*;bin" main.ApiServer
```
✅ Backend runs on: **http://localhost:8080**

### **Step 2: Start Frontend (Terminal 2)**
```bash
cd "c:\Users\Seher\Desktop\Hospital Management Java\hospital_java\frontend"
npm run dev
```
✅ Frontend runs on: **http://localhost:5173**

### **Step 3: Open Browser**
```
http://localhost:5173
```
✅ Application is ready to use!

---

## 📋 Available Modules

| Tab | Icon | Features |
|-----|------|----------|
| Dashboard | 📊 | View stats, admit/discharge patients |
| Patients | 👥 | Add, view, delete patients |
| Doctors | 👨‍⚕️ | Add, view, delete doctors |
| Appointments | 📅 | Book appointments |
| Rooms | 🏨 | View room availability |
| Medical Records | 📋 | Add patient records |
| Billing | 💰 | Create and manage bills |
| Pharmacy | 💊 | Manage medicines & inventory |
| Lab Tests | 🧪 | Record lab test results |
| Operations | 🔬 | Schedule surgical operations |

---

## 💡 Quick Tips

### **Add Test Data**
1. Go to **Patient Records** → Click "Add Patient"
2. Fill in ID (must be unique), Name, Age, Disease
3. Repeat for Doctors, Bills, Medicines, Tests, Operations

### **Database Collections**
All data is stored in MongoDB:
- patients
- doctors
- appointments
- rooms
- records
- billing ✨ NEW
- medicines ✨ NEW
- tests ✨ NEW
- operations ✨ NEW

### **Form Tips**
- ✅ All fields are required
- ✅ IDs must be unique
- ✅ Numbers must be numeric
- ✅ Dates use YYYY-MM-DD format
- ✅ Times use HH:MM format

---

## 🔍 Check if Everything Works

### **Backend Endpoint Test**
```bash
# In PowerShell/CMD, test if API is running:
curl http://localhost:8080/api/patients
```
Should return JSON array (even if empty)

### **Frontend Status**
- No console errors (F12 to check)
- Navigation tabs load instantly
- Can toggle between modules
- Forms appear when you click "Add" buttons

---

## 🐛 Quick Troubleshooting

| Problem | Solution |
|---------|----------|
| Backend won't start | Recompile: `javac -d bin -cp "lib/*" src/util/MongoDBConnection.java src/model/*.java src/dao/*.java src/main/ApiServer.java` |
| Port 8080 in use | Kill process or use different port |
| MongoDB error | Ensure MongoDB is running locally |
| No data in tables | Create test data first using the forms |
| Frontend blank | Clear cache (Ctrl+Shift+Delete) and refresh |

---

## 📱 New Features Highlights

### ✨ Billing Management
- Create bills with treatment info
- Track insurance status
- See total billing amount
- Insurance options: Covered, Partial, Not Covered

### ✨ Pharmacy Management
- Add medicines with stock levels
- Get alerts when stock ≤ 10 units
- Track medicine prices
- Quick status: ✅ Available or ⚠️ Low Stock

### ✨ Lab Management
- Record test results with date/time
- Associate with patient names
- View test history
- Delete old records

### ✨ Operations Management
- Schedule surgeries
- Assign doctors and rooms
- Track operation dates/times
- View all scheduled operations

---

## 📊 Examples

### **Create a Bill**
```
Bill ID: 1
Patient Name: John Doe
Treatment: Surgery
Amount: 5000
Insurance: Covered
```

### **Add Medicine**
```
Medicine ID: 101
Name: Aspirin
Stock: 100
Price: 10.50
```

### **Record Lab Test**
```
Test ID: 501
Patient: John Doe
Test Type: Blood Test
Result: Normal
Date: 2026-04-11
Time: 10:30
```

### **Schedule Operation**
```
Operation ID: 301
Patient: John Doe
Doctor: Dr. Smith
Room ID: 201
Date: 2026-04-15
Time: 14:00
```

---

## 📞 Server URLs

| Service | URL | Purpose |
|---------|-----|---------|
| Backend API | http://localhost:8080 | REST API endpoints |
| Frontend App | http://localhost:5173 | Web interface |
| MongoDB | localhost:27017 | Database (local) |

---

## ✅ New Endpoints

```
GET    /api/billing       - Get all bills
POST   /api/billing       - Create bill
DELETE /api/billing?id=X  - Delete bill

GET    /api/pharmacy      - Get all medicines
POST   /api/pharmacy      - Add medicine
DELETE /api/pharmacy?id=X - Delete medicine

GET    /api/lab           - Get all tests
POST   /api/lab           - Add test
DELETE /api/lab?id=X      - Delete test

GET    /api/operations    - Get all operations
POST   /api/operations    - Schedule operation
DELETE /api/operations?id=X - Cancel operation
```

---

## 🎓 Learning Resources

📄 **For Full Documentation:**
- [UPDATE_SUMMARY.md](UPDATE_SUMMARY.md) - Complete changes list
- [DEBUGGING_TESTING_GUIDE.md](DEBUGGING_TESTING_GUIDE.md) - Detailed testing guide
- [CHANGES_SUMMARY.md](CHANGES_SUMMARY.md) - Before/after comparison

🔧 **For Code:**
- [src/main/ApiServer.java](src/main/ApiServer.java) - API handlers
- [frontend/src/api.js](frontend/src/api.js) - Frontend API functions
- [frontend/src/App.jsx](frontend/src/App.jsx) - React components

---

## 🎉 You're All Set!

Your hospital management system includes:
- ✅ Patient Management
- ✅ Doctor Management
- ✅ Appointment Booking
- ✅ Room Management
- ✅ Medical Records
- ✅ **Billing System** ✨
- ✅ **Pharmacy Inventory** ✨
- ✅ **Lab Test Tracking** ✨
- ✅ **Operations Scheduling** ✨
- ✅ Dashboard with Stats

**Status:** Ready for use! 🚀
