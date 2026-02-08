package routes

import (
	"backend/database"
	"fmt"
	"strconv"
	"strings"

	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

// GetClubs godoc
// @Summary      List all clubs
// @Description  Returns clubs, optionally filtered by category
// @Tags         Clubs
// @Produce      json
// @Param        category  query     string  false  "Filter by category"
// @Success      200       {array}   database.Club
// @Failure      500       {object}  map[string]string
// @Router       /clubs [get]
func GetClubs(c *fiber.Ctx) error {
	fmt.Println("GetClubs API called")
	category := c.Query("category")
	var clubs []database.Club
	var result *gorm.DB

	if category != "" {
		normalizedCategory := "%" + strings.ToLower(category) + "%"
		fmt.Println("Filtering clubs by category:", normalizedCategory)
		result = database.DB.Where("LOWER(club_category) LIKE ?", normalizedCategory).Find(&clubs)
	} else {
		result = database.DB.Find(&clubs)
	}

	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error retrieving clubs",
		})
	}

	return c.JSON(clubs)
}

// GetClubByID godoc
// @Summary      Get club by ID
// @Description  Returns details of a specific club
// @Tags         Clubs
// @Produce      json
// @Param        id  path      int  true  "Club ID"
// @Success      200  {object}  database.Club
// @Failure      404  {object}  map[string]string
// @Router       /clubs/{id} [get]
func GetClubByID(c *fiber.Ctx) error {
	fmt.Println("GetClubByID API called")
	clubID := c.Params("id")
	var club database.Club

	if err := database.DB.First(&club, clubID).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
			"message": "Club not found",
			"error":   err.Error(),
		})
	}

	return c.JSON(club)
}

// GetOfficersByClubID godoc
// @Summary      List officers in a club
// @Description  Returns officer list by club ID
// @Tags         Clubs
// @Produce      json
// @Param        id  path      int  true  "Club ID"
// @Success      200  {array}   database.Officer
// @Failure      400  {object}  map[string]string
// @Failure      500  {object}  map[string]string
// @Router       /clubs/{id}/officers [get]
func GetOfficersByClubID(c *fiber.Ctx) error {
	clubIDParam := c.Params("id")
	clubID, err := strconv.Atoi(clubIDParam)
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Invalid club ID",
		})
	}

	var officers []database.Officer
	if err := database.DB.Where("club_id = ?", clubID).Find(&officers).Error; err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error fetching officers",
			"error":   err.Error(),
		})
	}

	fmt.Printf("Found %d officers for club_id = %d\n", len(officers), clubID)
	return c.JSON(officers)
}
