# Dental Clinic Management System

---

## 📌 Overview  
Dental Clinic Management System is a full-stack web application designed to streamline clinic operations. It includes a **Dashboard**, **Backend API**, and **Frontend UI** for both administrators and patients to manage appointments, medical records, staff, and services efficiently.

---

## ⚙️ Features  
- Role-based access & authentication for Admin, Doctor, and Patient.  
- Appointment scheduling, patient management, and treatment history tracking.  
- Dashboard with healthcare statistics and service management.  
- Real-time or scheduled notifications (email / SMS) to remind patients of appointments.  

---

## 🛠️ Tech Stack  
- **Frontend:** React, Tailwin. 
- **Backend:** Node.js + Express.js.
- **Database:** MongoDB.
- **Authentication:** JWT authention.  
- **Dashboard / UI:** Admin template / Custom UI components  

---

## 📂 Repository Structure  
```

dental-clinic/
├── backend/        # REST API, business logic
├── frontend/       # web UI for patients / users
├── dashboard/      # admin dashboard
├── .gitignore
├── README.md
└── other config files

````

---

## 🚀 How to Run (Development)  
1. Clone the repo  
   ```bash
   git clone https://github.com/camhien7804/dental-clinic.git
   cd dental-clinic
````

2. Setup backend

   ```bash
   cd backend
   npm install
   cp .env.example .env
   # chỉnh .env nếu cần (database, keys, etc.)
   npm start
   ```
3. Setup frontend

   ```bash
   cd frontend
   npm install
   npm start
   ```
4. Dashboard

   ```bash
   cd dashboard
   npm install
   npm start
   ```

---

## 🌟 Highlights & Skills Demonstrated

* Building multi-tier full-stack applications with separated frontend, backend, dashboard.
* Designing RESTful APIs + Role-Based Access Control.
* Managing state & UI in the frontend, handling data with database integration.
* Ensuring code maintainability and modular architecture.

---

## 🧑‍💻 Author

* Nguyen Cam Hien
  📧 [camhien708@gmail.com](mailto:camhien708@gmail.com)
  🌐 GitHub: [camhien7804](https://github.com/camhien7804)


---

END.

[1]: https://github.com/camhien7804/dental-clinic "GitHub - camhien7804/dental-clinic"
