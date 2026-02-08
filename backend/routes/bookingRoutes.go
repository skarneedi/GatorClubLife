package routes

import (
	"github.com/gofiber/fiber/v2"
)

// RegisterBookingRoutes registers the routes for bookings
func RegisterBookingRoutes(app *fiber.App) {
	app.Post("/bookings", CreateBooking)
	// app.Get("/bookings", GetBookings)
}
