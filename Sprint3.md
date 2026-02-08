# Sprint 3 Report

**Project:** Gator-Club-Life 

**Frontend Team:** Abhigna Nimmagadda, Deekshita Kommi

**Backend Team:** Sri Ashritha Appalchity, Sonali Karneedi

### Videos
[Frontend and Backend](https://drive.google.com/drive/folders/1e_sp0JCpbC-Cb4-Nle8uBoK-_TgdPbhU?usp=sharing)

# Backend Documentation for Sprint 3

## Authentication & Sessions
- Implemented login using bcrypt for password verification.
- Created a session system using `fiber/session`.
- Added logout functionality to destroy sessions securely.
- Fully tested login and logout APIs with valid and invalid input.

## Clubs API

- Built the `/clubs` endpoint to fetch all club data.
- Added filtering by category (e.g., Academic, Health & Wellness).
- Updated the database schema with strict category validation.
- Connected frontend to dynamically retrieve club data.
- Unit tested all retrieval and filtering logic.

## Announcements System

- Created a new database table for announcements.
- Built `GET` and `POST` endpoints for announcements.
- Restricted `POST` to admin users only.
- Integrated frontend with backend for dynamic display.
- Tested successful creation, missing fields, and unauthorized access.

## API Documentation

- Integrated Swagger using Swaggo.
- Generated live API docs for login, logout, announcements, and clubs.
- Documentation accessible at `/swagger/*`.
![Swagger Documentation](ResultScreenshots/SwaggerDocumentation.png)


## Testing
We wrote and executed unit tests for all major backend features.

### Announcements API
- `TestGetAnnouncements` — fetches all announcements.
- `TestCreateAnnouncementSuccess` — validates successful admin posting.
- `TestCreateAnnouncementMissingFields` — checks missing field handling.
- `TestCreateAnnouncementNonAdmin` — confirms role-based restriction.
![Unit Tests for Announcements API](ResultScreenshots/AnnouncementsAPI_UnitTestResults.png)


### Clubs API
- `TestGetClubsNoCategory` — fetches all clubs.
- `TestGetClubsWithCategory` — validates category filter logic.
![Unit Tests for Clubs API](ResultScreenshots/ClubsAPI_UnitTestResults.png)

### Logout API
- `TestLogoutSuccess` — tests session termination on logout.
![Unit Tests for Logout API](ResultScreenshots/LogoutAPI_UnitTestResults.png)

### Login API
- `TestLoginSuccess` — successful login with correct credentials.
- `TestLoginMissingFields` — login with missing fields returns error.
- `TestLoginNonExistingUser` — blocks login for nonexistent users.
- `TestLoginInvalidPassword` — invalid password is rejected.
![Unit Tests for Login API](ResultScreenshots/LoginAPI_UnitTestResults.png)

### Users API
- `TestGetUsers` — fetches all users and checks for expected records.
- `TestCreateUser` — registers a new user and confirms the response omits the password field.
- `TestCreateUserInvalidJSON` — ensures malformed JSON is caught and returns a 400 error.
- `TestCreateUserMissingFields` — checks for proper error handling when required fields are missing.
- `TestDuplicateUserRegistration` — verifies that registering with an existing email is blocked.
![Unit Tests for Users API](ResultScreenshots/UsersAPI_UnitTestResults.png)

### Bookings API
- Created a new `/bookings` endpoint:
  - `GET /bookings`: Retrieves all bookings.
    - Supports optional filters: `user_id`, `event_id`, `booking_status`.
  - `POST /bookings`: Creates a new booking.
- Connected to `Booking` model in the database.
- Added input validation and error handling.
- Covered with unit tests for edge cases and success responses.

### Events API
- Built new routes:
  - `GET /events`: Returns all events, or filters by `club_id`.
  - `POST /events`: Allows new event creation.
- Added debug logging to inspect database behavior.
- Error messages included for no results, bad inputs, or DB failures.
- Data fetched dynamically on the frontend via Angular HTTP client.

---
# Frontend Doc:

## Register Component Enhancements
- Implemented **strong password validation**:
  - At least 8 characters
  - Includes uppercase, lowercase, numbers, and special characters
- Validated and **highlighted missing fields** in the form.
- Ensured proper error messages for mismatched passwords or weak input

---

## Login Page Error Handling

- **Developed specific error messages** for login issues:
  - **'Invalid email address'** for incorrect email formats.
  - **'Invalid email or account not found'** for non-existent emails.
  - **'Incorrect password'** for wrong passwords.
- **Added email domain validation** to accept only **@ufl.edu** emails.
- **Updated the database** to remove non-UF emails and reset sequential user IDs for consistency.

---

## Announcements Component
- Redesigned the **Announcements section** for visual clarity and structure.
- Used card-based layout to display announcements cleanly.
- Future-ready to support announcements from organizations dynamically.

---

## Organization Details Page

- **Created the Organization Details Page** to display important information about an organization.
- **Features**:
  - A **sidebar** with the organization name, officers, and advisors.
  - A **main content section** with the organization’s purpose, announcements, and events.
- **Integrated dynamic data fetching** using Angular’s HttpClient service based on route parameters.

---

## Events Page
- Designed a new **Events Page layout** with:
  - **Search functionality** for title, organization, or location.
  - **Sidebar filters** for event categories and date selection.
  - Improved event **card layout** and responsive design.
  - Each card has a **“Learn More”** link leading to the event detail page.

---
 
## Permits Component

- **Developed the Permits Component** to streamline the event permit submission process.
- **Features**:
  - A **welcome section** with instructions for users.
  - A **list of event types** for easy selection.
  - A **sidebar** to track progress through various permit stages (e.g., **Basic Information**, **Event Dates**).

---

## Dropdown Menu for Logged-In Users

- **Developed a dropdown menu** for logged-in users to access features like **Profile**, **Involvement**, **My Events**, **My Submissions**, and **Sign Out**.
- **Bug Fix**: Modified the mouseleave event to prevent the dropdown from closing prematurely, allowing it to stay open while interacting with the menu.

---

## My Profile (Dropdown Menu)
- Added **My Profile** in the user dropdown navigation.
- Displays user data captured during **registration**: Name, Email, Role, Join Date.
- Provides **editable fields** for:
  - Phone number (user-editable)
- Values persist using AuthService and local storage.

---

## My Events Page
- Created a basic **My Events** component.
- It will display a list of events the user has registered for or added.
- The component is routed via the user profile dropdown.

---

## My Submissions Component

- **Developed the My Submissions Component** with three tabs:
  - **Org. Registrations**
  - **My Permits**
  - **Application Submissions**
- **Features**:
  - A **search/filter interface** in the **My Permits** tab for better organization of submissions.

---

## Testing

In addition to the development of core features, we performed unit testing for various components to ensure they function correctly in isolation.

### Unit Testing:
- **Login Page**: Validated error handling and email validation.
- **Permits Component**: Verified form submission and event type selection.
- **Organization Details Page**: Ensured dynamic data loading worked as expected.
- **Dropdown Menu**: Validated that the dropdown remained open while interacting with menu items.

### Tools Used:
- **Jasmine and Karma**: For unit testing individual components.

### Test Results:
- **25 test cases passed successfully**.
- All tests were conducted with **zero failures**.

# Unit Test Results

*Total Tests:* 25  
*Failures:* 0

---

## 1. *OrganizationsComponent*
•⁠  ⁠should create

## 2. *EventsComponent*
•⁠  ⁠should filter by selected date
•⁠  ⁠should create component
•⁠  ⁠should reset filters
•⁠  ⁠should filter events by search query
•⁠  ⁠should filter by category

## 3. *PermitsComponent*
•⁠  ⁠should create

## 4. *ContactComponent*
•⁠  ⁠should create

## 5. *HomeComponent*
•⁠  ⁠should create

## 6. *AppComponent (Dropdown)*
•⁠  ⁠should create the app
•⁠  ⁠should toggle the dropdown visibility when clicked
•⁠  ⁠should hide the dropdown when clicking outside

## 7. *LoginComponent*
•⁠  ⁠should create the login component

## 8. *AuthService*
•⁠  ⁠should be created

## 9. *AuthGuard*
•⁠  ⁠should be created

## 10. *MyProfileComponent*
•⁠  ⁠should create the my-profile component

## 11. *AboutComponent*
•⁠  ⁠should create

## 12. *MyEventsComponent*
•⁠  ⁠should search events by title
•⁠  ⁠should create component
•⁠  ⁠should filter events by category
•⁠  ⁠should toggle favorite

## 13. *AnnouncementsComponent*
•⁠  ⁠should create
•⁠  ⁠should have all announcements with category "Event"

## 14. *OrganizationDetailsComponent*
•⁠  ⁠should create the organization details component

## 15. *MySubmissionsComponent*
•⁠  ⁠should create

Here’s a screenshot of the test results:

<img width="1512" alt="Screenshot 2025-03-31 at 11 30 35 PM" src="https://github.com/user-attachments/assets/7d168eae-9b61-4e09-8027-624da1920847" />


---

## Next Sprint Issues to be resolved

- **UI/UX Enhancements**: Improve the design and responsiveness of the **Organization Details Page**.
- **Improve the UI/UX of Permits and Organizations**
- **Work on Issues in the next sprint**: resolve the step wise permit stage on My Permits Page.
- **Enhance Registration Form Validation**: Add input validation for more complex fields.
- **Email Restrictions in Registration**: Ensure only `@ufl.edu` email addresses are accepted during sign-up.
- **Learn More Navigation**: Implement functionality in Events page to route to a detailed view when clicking "Learn More".
- **Admin View Setup**: Begin building admin-specific features and pages for event and organization management.

---

## Conclusion

With the addition of the **strong validation in registration**, **Login Page Error Handling** ,structured **announcements**, dynamic **event filtering**, **Permits Component**,**personalized profile page**, **My Events Page** and **My Submissions Component**, along with dynamic data fetching and bug fixes, we have significantly improved the user experience in this sprint. The successful completion of testing ensures the stability of the application, allowing us to confidently move forward with additional features in Sprint 4.


