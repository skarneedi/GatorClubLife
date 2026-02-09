# Development Stage
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install dependencies needed for some packages (like node-gyp) if necessary. 
# Usually alpine version is fine for basic angular app.
# If you encounter issues with node-gyp, uncomment the next line:
# RUN apk add --no-cache python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies
RUN npm install

# Install Angular CLI globally (optional but good for specific commands)
RUN npm install -g @angular/cli

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 4200

# Start the application
CMD ["ng", "serve", "--host", "0.0.0.0"]
