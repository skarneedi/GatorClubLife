package middleware

import (
	"backend/routes"
	"fmt"

	"github.com/gofiber/fiber/v2"
)

func SessionContext() fiber.Handler {
	return func(c *fiber.Ctx) error {
		sess, err := routes.Store.Get(c)
		if err != nil {
			fmt.Println("❌ Failed to get session:", err)
			return c.Next()
		}

		// ✅ Attach the session object itself
		c.Locals("session", sess)

		// ✅ (Optional) convenience for direct access
		c.Locals("user_email", sess.Get("user_email"))
		c.Locals("user_id", sess.Get("user_id"))
		c.Locals("user_role", sess.Get("user_role"))

		return c.Next()
	}
}
