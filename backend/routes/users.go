package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"golang.org/x/crypto/bcrypt"
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
	result := database.DB.Select("user_id, user_name, user_email, user_role, user_created_at").Find(&users)
	if result.Error != nil {
		fmt.Println("❌ Error fetching users:", result.Error)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Error retrieving users",
		})
	}

	return c.JSON(users)
}

// CreateUser godoc
// @Summary      Register a new user
// @Description  Creates a new user with name, email, password, and role.
// @Tags         Users
// @Accept       json
// @Produce      json
// @Param        user  body      database.User  true  "New user data"
// @Success      200   {object}  map[string]interface{}
// @Failure      400   {object}  map[string]string
// @Failure      500   {object}  map[string]string
// @Router       /users/create [post]
func CreateUser(c *fiber.Ctx) error {
	fmt.Println("📨 CreateUser API called")

	var user database.User

	// Parse request body
	if err := c.BodyParser(&user); err != nil {
		fmt.Println("❌ JSON parse error:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Invalid JSON format in request body",
		})
	}

	// Validate required fields
	if user.UserName == "" || user.UserEmail == "" || user.UserRole == "" || user.UserPassword == "" {
		fmt.Println("❌ Missing fields in request")
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "Missing required fields: name, email, role, or password",
		})
	}

	// Check if email already exists
	var existing database.User
	if err := database.DB.Where("user_email = ?", user.UserEmail).First(&existing).Error; err == nil {
		fmt.Println("❌ User already exists with email:", user.UserEmail)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"error": "User already exists with this email",
		})
	}

	// Hash the password
	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(user.UserPassword), bcrypt.DefaultCost)
	if err != nil {
		fmt.Println("❌ Error hashing password:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Internal error while processing password",
		})
	}
	user.UserPassword = string(hashedPassword)

	// Save user
	if err := database.DB.Create(&user).Error; err != nil {
		fmt.Println("❌ Failed to save user to database:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"error": "Could not register user. Try again later.",
		})
	}

	// Success response (omit password)
	response := fiber.Map{
		"user_id":         user.UserID,
		"user_name":       user.UserName,
		"user_email":      user.UserEmail,
		"user_role":       user.UserRole,
		"user_created_at": user.UserCreatedAt,
	}

	fmt.Println("✅ User created:", response)
	return c.Status(fiber.StatusOK).JSON(response)
}
