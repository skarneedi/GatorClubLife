package middleware

import (
	"fmt"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/session"
)

var Store *session.Store

func SetStore(s *session.Store) {
	Store = s
}

// 🔐 Use this on protected routes
func RequireAuth() fiber.Handler {
	return func(c *fiber.Ctx) error {
		sess, err := Store.Get(c)
		if err != nil || sess.Get("user_id") == nil {
			fmt.Println("🔒 No active session. Blocking request.")
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Session expired or unauthorized. Please log in again.",
			})
		}

		// Optionally pass values to the request context
		c.Locals("user_id", sess.Get("user_id"))
		c.Locals("user_email", sess.Get("user_email"))
		c.Locals("user_role", sess.Get("user_role"))

		return c.Next()
	}
}
