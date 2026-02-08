package main

import (
	"backend/database"
	"backend/middleware"
	"backend/routes"
	"fmt"
	"log"

	_ "backend/docs" // Swagger docs

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/session"
	fiberSwagger "github.com/swaggo/fiber-swagger"
)

var store = session.New(session.Config{
	CookieSecure:   false, // use true if using HTTPS
	CookieHTTPOnly: true,
	CookieSameSite: "None", // Required for cross-site cookies
	Expiration:     0,      // session does not expire unless manually cleared
})

func main() {
	fmt.Println("🔁 Starting Gator-Club-Life Backend...")

	// Initialize Database
	database.InitDB()
	fmt.Println("✅ Database Connected!")

	app := fiber.New()

	// Setup CORS to allow Angular frontend
	app.Use(cors.New(cors.Config{
		AllowOrigins:     "http://localhost:4200",
		AllowCredentials: true,
	}))

	// Attach session store to middleware
	routes.SetStore(store)
	middleware.SetStore(store)

	// Apply session context globally
	app.Use(middleware.SessionContext())

	// 🧪 Debug session info
	app.Get("/session-check", func(c *fiber.Ctx) error {
		return c.JSON(fiber.Map{
			"user_email": c.Locals("user_email"),
			"user_id":    c.Locals("user_id"),
			"user_role":  c.Locals("user_role"),
		})
	})

	app.Get("/debug-session", func(c *fiber.Ctx) error {
		val := c.Locals("session")
		if val == nil {
			fmt.Println("⚠️ No session attached to context")
			return c.SendString("No session found in context")
		}
		sess := val.(*session.Session)
		email := sess.Get("user_email")
		if email == nil {
			fmt.Println("⚠️ Session exists, but no user_email stored")
			return c.SendString("Session exists but no user_email set")
		}
		fmt.Println("✅ Session found for:", email)
		return c.SendString(fmt.Sprintf("Session found for: %v", email))
	})

	// 🌐 Default Route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to Gator-Club-Life!")
	})

	// 🧾 Swagger Docs
	app.Get("/swagger/*", fiberSwagger.WrapHandler)

	// 👤 User Routes
	app.Get("/users", routes.GetUsers)
	app.Post("/users/create", routes.CreateUser)
	app.Post("/login", routes.Login)
	app.Post("/logout", routes.Logout)

	// 🏛️ Clubs
	app.Get("/clubs", routes.GetClubs)
	app.Get("/clubs/:id", middleware.RequireAuth(), routes.GetClubByID)
	app.Get("/clubs/:id/officers", middleware.RequireAuth(), routes.GetOfficersByClubID)

	// 📅 Events
	app.Get("/events", middleware.RequireAuth(), routes.GetEvents)
	app.Post("/events/send-confirmation", middleware.RequireAuth(), routes.SendRSVPConfirmation)

	// 📢 Announcements
	app.Get("/announcements", middleware.RequireAuth(), routes.GetAnnouncements)
	app.Post("/announcements/create", middleware.RequireAuth(), routes.CreateAnnouncement)

	// 📋 Event Permits
	app.Post("/event-permits/submit", middleware.RequireAuth(), routes.SubmitFullEventPermit)
	app.Get("/submissions", middleware.RequireAuth(), routes.GetUserSubmissions)

	// 📦 Bookings
	routes.RegisterBookingRoutes(app)

	// Start the server
	log.Fatal(app.Listen(":8080"))
}
