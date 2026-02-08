package routes_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/database"
	"backend/routes"

	"github.com/gofiber/fiber/v2"
)

// setupUserApp initializes a new Fiber app with the user endpoints.
func setupUserApp() *fiber.App {
	app := fiber.New()
	app.Get("/users", routes.GetUsers)
	app.Post("/users/create", routes.CreateUser)
	return app
}

// initTestDB initializes the database for testing.
// It runs AutoMigrate for the User model and clears the users table.
func initTestDB() {
	// Initialize the database connection.
	database.InitDB()
	// Auto-migrate the User model.
	err := database.DB.AutoMigrate(&database.User{})
	if err != nil {
		panic(fmt.Sprintf("Failed to migrate User table: %v", err))
	}
	// Clear any existing data.
	database.DB.Exec("DELETE FROM users")
	fmt.Println("Test DB initialized and users table cleared.")
}

func TestGetUsers(t *testing.T) {
	t.Log("Starting TestGetUsers")
	initTestDB()
	app := setupUserApp()

	// Insert a test user.
	testUser := database.User{
		UserName:     "user1",
		UserEmail:    "user1@example.com",
		UserRole:     "member",
		UserPassword: "dummy", // Not used in GetUsers.
	}
	if err := database.DB.Create(&testUser).Error; err != nil {
		t.Fatalf("Error creating test user: %v", err)
	}
	t.Log("Test user created successfully.")

	req := httptest.NewRequest("GET", "/users", nil)
	req.Header.Set("Content-Type", "application/json")
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making GET /users request: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected status 200, got %v", resp.StatusCode)
	}

	var users []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&users); err != nil {
		t.Fatalf("Error decoding response: %v", err)
	}

	t.Logf("Retrieved %d user(s).", len(users))
	if len(users) == 0 {
		t.Error("Expected at least one user in response, got 0")
	} else {
		t.Log("TestGetUsers passed.\n")
	}
}

func TestCreateUser(t *testing.T) {
	t.Log("Starting TestCreateUser")
	initTestDB()
	app := setupUserApp()

	payload := map[string]string{
		"user_name":     "testuser",
		"user_email":    "testuser@example.com",
		"user_role":     "member",
		"user_password": "password123",
	}
	body, _ := json.Marshal(payload)
	req := httptest.NewRequest("POST", "/users/create", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making POST /users/create request: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected status 200, got %v", resp.StatusCode)
	}

	var createdUser map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&createdUser); err != nil {
		t.Fatalf("Error decoding response: %v", err)
	}

	t.Logf("User created: %+v", createdUser)
	if _, exists := createdUser["user_password"]; exists {
		t.Error("Expected user_password to be cleared from response, but it is present")
	}
	if createdUser["user_id"] == nil {
		t.Error("Expected user_id to be present in response, but it is nil")
	}
	t.Log("TestCreateUser passed.\n")
}

func TestCreateUserInvalidJSON(t *testing.T) {
	t.Log("Starting TestCreateUserInvalidJSON")
	initTestDB()
	app := setupUserApp()

	invalidJSON := []byte(`{"user_name": "invalid user", "user_email": "invalid@example.com",`)
	req := httptest.NewRequest("POST", "/users/create", bytes.NewBuffer(invalidJSON))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making POST /users/create request: %v", err)
	}

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("Expected status 400 for invalid JSON, got %v", resp.StatusCode)
	}

	var errorResp map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
		t.Fatalf("Error decoding error response: %v", err)
	}

	if errorMsg, ok := errorResp["error"]; !ok || errorMsg == "" {
		t.Error("Expected an error message for invalid JSON")
	} else {
		t.Logf("Received error message: %s", errorMsg)
	}
	t.Log("TestCreateUserInvalidJSON passed.\n")
}

func TestCreateUserMissingFields(t *testing.T) {
	t.Log("Starting TestCreateUserMissingFields")
	initTestDB()
	app := setupUserApp()

	payload := map[string]string{
		"user_email":    "missing@example.com",
		"user_password": "password123",
	}
	body, _ := json.Marshal(payload)
	req := httptest.NewRequest("POST", "/users/create", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making POST /users/create request: %v", err)
	}

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("Expected status 400 for missing fields, got %v", resp.StatusCode)
	}

	var errorResp map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
		t.Fatalf("Error decoding error response: %v", err)
	}

	if errorMsg, ok := errorResp["error"]; !ok || errorMsg == "" {
		t.Error("Expected an error message for missing fields")
	} else {
		t.Logf("Received error message: %s", errorMsg)
	}
	t.Log("TestCreateUserMissingFields passed.\n")
}

func TestDuplicateUserRegistration(t *testing.T) {
	t.Log("Starting TestDuplicateUserRegistration")
	initTestDB()
	app := setupUserApp()

	payload := map[string]string{
		"user_name":     "duplicateUser",
		"user_email":    "duplicate@example.com",
		"user_role":     "member",
		"user_password": "password123",
	}
	body, _ := json.Marshal(payload)
	req := httptest.NewRequest("POST", "/users/create", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	// First registration should succeed.
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making first POST /users/create request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected status 200 for first registration, got %v", resp.StatusCode)
	}
	t.Log("First registration passed.")

	// Second registration with the same email.
	resp2, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making second POST /users/create request: %v", err)
	}

	if resp2.StatusCode == http.StatusOK {
		t.Error("Expected duplicate registration to fail, but it returned status 200")
	} else {
		var errorResp map[string]string
		if err := json.NewDecoder(resp2.Body).Decode(&errorResp); err != nil {
			t.Fatalf("Error decoding error response for duplicate registration: %v", err)
		}
		t.Logf("Duplicate registration error response: %+v", errorResp)
	}
	t.Log("TestDuplicateUserRegistration passed.\n")
}
