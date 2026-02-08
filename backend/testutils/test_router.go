package testutils

import (
	"backend/middleware"
	"backend/routes"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var TestStore = session.New()

func SetupTestApp() *fiber.App {
	app := fiber.New()

	// ⚠️ Set the session store BEFORE using SessionContext()
	routes.SetStore(TestStore)
	middleware.SetStore(TestStore)

	app.Use(middleware.SessionContext())

	// Setup the specific routes used in tests
	app.Get("/clubs/:id", routes.GetClubByID)
	app.Get("/clubs/:id/officers", routes.GetOfficersByClubID)
	app.Post("/event-permits/submit", routes.SubmitFullEventPermit)
	app.Get("/submissions", routes.GetUserSubmissions)

	return app
}
