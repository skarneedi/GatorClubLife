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
	fiberSwagger "github.com/swaggo/fiber-swagger"
)

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
		AllowHeaders:     "Origin, Content-Type, Accept, Authorization",
	}))

	// 🌐 Default Route
	app.Get("/", func(c *fiber.Ctx) error {
		return c.SendString("Welcome to Gator-Club-Life API (Auth0 Enabled)!")
	})

	// 🧾 Swagger Docs
	app.Get("/swagger/*", fiberSwagger.WrapHandler)

	// 👤 User Routes
	app.Get("/users", routes.GetUsers)
	app.Post("/users/create", routes.CreateUser) // Needs update: Registration now just syncs user

	// 🏛️ Clubs
	app.Get("/clubs", routes.GetClubs)
	app.Get("/clubs/:id", middleware.JWTProtected(), routes.GetClubByID)
	app.Get("/clubs/:id/officers", middleware.JWTProtected(), routes.GetOfficersByClubID)

	// 📅 Events
	app.Get("/events", middleware.JWTProtected(), routes.GetEvents)
	app.Post("/events/send-confirmation", middleware.JWTProtected(), routes.SendRSVPConfirmation)

	// 📢 Announcements
	app.Get("/announcements", middleware.JWTProtected(), routes.GetAnnouncements)
	app.Post("/announcements/create", middleware.JWTProtected(), routes.CreateAnnouncement)

	// 📋 Event Permits
	app.Post("/event-permits/submit", middleware.JWTProtected(), routes.SubmitFullEventPermit)
	app.Get("/submissions", middleware.JWTProtected(), routes.GetUserSubmissions)

	// 📦 Bookings
	routes.RegisterBookingRoutes(app)

	// Start the server
	log.Fatal(app.Listen(":8080"))
}
