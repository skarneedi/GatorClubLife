# Build Stage
FROM golang:1.23-alpine AS builder

# Install build dependencies for SQLite (CGO)
RUN apk add --no-cache gcc musl-dev

WORKDIR /app

# Copy go mod and sum files
COPY go.mod go.sum ./

# Download dependencies
RUN go mod download

# Copy the source code
COPY . .

# Build the application
# CGO_ENABLED=1 is required for SQLite
RUN CGO_ENABLED=1 GOOS=linux go build -o main .

# Runtime Stage
FROM alpine:latest

WORKDIR /root/

# Install runtime dependencies for SQLite
RUN apk add --no-cache sqlite-libs

# Copy the binary from the builder stage
COPY --from=builder /app/main .

# Expose the application port
EXPOSE 8080

# Command to run the executable
CMD ["./main"]
