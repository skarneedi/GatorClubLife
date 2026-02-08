	package routes_test

	import (
		"bytes"
		"encoding/json"
		"fmt"
		"net/http"
		"net/http/httptest"
		"testing"

		"backend/database"
		"backend/middleware"
		"backend/routes"

		"github.com/gofiber/fiber/v2"
		"github.com/gofiber/fiber/v2/middleware/session"
		"golang.org/x/crypto/bcrypt"
	)

	func setupLoginApp() *fiber.App {
		app := fiber.New()
		store := session.New()
		routes.SetStore(store)
		middleware.SetStore(store)

		app.Use(middleware.SessionContext()) // ✅ Needed for session injection
		app.Post("/login", routes.Login)
		return app
	}

	func initTestDBForLogin() {
		database.InitDB()
		if err := database.DB.AutoMigrate(&database.User{}); err != nil {
			panic(fmt.Sprintf("Failed to migrate User table: %v", err))
		}
		database.DB.Exec("DELETE FROM users")
		fmt.Println("Test DB initialized and users table cleared for Login tests.")
	}

	func TestLoginSuccess(t *testing.T) {
		t.Log("Starting TestLoginSuccess")
		initTestDBForLogin()
		app := setupLoginApp()

		password := "password123"
		hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			t.Fatalf("Error hashing password: %v", err)
		}
		testUser := database.User{
			UserName:     "loginuser",
			UserEmail:    "loginuser@example.com",
			UserRole:     "member",
			UserPassword: string(hashed),
		}
		if err := database.DB.Create(&testUser).Error; err != nil {
			t.Fatalf("Error creating test user: %v", err)
		}
		t.Log("Test user for login created successfully.")

		loginPayload := map[string]string{
			"email":    "loginuser@example.com",
			"password": password,
		}
		body, _ := json.Marshal(loginPayload)
		req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")

		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("Error making POST /login request: %v", err)
		}
		if resp.StatusCode != http.StatusOK {
			t.Fatalf("Expected status 200 for login success, got %v", resp.StatusCode)
		}

		var loginResp map[string]interface{}
		if err := json.NewDecoder(resp.Body).Decode(&loginResp); err != nil {
			t.Fatalf("Error decoding login response: %v", err)
		}
		t.Logf("Login response: %+v", loginResp)

		if loginResp["message"] != "Login successful" {
			t.Errorf("Expected 'Login successful', got '%s'", loginResp["message"])
		} else {
			t.Log("TestLoginSuccess passed.\n")
		}
	}

	func TestLoginFailure(t *testing.T) {
		t.Log("Starting TestLoginFailure")
		initTestDBForLogin()
		app := setupLoginApp()

		password := "password123"
		hashed, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
		if err != nil {
			t.Fatalf("Error hashing password: %v", err)
		}
		testUser := database.User{
			UserName:     "failuser",
			UserEmail:    "failuser@example.com",
			UserRole:     "member",
			UserPassword: string(hashed),
		}
		if err := database.DB.Create(&testUser).Error; err != nil {
			t.Fatalf("Error creating test user: %v", err)
		}
		t.Log("Test user for login failure created successfully.")

		loginPayload := map[string]string{
			"email":    "failuser@example.com",
			"password": "wrongpassword",
		}
		body, _ := json.Marshal(loginPayload)
		req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")

		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("Error making POST /login request: %v", err)
		}
		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("Expected status 401, got %v", resp.StatusCode)
		}

		var errorResp map[string]string
		if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
			t.Fatalf("Error decoding error response: %v", err)
		}
		t.Logf("Login failure response: %+v", errorResp)

		if errorResp["message"] != "Incorrect password" {
			t.Errorf("Expected 'Incorrect password', got '%s'", errorResp["message"])
		} else {
			t.Log("TestLoginFailure passed.\n")
		}
	}

	func TestLoginMissingFields(t *testing.T) {
		t.Log("Starting TestLoginMissingFields")
		initTestDBForLogin()
		app := setupLoginApp()

		loginPayload := map[string]string{
			"email": "test@example.com",
		}
		body, _ := json.Marshal(loginPayload)
		req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")

		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("Error making POST /login request: %v", err)
		}
		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("Expected status 401 for missing fields, got %v", resp.StatusCode)
		}

		var errorResp map[string]string
		if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
			t.Fatalf("Error decoding error response: %v", err)
		}

		if errorResp["message"] == "" {
			t.Error("Expected an error message for missing fields, but got an empty string")
		} else {
			t.Log("TestLoginMissingFields passed.\n")
		}
	}

	func TestLoginNonexistentUser(t *testing.T) {
		t.Log("Starting TestLoginNonexistentUser")
		initTestDBForLogin()
		app := setupLoginApp()

		loginPayload := map[string]string{
			"email":    "nobody@example.com",
			"password": "somepassword",
		}
		body, _ := json.Marshal(loginPayload)
		req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")

		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("Error making POST /login request: %v", err)
		}

		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("Expected status 401 for nonexistent user, got %v", resp.StatusCode)
		}

		var errorResp map[string]string
		if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
			t.Fatalf("Error decoding error response: %v", err)
		}

		if errorResp["message"] != "Email not found" {
			t.Errorf("Expected 'Email not found', got '%s'", errorResp["message"])
		} else {
			t.Log("TestLoginNonexistentUser passed.\n")
		}
	}

	func TestLoginMissingEmail(t *testing.T) {
		t.Log("Starting TestLoginMissingEmail")
		initTestDBForLogin()
		app := setupLoginApp()

		loginPayload := map[string]string{
			"password": "somepassword",
		}
		body, _ := json.Marshal(loginPayload)
		req := httptest.NewRequest("POST", "/login", bytes.NewBuffer(body))
		req.Header.Set("Content-Type", "application/json")

		resp, err := app.Test(req)
		if err != nil {
			t.Fatalf("Error making POST /login request: %v", err)
		}

		if resp.StatusCode != http.StatusUnauthorized {
			t.Fatalf("Expected status 401 for missing email, got %v", resp.StatusCode)
		}

		var errorResp map[string]string
		if err := json.NewDecoder(resp.Body).Decode(&errorResp); err != nil {
			t.Fatalf("Error decoding error response: %v", err)
		}

		if errorResp["message"] == "" {
			t.Error("Expected an error message for missing email, got empty string")
		} else {
			t.Log("TestLoginMissingEmail passed.\n")
		}
	}
