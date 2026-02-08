# Sprint 1 Report

## Project: Gator-Club-Life

### Videos
[Frontend and Backend](https://drive.google.com/drive/u/0/folders/1Dw_n6O9TFvmdnwg2n4mc7txR4c5agkhE)


### Contributors
- **Frontend:** Kommi Deekshita, Abhigna Nimmagadda  
- **Backend:** Sri Ashritha Appalchity, Sonali Karneedi  

---

## Backend
### 1. User Stories Worked On
#### User Story #1 - User Account Creation
**Description:**  
_As a user, I want to create an account so that I can access the platform._  

**Acceptance Criteria:**
- The API should allow new users to be registered.
- The system should validate user input before storing it in the database.

#### User Story #2 - Retrieve Users List
**Description:**  
_As an admin, I want to retrieve a list of all users so that I can see who is registered._  

**Acceptance Criteria:**
- The API should return a list of all registered users in JSON format.

### 2. Planned Issues
The team aimed to achieve the following during Sprint 1:
- Set up a Golang backend with SQLite and GORM.
- Define and implement a relational database schema.
- Connect the backend to SQLite using GORM.
- Establish API endpoints for user management.
- Test all functionalities using Postman.
- Implement API documentation using Swagger.
- Use an advanced routing framework such as Gorilla Mux, Fiber, or Chi instead of Go’s built-in router.

### 3. Unfinished Issues
- Swagger API documentation was planned but not implemented in Sprint 1.
- Migration from Go’s built-in HTTP router to a more advanced routing framework (Gorilla Mux, Fiber, or Chi) was planned but not completed.

### 4. Backend Development Summary
#### Backend Setup
- **Tech Stack:** Go, SQLite, GORM
- **Frameworks Used:** GORM (ORM), Gin (Routing, API handling)

#### API Implementations
- **User APIs:**
  - `GET /users` – Fetch all users
  - `POST /users/create` – Add a new user

#### Database Connectivity
- Established using GORM and SQLite.
- DB initialization in `database.go` (Ref: `InitDB()` function).
- **Schema Design:** Implemented users, clubs, events, and bookings tables (Ref: `database_schema.txt`).

#### Routing
- Handled using Go’s built-in HTTP router.
- Defined in `main.go`.

### 5. Testing
#### Postman Testing Results
- `GET /users` – Successfully fetched user data.
- `POST /users/create` – Successfully added a new user.
- Verified data persistence in SQLite.

---

## Frontend
### 1. User Stories Worked On
- As a user, I want a high-quality and reliable application, so that I can have a smooth and enjoyable experience.
- As a user, I want a well-structured and intuitive navigation bar, so that I can easily move between different sections of the application.
- As a user, I want a visually appealing and modern UI, so that my experience feels engaging and up-to-date.
- As a user, I want the application to feel smooth and responsive, so that I don’t experience lag or delays when interacting with it.
- As a user, I want seamless navigation between different sections of the application, so that I don’t have to wait for page reloads.
- As a user, I want a fast and secure way to log into the application, so that I can quickly access my account.
- As a user, I want a responsive navigation bar, so that I can easily move between different sections of the application.
- As a user, I want to see a list of available sports, so that I can quickly choose the sport I want to book.
- As a user, I want each sport in the grid to have a recognizable logo, so that I can easily identify sports visually.
- As a user, I want to view available courts for each sport, so that I can select a court based on availability.
- As a user, I want my personal information to be securely stored, so that I don’t have to re-enter my details for future interactions and bookings.
- As a user, I want my court bookings to be accurately recorded and managed, so that I don’t face any scheduling conflicts.
- As a user, I want detailed information about each court to be available, so that I can make an informed decision before booking.
- As a user, I want the ability to choose from multiple courts for each sport, so that I can find the best option for my needs.
- As a user, I want to create an account securely, so that I can access my bookings and preferences easily.
- As a user, I want to see available court slots in real-time, so that I can book a time that suits me.
- As a user, I want each booking to include a specific time slot, so that I can be sure about my reservation details.
- As a user, I want to be prevented from registering multiple times with the same details, so that my account remains unique and secure.
- As a user, I want to search for courts based on location, so that I can find courts near me.
- As a user, I want a well-documented and reliable system, so that my experience remains consistent and any issues are resolved efficiently.

