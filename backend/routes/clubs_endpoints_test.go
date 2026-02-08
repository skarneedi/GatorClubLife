package routes_test

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"backend/database"
	"backend/routes"

	"github.com/gofiber/fiber/v2"
)

// setupClubsApp initializes a new Fiber app with the clubs endpoint under test.
func setupClubsApp() *fiber.App {
	app := fiber.New()
	app.Get("/clubs", routes.GetClubs)
	return app
}

// initTestDBForClubs initializes the DB for testing clubs.
// It migrates the 'clubs' table and clears any existing data.
func initTestDBForClubs() {
	database.InitDB()

	// Migrate the Club table; also clear it to ensure a clean slate.
	if err := database.DB.AutoMigrate(&database.Club{}); err != nil {
		panic(fmt.Sprintf("Failed to migrate Club table: %v", err))
	}
	database.DB.Exec("DELETE FROM clubs")
	fmt.Println("Clubs test DB initialized and table cleared.")
}

// TestGetClubsNoCategory ensures that when no category query param is provided,
// all clubs are returned.
func TestGetClubsNoCategory(t *testing.T) {
	t.Log("Starting TestGetClubsNoCategory")
	initTestDBForClubs()

	// Insert some dummy clubs.
	club1 := database.Club{
		ClubName:        "Chess Club",
		ClubDescription: "We play chess regularly",
		ClubCategory:    "Recreational & Hobbies",
	}
	club2 := database.Club{
		ClubName:        "Dance Club",
		ClubDescription: "Express yourself through dance",
		ClubCategory:    "Arts & Performance",
	}

	// Create the clubs in the DB
	database.DB.Create(&club1)
	database.DB.Create(&club2)

	app := setupClubsApp()

	// Make a GET request with no category filter
	req := httptest.NewRequest("GET", "/clubs", nil)
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making GET /clubs request: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected status 200, got %v", resp.StatusCode)
	}

	var clubs []database.Club
	if err := json.NewDecoder(resp.Body).Decode(&clubs); err != nil {
		t.Fatalf("Error decoding response: %v", err)
	}

	// We created 2 clubs above, so we expect at least 2 in the result.
	if len(clubs) < 2 {
		t.Errorf("Expected at least 2 clubs, got %d", len(clubs))
	} else {
		t.Log("TestGetClubsNoCategory passed.\n")
	}
}

// TestGetClubsWithCategory ensures that when a category query param is provided,
// only the matching clubs (case-insensitive) are returned.
func TestGetClubsWithCategory(t *testing.T) {
	t.Log("Starting TestGetClubsWithCategory")
	initTestDBForClubs()

	// Insert some dummy clubs, one with category "Arts & Performance"
	club1 := database.Club{
		ClubName:        "Ballet Troupe",
		ClubDescription: "We perform ballet recitals",
		ClubCategory:    "Arts & Performance",
	}
	club2 := database.Club{
		ClubName:        "Programming Society",
		ClubDescription: "We love coding",
		ClubCategory:    "STEM & Innovation",
	}

	database.DB.Create(&club1)
	database.DB.Create(&club2)

	app := setupClubsApp()

	// Provide ?category=arts (case-insensitive)
	req := httptest.NewRequest("GET", "/clubs?category=arts", nil)
	req.Header.Set("Content-Type", "application/json")

	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Error making GET /clubs?category=arts request: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Fatalf("Expected status 200, got %v", resp.StatusCode)
	}

	var clubs []database.Club
	if err := json.NewDecoder(resp.Body).Decode(&clubs); err != nil {
		t.Fatalf("Error decoding response: %v", err)
	}

	// We expect only club1 to match
	if len(clubs) != 1 {
		t.Errorf("Expected exactly 1 club for category=arts, got %d", len(clubs))
	} else if !strings.Contains(strings.ToLower(clubs[0].ClubCategory), "arts") {
		t.Errorf("Expected the returned club to have category 'Arts', got '%s'", clubs[0].ClubCategory)
	} else {
		t.Log("TestGetClubsWithCategory passed.\n")
	}
}
