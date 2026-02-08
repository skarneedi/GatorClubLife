package routes_test

import (
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"

	"backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

// setupLogoutApp initializes a new Fiber app with a session store and the /logout endpoint.
func setupLogoutApp() *fiber.App {
	app := fiber.New()

	// Create a new session store instance.
	store := session.New()

	// Assign this store to the global Store variable in routes so Logout can use it.
	routes.SetStore(store)

	// Register the logout route with the app.
	app.Post("/logout", routes.Logout)

	return app
}

// TestLogoutSuccess verifies that a POST /logout call returns a 200 status and a success message
// when the session is successfully retrieved and destroyed.
func TestLogoutSuccess(t *testing.T) {
	t.Log("Starting TestLogoutSuccess")

	// We don’t really need the DB here because logout doesn’t interact with it,
	// but if your test framework expects DB initialization, you can do it here.

	app := setupLogoutApp()

	// Make a POST request to /logout with no session data (or a dummy cookie).
	req := httptest.NewRequest("POST", "/logout", nil)
	req.Header.Set("Content-Type", "application/json")

	// Perform the request.
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making POST /logout request: %v", err)
	}

	// We expect 200 if the session was retrieved/destroyed successfully.
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected status 200 for logout success, got %v", resp.StatusCode)
	}

	// Optionally, parse the JSON response to confirm it matches what we expect.
	var logoutResp map[string]string
	if err := json.NewDecoder(resp.Body).Decode(&logoutResp); err != nil {
		t.Fatalf("Error decoding logout response JSON: %v", err)
	}

	expectedMsg := "Logout successful"
	if logoutResp["message"] != expectedMsg {
		t.Errorf("Expected message '%s', got '%s'", expectedMsg, logoutResp["message"])
	} else {
		t.Log("TestLogoutSuccess passed.\n")
	}
}
