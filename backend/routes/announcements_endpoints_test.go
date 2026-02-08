package routes_test

import (
	"bytes"
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"testing"
	"time"

	"backend/database"
	"backend/routes"

	"github.com/gofiber/fiber/v2"
)

// setupAnnouncementsApp initializes a new Fiber app with the announcements endpoints.
func setupAnnouncementsApp() *fiber.App {
	app := fiber.New()
	app.Get("/announcements", routes.GetAnnouncements)
	app.Post("/announcements/create", routes.CreateAnnouncement)
	return app
}

// initTestDBForAnnouncements initializes the database specifically for announcements testing.
func initTestDBForAnnouncements() {
	database.InitDB()

	// Migrate the Announcement and User tables; also clear them to ensure a clean slate.
	if err := database.DB.AutoMigrate(&database.Announcement{}, &database.User{}); err != nil {
		panic(fmt.Sprintf("Failed to migrate tables: %v", err))
	}

	database.DB.Exec("DELETE FROM announcements")
	database.DB.Exec("DELETE FROM users")
	fmt.Println("Announcements test DB initialized and tables cleared.")
}

func TestGetAnnouncements(t *testing.T) {
	t.Log("Starting TestGetAnnouncements")
	initTestDBForAnnouncements()

	// Insert some dummy announcements
	ann1 := database.Announcement{
		AnnouncementTitle:     "Title 1",
		AnnouncementMessage:   "Message 1",
		AnnouncementCreatedBy: 1,
		AnnouncementCreatedAt: time.Now().Add(-1 * time.Hour),
	}
	ann2 := database.Announcement{
		AnnouncementTitle:     "Title 2",
		AnnouncementMessage:   "Message 2",
		AnnouncementCreatedBy: 1,
		AnnouncementCreatedAt: time.Now(),
	}

	database.DB.Create(&ann1)
	database.DB.Create(&ann2)

	app := setupAnnouncementsApp()

	req := httptest.NewRequest("GET", "/announcements", nil)
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making GET /announcements request: %v", err)
	}
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected status 200, got %v", resp.StatusCode)
	}

	var announcements []database.Announcement
	if err := json.NewDecoder(resp.Body).Decode(&announcements); err != nil {
		t.Fatalf("Error decoding response: %v", err)
	}

	if len(announcements) < 2 {
		t.Errorf("Expected at least 2 announcements, got %d", len(announcements))
	} else {
		t.Log("TestGetAnnouncements passed.\n")
	}
}

func TestCreateAnnouncementSuccess(t *testing.T) {
	t.Log("Starting TestCreateAnnouncementSuccess")
	initTestDBForAnnouncements()

	// Create a test user (admin) to post the announcement
	adminUser := database.User{
		UserName:     "AdminUser",
		UserEmail:    "admin@example.com",
		UserRole:     "admin",
		UserPassword: "hashedDummyPassword", // Not used in this test
	}
	if err := database.DB.Create(&adminUser).Error; err != nil {
		t.Fatalf("Error creating admin user: %v", err)
	}

	app := setupAnnouncementsApp()

	payload := map[string]interface{}{
		"announcement_title":      "New Announcement",
		"announcement_message":    "Hello everyone!",
		"announcement_created_by": adminUser.UserID,
	}
	body, _ := json.Marshal(payload)
	req := httptest.NewRequest("POST", "/announcements/create", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making POST /announcements/create request: %v", err)
	}

	// By default, your CreateAnnouncement returns 200 on success
	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected status 200, got %v", resp.StatusCode)
	}

	var createdAnnouncement database.Announcement
	if err := json.NewDecoder(resp.Body).Decode(&createdAnnouncement); err != nil {
		t.Fatalf("Error decoding create announcement response: %v", err)
	}

	if createdAnnouncement.AnnouncementID == 0 {
		t.Error("Expected a valid announcement ID, got 0")
	} else {
		t.Log("TestCreateAnnouncementSuccess passed.\n")
	}
}

func TestCreateAnnouncementMissingFields(t *testing.T) {
	t.Log("Starting TestCreateAnnouncementMissingFields")
	initTestDBForAnnouncements()

	// Create an admin user to simulate a valid user
	adminUser := database.User{
		UserName:     "AdminUser",
		UserEmail:    "admin@example.com",
		UserRole:     "admin",
		UserPassword: "hashedDummyPassword",
	}
	database.DB.Create(&adminUser)

	app := setupAnnouncementsApp()

	// Intentionally missing "announcement_title" and "announcement_message"
	payload := map[string]interface{}{
		"announcement_created_by": adminUser.UserID,
	}
	body, _ := json.Marshal(payload)
	req := httptest.NewRequest("POST", "/announcements/create", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making POST /announcements/create request: %v", err)
	}

	if resp.StatusCode != http.StatusBadRequest {
		t.Fatalf("Expected status 400 for missing fields, got %v", resp.StatusCode)
	}

	t.Log("TestCreateAnnouncementMissingFields passed.\n")
}

func TestCreateAnnouncementNonAdmin(t *testing.T) {
	t.Log("Starting TestCreateAnnouncementNonAdmin")
	initTestDBForAnnouncements()

	// Create a test user (non-admin)
	normalUser := database.User{
		UserName:     "NormalUser",
		UserEmail:    "normal@example.com",
		UserRole:     "member", // not admin
		UserPassword: "hashedDummyPassword",
	}
	if err := database.DB.Create(&normalUser).Error; err != nil {
		t.Fatalf("Error creating normal user: %v", err)
	}

	app := setupAnnouncementsApp()

	payload := map[string]interface{}{
		"announcement_title":      "Non-admin Announcement",
		"announcement_message":    "Should fail",
		"announcement_created_by": normalUser.UserID,
	}
	body, _ := json.Marshal(payload)
	req := httptest.NewRequest("POST", "/announcements/create", bytes.NewBuffer(body))
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making POST /announcements/create request: %v", err)
	}

	if resp.StatusCode != http.StatusUnauthorized {
		t.Fatalf("Expected status 401 for non-admin user, got %v", resp.StatusCode)
	}

	t.Log("TestCreateAnnouncementNonAdmin passed.\n")
}
