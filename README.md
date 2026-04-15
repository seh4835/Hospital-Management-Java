# 🏥 Hospital Management System (Java + MongoDB)

A complete **Hospital ERP System** built using **Java and MongoDB**, designed to manage hospital operations such as patients, doctors, appointments, billing, pharmacy, laboratory, and operation theatre scheduling.

---

## 🚀 Features

### 👤 Patient Management
- Add, view, update, delete patients
- Search by ID, name, or disease

### 👨‍⚕️ Doctor Management
- Add and manage doctors
- Search by name and specialization

### 📅 Appointment System
- Book appointments
- View and delete appointments

### 🏨 Room & Admission
- Assign rooms to patients
- Check availability
- Admit and discharge patients

### 📋 Medical Records (EMR)
- Store patient diagnosis and treatment history
- Update and search records

### 💳 Billing System
- Generate bills
- Track insurance status
- Update and search bills

### 💊 Pharmacy Management
- Add medicines
- Track stock
- Sell medicines (auto stock reduction)

### 🧪 Laboratory System
- Store test records
- Track date and time of tests
- Update and search results

### 🏥 Operation Theatre
- Schedule surgeries
- Assign doctor and room
- Auto-manage room occupancy

---

## 🏗️ System Architecture

The system follows a **layered architecture**:
Presentation Layer → Business Logic → DAO Layer → Database


- **Presentation Layer:** Console-based UI  
- **Business Logic:** Core application logic  
- **DAO Layer:** Database interaction  
- **Database:** MongoDB collections  

---

## 🧠 OOP Concepts Used

- **Encapsulation:** Private fields with getters/setters  
- **Abstraction:** DAO layer hides database logic  
- **Polymorphism:** Reusable method structures  
- **Classes & Objects:** Each entity modeled as a class  

---

## 🗄️ Database (MongoDB)

Collections used:
- patients
- doctors
- appointments
- rooms
- records
- billing
- medicines
- tests
- operations

---

## ⚙️ Technologies Used

- **Java**
- **MongoDB**
- **VS Code**

---

## ▶️ How to Run

1. Start MongoDB server  
2. Clone the repository:

git clone https://github.com/seh4835/Hospital-Management-Java

3. Open project in VS Code  
4. Run:

ApiServer.java

5. open new terminal
6. Run:
   cd frontend
   npm install
   npm run dev

---

## 📸 Screenshots


---

## 🔮 Future Enhancements

- Login & Authentication
- Role-based access control
- REST API integration
- Advanced reporting system

---

## 📌 Conclusion

This project demonstrates a **complete hospital ERP system** using Java and MongoDB with modular architecture, CRUD operations, and real-world workflow simulation.

---

## 👩‍💻 Author

**Seher Sanghani**
**Sara Deshmukh**
**Raghav Kaushik**

---
