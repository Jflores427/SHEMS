# Project: Smart Home Energy Management System
This is a database project using database queries to implement features and response the user requests.

## Description:
During 2022, the average U.S. residential retail electricity price was 15.12 cents/kWh, an 11% increase from 13.66 cents/kWh in 2021. After adjusting for inflation, U.S. residential electricity prices went up by 2.5% overall. This is likely due to the proliferated use of various smart electrical devices within the home including, but not limited to: refrigerators, televisions, microwaves, ovens, and speakers. 

As such, modern homeowners need a solution that will empower them to reclaim control of their energy expenses within their homes, prompting the creation of Smart Home Energy Management Systems (SHEMS). Concerning these systems, the integration of a database is a crucial aspect of their overall functionality, enabling users to access accurate data logs of their electrical usage for their devices. 

By examining this data, homeowners can observe trends in their energy use relating to their devices and subsequently determine what changes to their device usage are needed based on their budget. As such, this project explores this facet of these SHEMS and delves into a potential schema for these infrastructures.


## Getting Started
### Enviromnent:
- Python version: python 3.11.6
- Flask version: 3.0.0
- MySQL version: 8.2.0

### Installing
- Clone this repository and navigate to directory
```bash
git clone https://github.com/YZCUS/SHEMS.git
cd SHEMS
```

- Set up a virtual environment
  
-- For windows:
```bash
python3 -m venv venv
.\venv\Scripts\activate
```
-- For macOS and Linux:
```bash
python3 -m venv venv
source venv/bin/activate
```

- Install Required Packages
```bash
pip install -r requirements.txt
```

-- For Front-End Dependencies (within frontend)
```bash
npm install
```

### Executing program
  
- Run Backend Server (Open Command Line terminal to start Server)
```bash
cd backend
python3 app.py
```
- Run Frontend Server with Vite
```bash
cd frontend
npm run dev
```
Visit http://localhost:5173/

### Acknowledgments
This is a team project for CS-GY 6083 Principle of databases systems.
Team members: Zheng-Chen Yao , Josue Flores

### Documentation

[CS-GY-6083 Project 1_ Project 2 Documentation.pdf](https://github.com/Jflores427/SHEMS/files/14220673/CS-GY-6083.Project.1_.Project.2.Documentation.1.pdf)
