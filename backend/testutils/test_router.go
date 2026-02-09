package testutils

import (
	"backend/routes"

	"github.com/gofiber/fiber/v2"
)

// MockAuthMiddleware sets dummy user data in context for tests
func MockAuthMiddleware(c *fiber.Ctx) error {
	c.Locals("user_email", "test@example.com")
	c.Locals("user_id", uint(1))
	c.Locals("user_role", "member")
	return c.Next()
}

// SetupTestApp creates a fiber app for testing with mock auth
func SetupTestApp() *fiber.App {
	app := fiber.New()

	// Apply mock auth middleware globally for tests
	app.Use(MockAuthMiddleware)

	// Setup the specific routes used in tests
	app.Get("/clubs/:id", routes.GetClubByID)
	app.Get("/clubs/:id/officers", routes.GetOfficersByClubID)
	app.Post("/event-permits/submit", routes.SubmitFullEventPermit)
	app.Get("/submissions", routes.GetUserSubmissions)

	return app
}
