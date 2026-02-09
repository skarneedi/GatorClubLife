package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

// GetUsers godoc
// @Summary      Retrieve all users
// @Description  Returns a list of all registered users. Admin access recommended.
// @Tags         Users
// @Produce      json
// @Success      200  {array}   database.User
// @Failure      500  {object}  map[string]string
// @Router       /users [get]
func GetUsers(c *fiber.Ctx) error {
	fmt.Println("📥 GetUsers API called")

	var users []database.User
	result := database.DB.Find(&users)
	if result.Error != nil {
		fmt.Println("❌ Error fetching users:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error retrieving users",
		})
	}

	return c.JSON(users)
}

// CreateUser godoc
// @Summary      Register/Sync a new user from Auth0
// @Description  Creates a new user profile if it doesn't exist, using Auth0 ID.
// @Tags         Users
// @Accept       json
// @Produce      json
// @Param        user  body      database.User  true  "New user data"
// @Success      200   {object}  database.User
// @Failure      400   {object}  map[string]string
// @Failure      500   {object}  map[string]string
// @Router       /users/create [post]
func CreateUser(c *fiber.Ctx) error {
	fmt.Println("📨 CreateUser API called")

	var req database.User

	// Parse request body
	if err := c.BodyParser(&req); err != nil {
		fmt.Println("❌ JSON parse error:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid JSON format in request body",
		})
	}

	// Validate required fields
	if req.UserName == "" || req.UserEmail == "" || req.UserRole == "" || req.Auth0ID == "" {
		fmt.Println("❌ Missing fields in request")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required fields: name, email, role, or auth0_id",
		})
	}

	// Check if user already exists by Auth0 ID or Email
	var existing database.User
	err := database.DB.Where("auth0_id = ? OR user_email = ?", req.Auth0ID, req.UserEmail).First(&existing).Error
	if err == nil {
		fmt.Println("ℹ️ User already exists, returning existing profile:", existing.UserEmail)
		// Option: Update existing user if needed
		return c.Status(fiber.StatusOK).JSON(existing)
	}

	// Save new user
	if err := database.DB.Create(&req).Error; err != nil {
		fmt.Println("❌ Failed to save user to database:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not register user. Try again later.",
		})
	}

	fmt.Println("✅ User created:", req.UserEmail)
	return c.Status(fiber.StatusCreated).JSON(req)
}
