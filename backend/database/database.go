package database

import (
	"fmt"
	"time"

	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

var DB *gorm.DB

type User struct {
	UserID        uint   `gorm:"column:user_id;primaryKey;autoIncrement" json:"user_id"`
	UserName      string `gorm:"column:user_name;not null" json:"user_name"`
	UserEmail     string `gorm:"column:user_email;unique;not null" json:"user_email"`
	UserRole      string `gorm:"column:user_role;not null;check:(user_role IN ('admin', 'member', 'organizer'))" json:"user_role"`
	UserCreatedAt int64  `gorm:"column:user_created_at;default:(strftime('%s', 'now'))" json:"user_created_at"`
	UserPassword  string `gorm:"column:user_password;not null" json:"user_password"`
}

type Club struct {
	ClubID          uint   `gorm:"column:club_id;primaryKey;autoIncrement" json:"club_id"`
	ClubName        string `gorm:"column:club_name;not null" json:"club_name"`
	ClubDescription string `gorm:"column:club_description;not null" json:"club_description"`
	ClubCreatedBy   *uint  `gorm:"column:club_created_by" json:"club_created_by"`
	ClubCreatedAt   int64  `gorm:"column:club_created_at;default:(strftime('%s', 'now'))" json:"club_created_at"`
	ClubCategory    string `gorm:"column:club_category;not null;check:(club_category IN (
		'Academic & Research',
		'Professional & Career',
		'Cultural & International',
		'Arts & Performance',
		'Recreational & Hobbies',
		'Service & Volunteering',
		'Health & Wellness',
		'Social & Special Interest',
		'Faith & Spirituality',
		'Entrepreneurship & Business',
		'STEM & Innovation',
		'Sports & Athletics',
		'Government & Leadership',
		'Others / Miscellaneous'
	))" json:"club_category"`
}

type Event struct {
	EventID          uint   `gorm:"column:event_id;primaryKey;autoIncrement" json:"event_id"`
	EventName        string `gorm:"column:event_name;not null" json:"event_name"`
	EventDescription string `gorm:"column:event_description;not null" json:"event_description"`
	EventDate        int64  `gorm:"column:event_date;not null" json:"event_date"`
	EventLocation    string `gorm:"column:event_location;not null" json:"event_location"`
	EventCategories  string `gorm:"column:event_categories;not null" json:"event_categories"` // 👈 Add this line
	OrganizedBy      *uint  `gorm:"column:organized_by" json:"organized_by"`
	ClubID           *uint  `gorm:"column:club_id" json:"club_id"`
	CreatedAt        int64  `gorm:"column:created_at;default:(strftime('%s', 'now'))" json:"created_at"`
}

type Booking struct {
	BookingID uint   `gorm:"column:booking_id;primaryKey;autoIncrement" json:"booking_id"`
	UserID    uint   `gorm:"column:user_id" json:"user_id"`
	EventID   uint   `gorm:"column:event_id" json:"event_id"`
	Status    string `gorm:"column:booking_status;not null;check:(booking_status IN ('confirmed', 'pending', 'cancelled'))" json:"booking_status"`
	BookedAt  int64  `gorm:"column:booked_at;default:(strftime('%s', 'now'))" json:"booked_at"`
}

type Announcement struct {
	AnnouncementID        uint      `gorm:"column:announcement_id;primaryKey;autoIncrement" json:"announcement_id"`
	AnnouncementTitle     string    `gorm:"column:announcement_title;not null" json:"announcement_title"`
	AnnouncementMessage   string    `gorm:"column:announcement_message;not null" json:"announcement_message"`
	AnnouncementCreatedBy uint      `gorm:"column:announcement_created_by;not null" json:"announcement_created_by"`
	AnnouncementCreatedAt time.Time `gorm:"column:announcement_created_at;autoCreateTime" json:"announcement_created_at"`
}

type Officer struct {
	OfficerID   uint   `gorm:"column:officer_id;primaryKey;autoIncrement" json:"officer_id"`
	OfficerName string `gorm:"column:officer_name;not null" json:"officer_name"`
	OfficerRole string `gorm:"column:officer_role;not null" json:"officer_role"`
	ClubID      uint   `gorm:"column:club_id;not null" json:"club_id"`
}

type EventPermit struct {
	EventPermitID      uint   `gorm:"column:event_permit_id;primaryKey;autoIncrement" json:"event_permit_id"`
	EventName          string `gorm:"column:event_name;not null" json:"event_name"`
	PermitType         string `gorm:"column:permit_type;not null" json:"permit_type"`
	EventDescription   string `gorm:"column:event_description;not null" json:"event_description"`
	ExpectedAttendance int    `gorm:"column:expected_attendance;not null" json:"expected_attendance"`
	EventCategories    string `gorm:"column:event_categories;not null" json:"event_categories"`
	AdditionalNotes    string `gorm:"column:additional_notes" json:"additional_notes"`
	Status             string `gorm:"column:status;default:'draft'" json:"status"`
	SubmittedBy        string `gorm:"column:submitted_by;not null" json:"submitted_by"` // 👈 NEW
	CreatedAt          int64  `gorm:"column:created_at;default:(strftime('%s', 'now'))" json:"created_at"`

	Slots     []EventSlot     `gorm:"foreignKey:EventID"`
	Documents []EventDocument `gorm:"foreignKey:EventID"`
}

type EventSlot struct {
	EventSlotID uint   `gorm:"column:event_slot_id;primaryKey;autoIncrement" json:"event_slot_id"`
	EventID     uint   `gorm:"column:event_id;not null" json:"event_id"`
	StartTime   string `gorm:"column:start_time;not null" json:"start_time"`
	EndTime     string `gorm:"column:end_time;not null" json:"end_time"`
}

type EventDocument struct {
	EventDocumentID uint   `gorm:"column:event_document_id;primaryKey;autoIncrement" json:"event_document_id"`
	EventID         uint   `gorm:"column:event_id;not null" json:"event_id"`
	FileName        string `gorm:"column:file_name;not null" json:"file_name"`
	FileURL         string `gorm:"column:file_url;not null" json:"file_url"`
	UploadedAt      int64  `gorm:"column:uploaded_at;default:(strftime('%s', 'now'))" json:"uploaded_at"`
}

func (User) TableName() string {
	return "users"
}
func (Club) TableName() string {
	return "clubs"
}
func (Event) TableName() string {
	return "events"
}
func (Booking) TableName() string {
	return "bookings"
}
func (Announcement) TableName() string {
	return "announcements"
}

func (Officer) TableName() string {
	return "officers"
}

func (EventPermit) TableName() string {
	return "event_permits"
}

func (EventSlot) TableName() string {
	return "event_slots"
}

func (EventDocument) TableName() string {
	return "event_documents"
}

func InitDB() {
	var err error
	DB, err = gorm.Open(sqlite.Open("../gator_club_life.db"), &gorm.Config{})
	if err != nil {
		fmt.Println("error while connecting to the database:", err)
		return
	}
	fmt.Println("connected successfully")
}
