
# Sprint 4 Report

**Project:** Gator-Club-Life 

**Frontend Team:** Abhigna Nimmagadda, Deekshita Kommi  
**Backend Team:** Sri Ashritha Appalchity, Sonali Karneedi

### Videos
[Frontend and Backend](https://drive.google.com/drive/folders/1Z7viHAD-hF8E0bMIbDpN7FGg0BqeDwxI?usp=sharing)

# Backend Documentation for Sprint 4

## Authentication & Session Management
- Implemented secure session destruction on backend restart to prevent stale session reuse.
- Ensured session persistence across server restarts using `fiber/session`.
- Extended login middleware to automatically associate `SubmittedBy` using active session data.
- Added full logout functionality to safely destroy sessions.
- Fully tested authentication flows with valid and invalid input cases.

## Event Permit Submission System
- Designed and implemented the full backend pipeline for event permit processing:
  - Defined comprehensive database schema for event permits, including nested slots and documents.
  - Built a single `/event-permits/submit` POST endpoint that accepts and stores full submission payloads.
  - Linked frontend to backend to ensure data flow from UI to database is seamless.
  - Connected user session data to submission payloads to track who submitted each permit.

## My Submissions Feature
- Added a new `MySubmissions` table to store user-specific submission data.
- Created APIs to retrieve submissions filtered by the authenticated user’s email.
- Connected frontend dashboard to display a logged-in user’s personal submissions dynamically.
- Ensured all submission tracking and filtering logic reflects the real-time database state.

## Organizations & Clubs Enhancements
- Built endpoints to:
  - Fetch a single organization by its ID.
  - Retrieve officers associated with a specific club.
- Integrated backend with the frontend to support dynamic organization detail pages.
- Improved announcement and club retrieval APIs with category and ID-based filtering.

## Announcements System Improvements
- Enhanced announcement APIs to:
  - Support admin-only creation via POST.
  - Filter announcements by club ID for better personalization.
- Connected frontend display logic with backend filters for real-time data updates.

## Sprint 4: Backend Unit Testing

### Goals of Sprint 4 Testing
The primary goal of unit testing in Sprint 4 was to:
- Ensure reliability and correctness of newly implemented backend features.
- Validate security and access control, especially around authentication and session-based data access.
- Detect and handle edge cases and error flows early.
- Build a scalable test foundation for future sprints with reusable utilities and seeded data.

### Test Structure & Strategy
All tests were organized into the following categories:
1. Middleware Tests – Validate access control logic.
2. Authentication Tests – Cover login and logout flows.
3. Event Permit Tests – Ensure correct storage, retrieval, and filtering.
4. Announcements Tests – Enforce role-based creation and validate filtering.
5. Clubs & Organizations Tests – Ensure accurate querying by ID or category.
6. User API Tests – Cover registration, validation, and duplication errors.

### Middleware Testing
- `TestRequireAuth_BlocksWithoutSession`  
  Confirms unauthorized access is blocked without a session.
- `TestRequireAuth_AllowsWithSession`  
  Grants access to authenticated users with valid sessions.
![Unit Tests for Middleware](ResultScreenshots/Middleware_S4_UnitTestResults.png)

### Login & Logout API Testing
- `TestLoginSuccess` – Valid login with correct credentials.
- `TestLoginFailure` – Handles incorrect password.
- `TestLoginMissingFields` – Missing `email` or `password`.
- `TestLoginNonexistentUser` – User doesn't exist.
- `TestLoginMissingEmail` – Missing `email` field.
- `TestLogoutSuccess` – Confirms session destruction on logout.
![Unit Tests for Login API](ResultScreenshots/LoginAPI_S4_UnitTestResults.png)
![Unit Tests for Logout API](ResultScreenshots/LogoutAPI_S4_UnitTestResults.png)

### Event Permits Testing
- `TestSubmitFullEventPermit_DBLogic` – Validates full DB persistence.
- `TestSubmitFullEventPermit_Endpoint` – Endpoint request to DB response.
- `TestGetUserSubmissions_FilteredByEmail` – Retrieves session-specific submissions.
![Unit Tests for Event Permit API](ResultScreenshots/EventPermitsAPI_S4_UnitTestResults.png)

### Announcements Testing
- `TestGetAnnouncements` – Fetch all announcements.
- `TestCreateAnnouncementSuccess` – Admin-only creation.
- `TestCreateAnnouncementMissingFields` – Incomplete data triggers errors.
- `TestCreateAnnouncementNonAdmin` – Non-admin creation is blocked.
![Unit Tests for Announcements API](ResultScreenshots/AnnouncementsAPI_S4_UnitTestResults.png)

### Clubs Testing
- `TestGetClubsNoCategory` – No filter applied.
- `TestGetClubsWithCategory` – Valid category filter.
- `TestGetClubByID_Basic` – Valid ID retrieval.
- `TestGetClubByID_NotFound` – Invalid ID returns 404.
- `TestGetOfficersByClubID_Basic` – Retrieve officer list.
- `TestGetOfficersByClubID_EmptyList` – Handle no officers case.
![Unit Tests for Clubs API](ResultScreenshots/ClubsAPI_S4_UnitTestResults.png)

### Users API Testing
- `TestGetUsers` – Fetch all users.
- `TestCreateUser` – Valid new user registration.
- `TestCreateUserInvalidJSON` – Handles malformed request.
- `TestCreateUserMissingFields` – Missing required fields.
- `TestDuplicateUserRegistration` – Prevents duplicates.
![Unit Tests for Users API](ResultScreenshots/UsersAPI_S4_UnitTestResults.png)


## Frontend Development Overview

### 1. Permits Workflow (End-to-End Implementation)
- Developed a complete multi-step Permits workflow:
  - Step 1: Basic Information – Captures core event details.
  - Step 2: Event Dates – Calendar integration with FullCalendar.
  - Step 3: Additional Forms – File upload and notes support.
  - Step 4: Final Review – Consolidated permit summary view.
- Integrated EventPermitService for shared state across steps.
- Added sidebar UI to visually track user progress.

### 2. Organizations Page
- Built a fully functional Organizations listing page.
- Features:
  - Dynamic search bar (by name, location, or keywords).
  - Sidebar category filters for streamlined browsing.
  - Interactive cards with routing to organization detail view.
- Applied responsive design using TailwindCSS utilities.

### 3. Organization Details Page
- Dynamically loads organization data using route parameters.
- Fetches and displays:
  - Officer/Advisor data.
  - Purpose section.
  - Linked announcements and upcoming events.
- Modular layout with sidebar and content zones.

### 4. My Submissions Component
- Structured into three tabs: My Permits, Org. Registrations, and Applications.
- After discussion we decided to only have My Permits and removed the remaining tabs.
- Built My Permits section with:
  - Search and filter functionality.
  - Status chips for Completed, Pending, and Denied permits.
  - Clean table layout to view past submissions.

### 5. My Events Component
- Developed an interactive view showing a user’s saved or RSVP'd events.
- Included:
  - Filter by category.
  - Search by event name.
  - Favorite toggling.

### 6. Login Workflow Debugging
- Resolved login-related Cypress testing bugs:
  - Fixed routing issues during Cypress test login.
  - Ensured proper form submission triggers via button selectors.
- Skipped login in specific tests by intercepting login routes where needed.

---

### 7. Registration and Authentication Enhancements

- **UF Email Restriction**:  
  User registration is now restricted to `@ufl.edu` domains, ensuring only University of Florida students can register.

- **Password Visibility Toggle**:  
  Implemented show/hide buttons for both password and confirm-password fields to improve user accessibility during signup.

- **Password Strength Meter**:  
  A live visual indicator of password strength (Weak, Moderate, Strong) was added to encourage stronger security practices.

- **Username and Email Availability Checks**:  
  Real-time validation was added from the frontend to check for existing usernames and emails before form submission.

---

### 8. Admin Role Support and Dashboard

- **Role Selection During Registration**:  
  Users now choose their role (either `admin` or `member`) at the time of registration.

- **Role-Based Login Redirection**:  
  After successful login:
  - Members are redirected to the Home page.
  - Admins are redirected to a dedicated Admin Dashboard.

- **Admin Dashboard**:  
  - Accessible only to users with the `admin` role.
  - Hidden from regular users (members).
  - Includes basic features like managing users, viewing events, and posting announcements.

---

### 9. Event Details and RSVP Functionality

- **Learn More Modal for Events**:  
  Users can now view detailed information for each event in a modal, improving the user experience without leaving the page.

- **RSVP and Undo RSVP Support**:  
  Users can RSVP for an event and undo it later if needed. These actions update instantly and are backed by real-time UI changes.

---

### 10. Website UI Styling

- General UI improvements were made across all components for a cleaner, more responsive, and intuitive design.
- The homepage, event listings, registration and admin pages were restyled and optimized.

---

## Testing Accomplishments

### Unit Testing (25 Test Cases)
All unit tests were executed using Jasmine + Karma, with zero failures.  

**Highlights:**
- Login Error Handling  
- Sidebar Dropdown (Click, MouseLeave, Toggle)
- Organization Cards Filtering  
- Permit Navigation Logic  
- Dynamic Page Load for Org Details

**Unit Test Coverage Snapshot:**

| Component | Test Cases |
|-----------|------------|
| OrganizationsComponent | should create |
| EventsComponent | create, search, category filtering |
| PermitsComponent | should create |
| LoginComponent | error handling, validation |
| AppComponent (Dropdown) | toggle, click outside, render |
| MySubmissionsComponent | should create |
| MyProfileComponent | editable phone, toggle edit |
| AuthGuard, AuthService | creation, guards |
| OrganizationDetailsComponent | dynamic data test |
| AnnouncementsComponent | structure, data render |

**Total Unit Tests:** 25  
**Failures:** 0  
**Screenshot:** 
![image](https://github.com/user-attachments/assets/91f7c216-9787-4eab-92e2-95ece4f3ad9c)
![image](https://github.com/user-attachments/assets/c3ffa612-a0a5-48a2-8559-55818892ca39)
![image](https://github.com/user-attachments/assets/c65eeac9-da6d-42e0-8c76-b8e7023d4db5)
![image](https://github.com/user-attachments/assets/3b534b20-c507-4a76-82b8-3d09b0d21a57)
![image](https://github.com/user-attachments/assets/a16d91a1-5a75-4ae0-96b4-2e90200eeac2)
![image](https://github.com/user-attachments/assets/55bbaedd-f47f-4b17-a08e-6aab178961f2)
![image](https://github.com/user-attachments/assets/f778cd99-466f-4a66-8352-c9b7a69f3294)
![image](https://github.com/user-attachments/assets/0996332b-ad8e-4d2f-a8a1-4ce3c83101af)
![image](https://github.com/user-attachments/assets/9d1fe894-7532-43ad-a17e-31e73603ccf6)
![image](https://github.com/user-attachments/assets/01ba254d-39d4-4b70-8daf-6ba91b120309)
![image](https://github.com/user-attachments/assets/ae8d1912-b826-4393-b536-2cd61066bdca)
![image](https://github.com/user-attachments/assets/16d1a119-aba0-484e-8c7e-4ba1256ffbc6)
![image](https://github.com/user-attachments/assets/0e166870-fed7-4b46-a369-800d188aab1d)

### Cypress End-to-End Testing

- Wrote full E2E Cypress workflows for:
![image](https://github.com/user-attachments/assets/0e5976cc-c613-442f-b73f-c9715627222e)

![image](https://github.com/user-attachments/assets/5e89618c-5435-41d6-abdc-c8d3583fca53)

- Used `cy.intercept()` and dynamic assertions to mock APIs where applicable.

**Cypress Highlights:**
- `cy.get('button[type="submit"]')` for form auth.
- `.organization-card` load tests passed after adding `timeout`.

## Bugs Fixed / Issues Closed
- Login Submit Selector bug: corrected Cypress login trigger.
- Organization Filtering Cypress Error: fixed missing DOM issue.
- Mouseleave on Dropdown: dropdown would disappear prematurely.
- Permit Sidebar Visibility: fixed render logic per step.
- Cypress Timeout & Test Detection: resolved no-tests-found issue.

## Overview of Work Completed

This sprint focused on improving the core user flows, role-based functionality, and event engagement capabilities of the GatorClubLife platform. 

## Conclusion
This final sprint encapsulated the complete end-to-end implementation of the Permits workflow, Organization discovery, user profile experience, and submission management. By ensuring robust Cypress automation and unit test coverage, the application has reached a feature-complete and test-validated state.
