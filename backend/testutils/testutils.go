package testutils

import (
	"backend/database"
	"testing"
)

func InitTestDB(t *testing.T) {
	database.InitDB()

	err := database.DB.AutoMigrate(&database.Event{}, &database.User{})
	if err != nil {
		t.Fatalf("DB migration failed: %v", err)
	}

	// Clear relevant tables to ensure a clean test state
	database.DB.Exec("DELETE FROM events")
	database.DB.Exec("DELETE FROM users")
}
