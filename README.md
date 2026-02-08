
# Gator-Club-Life

Gator-Club-Life is a university event management system designed to streamline club coordination, event permit submissions, announcements, and student engagement. It features an Angular frontend and a Go Fiber backend with SQLite (via GORM), providing a seamless experience for students, organizers, and administrators.

## Description

Gator-Club-Life enables users to:

- Browse clubs and discover university events
- Submit and track event permits through a guided workflow
- View announcements specific to clubs and events
- Manage personal submissions and bookings
- Allow admins to post announcements and oversee event processes

This project demonstrates secure session management, structured workflows, and full-stack integration to enhance campus engagement.

## Features

- **Authentication & Sessions**: Secure login/logout with role-based access (member, organizer, admin)
- **Event Permit Workflow**: Multi-step event submission and tracking
- **My Submissions Dashboard**: Personalized tracking of event permits
- **Club Directory**: Filterable list of university clubs by category
- **Announcements System**: Admin-restricted announcement posting

## Tech Stack

- **Frontend**: Angular, Angular Material, Tailwind CSS, Jasmine & Karma (unit testing)
- **Backend**: Go, Fiber Framework, GORM ORM, SQLite, Swaggo (API docs), Go Testing
- **Database**: SQLite (lightweight, embedded)
- **Other Tools**: Swagger for API testing, CORS-enabled backend for smooth integration

## Installation

### Clone the Repository
```bash
git clone https://github.com/skarneedi/Gator-Club-Life.git
cd Gator-Club-Life
```

### Backend Setup
```bash
cd backend
go mod tidy
go run main.go
```
- Backend runs at: `http://localhost:8080`
- Access API Docs: `http://localhost:8080/swagger/index.html`

### Frontend Setup
```bash
cd ../frontend
npm install
ng serve
```
- Frontend available at: `http://localhost:4200`

Ensure both backend and frontend are running for full functionality.

## Usage

- Open your browser at `http://localhost:4200`
- Register or log in (roles: **member**, **admin**)
- Explore:
  - Club listings
  - Announcements
  - Submit event permits
  - Track submissions via "My Submissions"
- Developers: Test backend routes via Swagger:
  ```
  http://localhost:8080/swagger/index.html
  ```

## Architecture

- **Angular Frontend**: User interface for students, organizers, and admins
- **Go Fiber Backend**: RESTful APIs managing authentication, clubs, events, and permits
- **SQLite Database**: Stores users, clubs, events, announcements, and permit data
- **Swagger Docs**: Auto-generated API documentation for backend endpoints

## Sprint Reports

- [Sprint 1 Report](https://github.com/skarneedi/Gator-Club-Life/blob/main/Sprint1.md)
- [Sprint 2 Report](https://github.com/skarneedi/Gator-Club-Life/blob/main/Sprint2.md)
- [Sprint 3 Report](https://github.com/skarneedi/Gator-Club-Life/blob/main/Sprint3.md)
- [Sprint 4 Report](https://github.com/skarneedi/Gator-Club-Life/blob/main/Sprint4.md)

## Developed By

- **Frontend**: Kommi Deekshita, Abhigna Nimmagadda
- **Backend**: Sri Ashritha Appalchity, Sonali Karneedi

For contributions or improvements, feel free to fork the repo and submit pull requests.

## License

This project is licensed under the MIT License. See [LICENSE](https://github.com/skarneedi/Gator-Club-Life/blob/main/LICENSE) for details.
