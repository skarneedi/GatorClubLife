package routes

import (
	"backend/database"

	"github.com/gofiber/fiber/v2"
)

// CreateBooking godoc
// @Summary      Create a new booking
// @Description  Creates a booking with user ID, event ID, and booking status
// @Tags         Bookings
// @Accept       json
// @Produce      json
// @Param        booking  body      database.Booking  true  "Booking details"
// @Success      201      {object}  database.Booking
// @Failure      400      {object}  map[string]string "Invalid request data"
// @Failure      500      {object}  map[string]string "Error creating booking"
// @Router       /bookings [post]
func CreateBooking(c *fiber.Ctx) error {
	var booking database.Booking

	// Parse JSON body into booking struct
	if err := c.BodyParser(&booking); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request data",
			"error":   err.Error(),
		})
	}

	// Basic validation
	if booking.UserID == 0 || booking.EventID == 0 || booking.Status == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Missing required fields: user_id, event_id, or booking_status",
		})
	}

	// Insert booking into DB
	if err := database.DB.Create(&booking).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error creating booking",
			"error":   err.Error(),
		})
	}

	return c.Status(fiber.StatusCreated).JSON(booking)
}
