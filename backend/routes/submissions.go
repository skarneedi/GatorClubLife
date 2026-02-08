package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// Summary struct for My Permits table
type PermitSummary struct {
	ID          uint   `json:"id"`
	EventName   string `json:"event_name"`
	SubmittedBy string `json:"submitted_by"`
	Status      string `json:"status"`
	SlotCount   int    `json:"slot_count"`
}

// GetUserSubmissions godoc
// @Summary      Get my submissions
// @Description  Returns event permits submitted by the logged-in user
// @Tags         Submissions
// @Produce      json
// @Success      200  {array}  routes.PermitSummary
// @Failure      401  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /submissions [get]
func GetUserSubmissions(c *fiber.Ctx) error {
	fmt.Println("My Submissions API called")

	// ✅ Get email from session context (middleware set c.Locals)
	email := c.Locals("user_email")
	if email == nil {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"error": "User not logged in or session missing",
		})
	}
	userEmail := email.(string)

	// ✅ Fetch all permits submitted by this user
	var permits []database.EventPermit
	err := database.DB.Preload("Slots").Where("submitted_by = ?", userEmail).Find(&permits).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Failed to fetch submissions",
		})
	}

	// ✅ Transform into PermitSummary format
	var summaries []PermitSummary
	for _, p := range permits {
		summary := PermitSummary{
			ID:          p.EventPermitID,
			EventName:   p.EventName,
			SubmittedBy: p.SubmittedBy,
			Status:      p.Status,
			SlotCount:   len(p.Slots),
		}
		summaries = append(summaries, summary)
	}

	return c.JSON(summaries)
}
