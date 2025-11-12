# PetrolPump AI

An AI-powered SaaS platform designed for automated management of petrol pump retail outlets. The system streamlines operations through intelligent employee management, real-time attendance tracking, salary automation, inventory management, and AI-driven analytics.

---

## Features

### 🔐 **Authentication & Authorization**
- Secure login with BCrypt password hashing
- Password reset via email
- JWT-based authentication (with frontend-backend token integration)

### 👥 **Employee Management**
- Create, update, and manage employee profiles
- Track employee details: name, contact, email, role, hire date
- Multi-role support for flexible workforce management
- Active/Inactive status control

### 📅 **Attendance Tracking**
- Daily check-in/check-out time recording
- Automated work duration calculation
- Attendance summaries (Present, Absent, Late, Leave)
- Date-range filtering for reports
- AI face recognition integration ready (TensorFlow.js compatible)

### 💰 **Payroll Management**
- Flexible salary structure per employee
- Configurable allowances (HRA, Dearness Allowance, other incentives)
- Automatic deductions (PF, Tax, others)
- Monthly salary slip generation with detailed breakdown
- Bulk payroll processing
- Payment tracking (Pending/Paid) with payment method recording

### ⛽ **Daily Sales Tracking**
- Record fuel sales by product and date
- Monitor opening stock, closing stock, and tank deliveries
- Track price per unit and environmental conditions (temperature)
- Operational notes for quality assurance

### 📦 **Challan Management (with AI Vision)**
- Upload challan documents (images/PDFs)
- AI extraction via Gemini API vision processing (planned)
- Manual entry fallback option
- Capture: challan number, date, transporter, product, quantity, amount
- Verification status tracking
- Recent 7 challans quick view on dashboard

### 🛢️ **Product Inventory**
- Add, update, and manage fuel products (Petrol, Diesel, CNG, etc.)
- Track product units and specifications
- Real-time product availability management

### 📊 **Reports & Analytics**
- Daily revenue reports with sales trends
- Attendance analytics
- Payroll summaries
- Fuel consumption analysis
- Exportable reports (PDF, Excel)

### 🎥 **AI Crowd Detection & Real-Time Monitoring**
- AI-powered crowd detection at petrol pump premises
- Real-time video analytics using OpenCV and deep learning
- Automatic alerts for crowd threshold exceeding
- Peak hour identification and traffic pattern analysis
- Scheduled reports on customer traffic and peak times
- Historical trend analysis for staffing optimization
- Dashboard widget showing live crowd count
---

## 🧠 Tech Stack

### 🔹 Backend
- **Framework:** Spring Boot 3.x  
- **Language:** Java 17+  
- **ORM:** Hibernate (JPA)  
- **Database:** MySQL 8.0+  
- **Build Tool:** Maven  
- **Server:** Embedded Tomcat  
- **API Documentation:** Swagger / OpenAPI *(planned)*  

---

### 🎨 Frontend
- **Framework:** React 18.x with TypeScript  
- **UI Library:** Material-UI (MUI) v5  
- **HTTP Client:** Axios  
- **State Management:** React Hooks (`useState`, `useEffect`)  
- **Build Tool:** Vite  


  
## **Architecture**
Client-Server Architecture

┌─────────────────────────────────────────────────────────┐
│                    React Frontend (UI)                  │
│              (Material-UI Components, Tabs)             │
├─────────────────────────────────────────────────────────┤
│                  HTTP REST API (JSON)                   │
├─────────────────────────────────────────────────────────┤
│              Spring Boot Backend (MVC + REST)           │
│   (Controllers, Services, Repositories, Entities)       │
├─────────────────────────────────────────────────────────┤
│                  MySQL Database (JPA/Hibernate)         │
│         (Employees, Attendance, Salary, Products)       │
└─────────────────────────────────────────────────────────┘


---

## 🗄️ Database Schema

### 🔑 Key Tables

| Table Name        | Description                              |
|--------------------|------------------------------------------|
| **employees**      | Employee master data                     |
| **attendance**     | Daily attendance records                 |
| **salary_structure** | Employee salary configuration           |
| **salary_record**  | Monthly salary records                   |
| **products**       | Fuel products                            |
| **daily_entries**  | Daily sales and stock entries            |
| **challans**       | Delivery challan records                 |

## API Endpoints

POST   /api/employees              # Create employee
GET    /api/employees              # Get all employees
GET    /api/employees/{id}         # Get employee by ID
PUT    /api/employees/{id}         # Update employee
DELETE /api/employees/{id}         # Delete employee


POST   /api/attendance                  # Mark attendance
GET    /api/attendance/date/{date}      # Get attendance for date
GET    /api/attendance/date-range       # Get attendance for date range
GET    /api/attendance/employee/{id}    # Get employee attendance
DELETE /api/attendance/{id}             # Delete attendance record


POST   /api/salary/structure            # Setup salary structure
GET    /api/salary/structure/{empId}    # Get salary structure
POST   /api/salary/generate/{id}/{month}# Generate monthly salary
GET    /api/salary/month/{month}        # Get salary records for month
PUT    /api/salary/{id}/mark-paid       # Mark salary as paid


POST   /api/challans/upload        # Upload and extract challan
GET    /api/challans/{id}          # Get challan by ID
GET    /api/challans               # Get all challans
GET    /api/challans/recent/last-seven  # Get last 7 challans
PUT    /api/challans/{id}          # Update challan
DELETE /api/challans/{id}          # Delete challan

---

## ⚙️ Dependencies to Install

### 🧩 Backend (Java)
- **Java:** 17+  
- **Maven:** 3.8+  
- **MySQL:** 8.0+  

#### 📦 Spring Boot Dependencies (in `pom.xml`)
- `spring-boot-starter-web`  
- `spring-boot-starter-data-jpa`  
- `spring-boot-starter-validation`  
- `mysql-connector-java`  
- `lombok`  
- `jakarta.persistence-api`  
- `spring-boot-devtools`  

---

### 🎨 Frontend (React)
- **Node.js:** 16+  
- **npm:** 8+  

#### 📦 React / Frontend Dependencies (via `npm install`)
- `react` 18.x  
- `react-dom` 18.x  
- `@mui/material`  
- `@mui/icons-material`  
- `axios`  
- `typescript`  
- `vite`  

---

### 🤖 Optional AI Dependencies
- `@tensorflow/tfjs`  
- `@tensorflow-models/coco-ssd`  
- `face-api.js`  

---

## 🌐 Ports
| Service | Port | Notes |
|----------|------|-------|
| **MySQL** | `3306` | Default, ensure it’s running |
| **Spring Boot Backend** | `8080` | API server |
| **React Frontend (Dev)** | `5173` | Vite development server |

## 🚀 Run Commands

### 🧱 Backend (Build)
cd backend
mvn clean package
Run: java -jar target/petrol-pump-ai-1.0.0.jar
Backend will start on: http://localhost:8080

### 💻 Frontend (Setup)
cd frontend
npm install
Run: npm run dev
Frontend will start on: http://localhost:5173

