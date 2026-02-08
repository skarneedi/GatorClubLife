package routes

import (
	"backend/database"
	"fmt"
	"net/smtp"
	"strconv"
	"time"

	"github.com/gofiber/fiber/v2"
)

func GetEvents(c *fiber.Ctx) error {
	var dbEvents []database.Event

	page, _ := strconv.Atoi(c.Query("page", "1"))
	limit, _ := strconv.Atoi(c.Query("limit", "10"))
	offset := (page - 1) * limit

	query := database.DB.Limit(limit).Offset(offset)
	result := query.Find(&dbEvents)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving events",
		})
	}

	var response []fiber.Map
	for _, ev := range dbEvents {
		start := time.Unix(ev.EventDate, 0).Format("2006-01-02")
		response = append(response, fiber.Map{
			"title":        ev.EventName,
			"description":  ev.EventDescription,
			"startDate":    start,
			"endDate":      start,
			"location":     ev.EventLocation,
			"organization": fmt.Sprintf("Club ID: %d", ev.ClubID),
			"category":     ev.EventCategories,
		})
	}

	fmt.Println("✅ Events fetched:", response)
	return c.JSON(response)
}

func SendRSVPConfirmation(c *fiber.Ctx) error {
	var body struct {
		Email string `json:"email"`
		Event string `json:"event"`
	}

	// Parse and validate the RSVP data
	if err := c.BodyParser(&body); err != nil || body.Email == "" || body.Event == "" {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid RSVP payload",
		})
	}

	// Email configuration
	from := "your-gmail@gmail.com"  // Replace with your Gmail
	password := "your-app-password" // Replace with your app password
	to := body.Email
	subject := "RSVP Confirmation for " + body.Event
	bodyText := fmt.Sprintf("Hi,\n\nYou have successfully RSVPed to the event: %s.\n\nWe look forward to seeing you!\n\n- Gator Club Life Team", body.Event)

	// Construct the email message
	msg := "From: " + from + "\n" +
		"To: " + to + "\n" +
		"Subject: " + subject + "\n\n" +
		bodyText

	// Send the email
	auth := smtp.PlainAuth("", from, password, "smtp.gmail.com")
	err := smtp.SendMail("smtp.gmail.com:587", auth, from, []string{to}, []byte(msg))
	if err != nil {
		fmt.Println("Error sending mail:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to send RSVP confirmation: " + err.Error(),
		})
	}

	fmt.Println("✅ RSVP email sent to:", to)
	return c.JSON(fiber.Map{
		"message": "RSVP confirmed and email sent!",
	})
}

func CreateEvent(c *fiber.Ctx) error {
	var newEvent database.Event
	if err := c.BodyParser(&newEvent); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid event data",
		})
	}

	if err := database.DB.Create(&newEvent).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Failed to create event",
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"event_id": newEvent.EventID,
	})
}
