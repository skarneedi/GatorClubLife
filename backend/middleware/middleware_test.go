package middleware_test

import (
	"backend/middleware"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

// 🔒 Test that RequireAuth blocks access with no session
func TestRequireAuth_BlocksWithoutSession(t *testing.T) {
	app := fiber.New()
	store := session.New()
	middleware.SetStore(store)

	app.Use(middleware.RequireAuth())
	app.Get("/protected", func(c *fiber.Ctx) error {
		return c.SendString("You should not see this")
	})

	req := httptest.NewRequest("GET", "/protected", nil)
	resp, _ := app.Test(req)

	if resp.StatusCode != fiber.StatusUnauthorized {
		t.Errorf("Expected 401 Unauthorized, got %d", resp.StatusCode)
	}
}

// ✅ Test that RequireAuth allows access with a valid session
func TestRequireAuth_AllowsWithSession(t *testing.T) {
	app := fiber.New()
	store := session.New()
	middleware.SetStore(store)

	// First middleware to create and save a session
	app.Use(func(c *fiber.Ctx) error {
		sess, _ := store.Get(c)
		sess.Set("user_id", 123)
		sess.Set("user_email", "test@example.com")
		sess.Set("user_role", "member")
		sess.Save()
		return c.Next()
	})

	app.Use(middleware.RequireAuth())

	app.Get("/protected", func(c *fiber.Ctx) error {
		return c.SendString("Access granted")
	})

	req := httptest.NewRequest("GET", "/protected", nil)
	// Fiber's session is cookie-based. We can test this in integration-style by simulating a cookie later if needed.
	resp, _ := app.Test(req)

	if resp.StatusCode != fiber.StatusOK {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}
}
