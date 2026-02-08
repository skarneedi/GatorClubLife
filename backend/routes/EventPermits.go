package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// FullPermitPayload defines the structure for full event permit submission
type FullPermitPayload struct {
	EventPermit database.EventPermit     `json:"event_permit"`
	Slots       []database.EventSlot     `json:"slots"`
	Documents   []database.EventDocument `json:"documents"`
	Notes       string                   `json:"notes"` // Optional notes
}

// SubmitFullEventPermit godoc
// @Summary      Submit full event permit
// @Description  Accepts event, slots, documents, and notes. User must be logged in.
// @Tags         Event Permits
// @Accept       json
// @Produce      json
// @Param        permit  body      FullPermitPayload  true  "Full permit payload"
// @Success      201     {object}  map[string]interface{}
// @Failure      400     {object}  map[string]string
// @Failure      401     {object}  map[string]string
// @Failure      500     {object}  map[string]string
// @Router       /event-permits/submit [post]
func SubmitFullEventPermit(c *fiber.Ctx) error {
	fmt.Println("Permits Submission API called")

	// 🆕 Updated: Define struct to include top-level notes
	type FullPermitPayload struct {
		EventPermit database.EventPermit     `json:"event_permit"`
		Slots       []database.EventSlot     `json:"slots"`
		Documents   []database.EventDocument `json:"documents"`
		Notes       string                   `json:"notes"`
	}

	var payload FullPermitPayload

	// Parse JSON body
	if err := c.BodyParser(&payload); err != nil {
		fmt.Printf("❌ Error parsing body: %v\n", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid input data",
			"error":   err.Error(),
		})
	}

	// 🆕 Get submitted_by from session
	submittedBy := c.Locals("user_email")
	if submittedBy == nil {
		fmt.Println("⚠️ User not authenticated")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "User not logged in or session missing",
		})
	}
	payload.EventPermit.SubmittedBy = submittedBy.(string)

	// Insert Event Permit
	if err := database.DB.Create(&payload.EventPermit).Error; err != nil {
		fmt.Printf("❌ DB Insert Error: %v\n", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error saving permit",
			"error":   err.Error(),
		})
	}

	// Link EventID to slots and documents
	for i := range payload.Slots {
		payload.Slots[i].EventID = payload.EventPermit.EventPermitID
	}
	for i := range payload.Documents {
		payload.Documents[i].EventID = payload.EventPermit.EventPermitID
	}

	// Insert Slots & Documents
	if len(payload.Slots) > 0 {
		if err := database.DB.Create(&payload.Slots).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Error saving slots",
				"error":   err.Error(),
			})
		}
	}
	if len(payload.Documents) > 0 {
		if err := database.DB.Create(&payload.Documents).Error; err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Error saving documents",
				"error":   err.Error(),
			})
		}
	}

	// ✅ Final response
	return c.Status(fiber.StatusCreated).JSON(fiber.Map{
		"message": "Event permit submitted successfully",
		"id":      payload.EventPermit.EventPermitID,
	})
}
