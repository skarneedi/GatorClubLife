package routes_test

import (
	"backend/database"
	"backend/routes"
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"github.com/gofiber/fiber/v2"
)

func setupEventPermitAppNoSession() *fiber.App {
	app := fiber.New()
	app.Post("/event-permits/submit", routes.SubmitFullEventPermit)
	app.Get("/submissions", routes.GetUserSubmissions)
	return app
}

func initEventPermitTestDB() {
	database.InitDB()
	_ = database.DB.AutoMigrate(&database.User{}, &database.EventPermit{}, &database.EventSlot{}, &database.EventDocument{})
	database.DB.Exec("DELETE FROM users")
	database.DB.Exec("DELETE FROM event_permits")
	database.DB.Exec("DELETE FROM event_slots")
	database.DB.Exec("DELETE FROM event_documents")
}

func TestSubmitFullEventPermit_DBLogic(t *testing.T) {
	initEventPermitTestDB()

	// Seed user and prepare test data
	user := database.User{
		UserName:     "Permit Test",
		UserEmail:    "permits@example.com",
		UserPassword: "1234",
		UserRole:     "member",
	}
	database.DB.Create(&user)

	permit := database.EventPermit{
		EventName:          "DB Logic Event",
		PermitType:         "general-events",
		EventDescription:   "This is a test event",
		ExpectedAttendance: 50,
		EventCategories:    "TEST",
		AdditionalNotes:    "DB logic only",
		SubmittedBy:        user.UserEmail,
		Status:             "Pending",
		CreatedAt:          time.Now().Unix(),
	}

	result := database.DB.Create(&permit)
	if result.Error != nil {
		t.Fatalf("❌ Failed to insert permit: %v", result.Error)
	}

	var found database.EventPermit
	err := database.DB.First(&found, permit.EventPermitID).Error
	if err != nil {
		t.Fatalf("❌ Could not retrieve permit from DB: %v", err)
	}

	if found.EventName != "DB Logic Event" {
		t.Errorf("Expected EventName to be 'DB Logic Event', got '%s'", found.EventName)
	}
}

func TestSubmitFullEventPermit_Endpoint(t *testing.T) {
	app := setupEventPermitAppNoSession()
	initEventPermitTestDB()

	payload := map[string]interface{}{
		"event_permit": map[string]interface{}{
			"event_name":        "Unauthorized Submission",
			"event_description": "Should fail without session",
			"permit_type":       "general-events",
		},
		"slots": []map[string]interface{}{
			{"start_time": "2025-05-01", "end_time": "2025-05-01"},
		},
	}
	body, _ := json.Marshal(payload)

	req := httptest.NewRequest("POST", "/event-permits/submit", bytes.NewReader(body))
	req.Header.Set("Content-Type", "application/json")

	resp, _ := app.Test(req, -1)
	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected 401 Unauthorized, got %d", resp.StatusCode)
	}
}

func TestGetUserSubmissions_FilteredByEmail(t *testing.T) {
	app := setupEventPermitAppNoSession()
	initEventPermitTestDB()

	database.DB.Create(&database.EventPermit{
		EventName:   "Dummy Event",
		PermitType:  "general-events",
		SubmittedBy: "nobody@ufl.edu",
		Status:      "Pending",
		CreatedAt:   time.Now().Unix(),
	})

	req := httptest.NewRequest("GET", "/submissions?email=nobody@ufl.edu", nil)
	resp, _ := app.Test(req, -1)

	if resp.StatusCode != http.StatusUnauthorized {
		t.Errorf("Expected 401 Unauthorized, got %d", resp.StatusCode)
	}
}
