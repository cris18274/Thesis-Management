# Integrated Thesis and Graduation Process Management System

## Project Overview
This project is an **Integrated Thesis Management System** designed to digitalize and streamline the graduation process for students, professors, and administrative staff. It provides a robust platform for tracking academic requirements, assigning thesis tutors/reviewers, managing project stages, and scheduling thesis defenses.

## Architecture
The system follows a modern full-stack architecture:
- **Backend (`thesis_api/`)**: A RESTful API built with Python, Flask, and Flask-SQLAlchemy. It integrates with a MySQL database to manage complex academic data relationships and enforce business logic securely.
- **Frontend (`thesis-dashboard/`)**: A dynamic Single Page Application (SPA) built with React.js and styled with Tailwind CSS. It provides a responsive and interactive user interface for various user roles.

## Core Features
- **Student & Professor Management**: Track academic profiles, library/laboratory clearance statuses, and faculty availability.
- **Thesis Lifecycle Tracking**: Seamless promotion of theses through different stages (`Thesis I` -> `Thesis II` -> `Defense`).
- **Dynamic Role Assignment**: Assign professors as Tutors, Co-Tutors, or Reviewers (Committee members) without conflicting roles.
- **Defense Scheduling**: Log thesis defenses, set modalities (In-person/Virtual), and record final grades.

## Getting Started
Please refer to the inner folders (`thesis_api/` and `thesis-dashboard/`) for specific setup instructions, dependency lists, and environment configurations.
## To RUn de code:
You can download the file.zip or clone the github, and go to thesis_api folder and run the (`python requeriment.txt`) to install all requeriments that you need, then in this folder you can run (`python app.py`), and go to the thesis-dashboard and run (`npm run dev`), also if you need to update the tables that you have in your current docker container in mysql, I add the code (`python recreate_db.py`) this code drop the current tables. 

