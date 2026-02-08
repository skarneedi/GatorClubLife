package routes

import (
	"backend/database"
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
	"golang.org/x/crypto/bcrypt"
)

type LoginRequest struct {
	Email    string `json:"email"`
	Password string `json:"password"`
}

type LoginResponse struct {
	Message       string `json:"message"`
	UserID        uint   `json:"user_id"`
	UserName      string `json:"user_name"`
	UserEmail     string `json:"user_email"`
	UserRole      string `json:"user_role"`
	UserCreatedAt int64  `json:"user_created_at"`
}

var Store *session.Store

func SetStore(s *session.Store) {
	Store = s
}

// Login godoc
// @Summary      Authenticate a user
// @Description  Validates credentials and sets session cookie
// @Tags         Authentication
// @Accept       json
// @Produce      json
// @Param        credentials  body  LoginRequest  true  "User login credentials"
// @Success      200  {object}  LoginResponse
// @Failure      400  {object}  map[string]string
// @Failure      401  {object}  map[string]string
// @Router       /login [post]
func Login(c *fiber.Ctx) error {
	fmt.Println("Login API called")

	var req LoginRequest
	if err := c.BodyParser(&req); err != nil {
		fmt.Println("JSON parse error:", err)
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid request format",
		})
	}

	var user database.User
	result := database.DB.Where("user_email = ?", req.Email).First(&user)
	if result.Error != nil {
		fmt.Println("User not found:", result.Error)
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Invalid email or account not found",
		})
	}

	if err := bcrypt.CompareHashAndPassword([]byte(user.UserPassword), []byte(req.Password)); err != nil {
		fmt.Println("Incorrect password")
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Incorrect password",
		})
	}

	fmt.Println("User authenticated:", user.UserEmail)

	// ✅ Safely get session from context with nil check
	val := c.Locals("session")
	if val == nil {
		fmt.Println("⚠️ No session found in context — is SessionContext middleware enabled?")
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Session middleware missing or misconfigured",
		})
	}

	sess := val.(*session.Session)

	fmt.Println("📦 Loaded session from middleware")
	sess.Set("user_id", user.UserID)
	sess.Set("user_email", user.UserEmail)
	sess.Set("user_role", user.UserRole)

	fmt.Printf("🔑 About to save session:\n  user_id: %v\n  user_email: %v\n  user_role: %v\n",
		user.UserID, user.UserEmail, user.UserRole)

	if err := sess.Save(); err != nil {
		fmt.Println("❌ Failed to save session:", err)
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Session save failed",
		})
	}

	fmt.Println("✅ Session saved successfully")

	c.Set("Content-Type", "application/json")
	c.Status(fiber.StatusOK)

	return c.JSON(LoginResponse{
		Message:       "Login successful",
		UserID:        user.UserID,
		UserName:      user.UserName,
		UserEmail:     user.UserEmail,
		UserRole:      user.UserRole,
		UserCreatedAt: user.UserCreatedAt,
	})
}
