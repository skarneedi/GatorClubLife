package routes_test

import (
	"backend/database"
	"backend/testutils"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
)

func initClubsTestDB() {
	database.InitDB()
	database.DB.Exec("DELETE FROM clubs")
	database.DB.Exec("DELETE FROM officers")

	// 👇 Ensure ClubID is set to 1 for predictable testing
	database.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'clubs'")
	database.DB.Exec("DELETE FROM sqlite_sequence WHERE name = 'officers'")

	database.DB.Create(&database.Club{
		ClubID:          1,
		ClubName:        "Test Club",
		ClubDescription: "A club for testing",
		ClubCategory:    "Testing",
	})

	database.DB.Create(&database.Officer{
		OfficerName: "Jane Doe",
		OfficerRole: "President",
		ClubID:      1,
	})
}

func TestGetClubByID_Basic(t *testing.T) {
	app := testutils.SetupTestApp()
	initClubsTestDB()

	req := httptest.NewRequest("GET", "/clubs/1", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}

	var club database.Club
	if err := json.NewDecoder(resp.Body).Decode(&club); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if club.ClubName != "Test Club" {
		t.Errorf("Expected club name to be 'Test Club', got '%s'", club.ClubName)
	}
}

func TestGetOfficersByClubID_Basic(t *testing.T) {
	app := testutils.SetupTestApp()
	initClubsTestDB()

	req := httptest.NewRequest("GET", "/clubs/1/officers", nil)
	resp, err := app.Test(req)
	if err != nil {
		t.Fatalf("Request failed: %v", err)
	}

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}

	var officers []database.Officer
	if err := json.NewDecoder(resp.Body).Decode(&officers); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if len(officers) != 1 || officers[0].OfficerName != "Jane Doe" {
		t.Errorf("Expected 1 officer named Jane Doe, got %+v", officers)
	}
}

func TestGetClubByID_NotFound(t *testing.T) {
	app := testutils.SetupTestApp()
	initClubsTestDB()

	req := httptest.NewRequest("GET", "/clubs/999", nil)
	resp, _ := app.Test(req)

	if resp.StatusCode != http.StatusNotFound {
		t.Errorf("Expected 404 Not Found, got %d", resp.StatusCode)
	}
}

func TestGetOfficersByClubID_EmptyList(t *testing.T) {
	app := testutils.SetupTestApp()
	initClubsTestDB()

	// Wipe officers
	database.DB.Exec("DELETE FROM officers")

	req := httptest.NewRequest("GET", "/clubs/1/officers", nil)
	resp, _ := app.Test(req)

	if resp.StatusCode != http.StatusOK {
		t.Errorf("Expected 200 OK, got %d", resp.StatusCode)
	}

	var officers []database.Officer
	if err := json.NewDecoder(resp.Body).Decode(&officers); err != nil {
		t.Fatalf("Failed to decode response: %v", err)
	}

	if len(officers) != 0 {
		t.Errorf("Expected 0 officers, got %+v", officers)
	}
}
