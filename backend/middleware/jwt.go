package middleware

import (
	"fmt"
	"os"

	"github.com/MicahParks/keyfunc/v2"
	jwtware "github.com/gofiber/contrib/jwt"
	"github.com/gofiber/fiber/v2"
)

// JWTProtected returns a middleware that validates the Bearer token
func JWTProtected() fiber.Handler {
	// ⚠️ Ideally, load these from environment variables
	auth0Domain := os.Getenv("AUTH0_DOMAIN")
	if auth0Domain == "" {
		// Fallback for dev
		auth0Domain = "dev-xsfw1aeu1c13w4pn.us.auth0.com"
	}
	fmt.Printf("🔧 Middleware using Auth0 domain: %s\n", auth0Domain)

	jwksUrl := fmt.Sprintf("https://%s/.well-known/jwks.json", auth0Domain)

	// Create the keyfunc options. Refresh the JWKS every hour.
	jwks, err := keyfunc.Get(jwksUrl, keyfunc.Options{})
	if err != nil {
		fmt.Printf("❌ Failed to create JWKS from resource at '%s'. Error: %v\n", jwksUrl, err)
		// We return a dummy handler that always fails if JWKS fails to load
		return func(c *fiber.Ctx) error {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
				"message": "Auth configuration error on server",
			})
		}
	}

	return jwtware.New(jwtware.Config{
		KeyFunc: jwks.Keyfunc,
		ErrorHandler: func(c *fiber.Ctx, err error) error {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
				"message": "Invalid or expired token",
				"error":   err.Error(),
			})
		},
	})
}
