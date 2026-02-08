package routes_test

import (
	"backend/database"
	"backend/routes"
	"backend/testutils"
	"bytes"
	"encoding/json"
	"net/http/httptest"
	"testing"

	"github.com/gofiber/fiber/v2"
	"github.com/stretchr/testify/assert"
)

func setupEventsApp() *fiber.App {
	app := fiber.New()
	app.Get("/events", routes.GetEvents)
	app.Post("/events/send-confirmation", routes.SendRSVPConfirmation)
	app.Post("/events/create", routes.CreateEvent)
	return app
}

func TestGetEvents(t *testing.T) {
	t.Log("Starting TestGetEvents")
	testutils.InitTestDB(t)

	clubID := uint(1)
	event := database.Event{
		EventName:        "Test Event",
		EventDescription: "A test event for unit testing.",
		EventLocation:    "Test Location",
		EventCategories:  "Test Category",
		EventDate:        1622541600,
		ClubID:           &clubID,
	}

	if err := database.DB.Create(&event).Error; err != nil {
		t.Fatalf("Failed to insert test event: %v", err)
	}

	app := setupEventsApp()
	req := httptest.NewRequest("GET", "/events", nil)
	resp, err := app.Test(req)

	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}

	assert.Equal(t, 200, resp.StatusCode)

	var events []map[string]interface{}
	if err := json.NewDecoder(resp.Body).Decode(&events); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	assert.Len(t, events, 1, "Expected 1 event to be returned")
}

func TestSendRSVPConfirmationMissingFields(t *testing.T) {
	t.Log("Starting TestSendRSVPConfirmationMissingFields")
	testutils.InitTestDB(t)

	app := setupEventsApp()

	payload := map[string]string{}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("POST", "/events/send-confirmation", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Failed to make request: %v", err)
	}

	assert.Equal(t, 400, resp.StatusCode, "Expected status 400 for missing fields")
}
