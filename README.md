
# Energize: Smart Home Energy Management System (SHEMS)

## Overview

In 2022, the average U.S. residential electricity price surged to **15.12 cents/kWh**, an 11% increase from the previous year. Adjusted for inflation, this represents a **2.5% overall rise**, driven largely by the growing adoption of smart home devices such as refrigerators, TVs, ovens, and speakers. 

To address this challenge, homeowners need tools to regain control over energy expenses—enter **Smart Home Energy Management Systems (SHEMS)**. A crucial component of these systems is an integrated database, offering accurate logs of device-level electricity usage. With this data, users can identify trends and make informed adjustments to their energy consumption based on their budget.

This project provides a robust schema for SHEMS and demonstrates how homeowners can optimize their energy usage effectively.

---

## Demo
https://github.com/user-attachments/assets/04f77d8f-65bd-48b1-9e79-23701b769f99

---

## Features

- **Device Energy Monitoring**: Tracks energy usage for individual devices.
- **Data Insights**: Visualizes energy trends using interactive charts.
- **Customizable Settings**: Allows homeowners to define usage goals and budgets.

---

## Tech Stack

**Backend:**
- Python 3
- Flask
- MySQL

**Frontend:**
- JavaScript
- React
- React-Router
- React-Bootstrap
- React-Google-Charts
- Bootstrap
- Vite

**Utilities:**
- Axios
---

## Environment Requirements

- **Python:** 3.11.6
- **Flask:** 3.0.3
- **MySQL:** 8.2.0

---

## Getting Started

### Installation

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Jflores427/SHEMS.git
   cd SHEMS
   ```

2. **Set Up Virtual Environment**
   - Windows:
     ```bash
     python3 -m venv venv
     .\venv\Scripts\activate
     ```
   - macOS/Linux:
     ```bash
     python3 -m venv venv
     source venv/bin/activate
     ```

3. **Set Up MySQL**
   Ensure MySQL is running and create a database:
   ```sql
   SET PASSWORD FOR root@localhost='';
   CREATE DATABASE shems_test1;
   ```

4. **Configure Environment Variables**
   Create a `.env` file in the project root:
   ```env
   JWT_SECRET_KEY=<your_jwt_secret_key>
   ```
   Replace `<your_jwt_secret_key>` with a secure string (use `os.urandom(24)` for generation).

5. **Install Backend Dependencies**
   ```bash
   pip install -r requirements.txt
   ```

6. **Install Frontend Dependencies**
   ```bash
   cd frontend
   npm install
   ```

### Running the Application (2 Terminals)

1. **Start Backend Server**
   ```bash
   cd backend
   python3 app.py
   ```

2. **Start Frontend Server**
   ```bash
   cd frontend
   npm run dev
   ```

3. Visit the application at: [http://localhost:5173/](http://localhost:5173/)

---

## Documentation

For detailed project documentation, refer to the [CS-GY-6083 Project Documentation](https://github.com/Jflores427/SHEMS/files/14220673/CS-GY-6083.Project.1_.Project.2.Documentation.1.pdf).

---

## Acknowledgments

This project was developed as part of the **CS-GY 6083: Principles of Database Systems** course.

**Team Members:**
- Josue Flores
- Zheng-Chen Yao
