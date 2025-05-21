# Step 1: Build
FROM node:18 AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Step 2: Serve using lightweight web server
FROM node:18-slim

WORKDIR /app

# Install 'serve' to serve the frontend build
RUN npm install -g serve

# Copy the built app from previous stage
COPY --from=builder /app/dist ./dist

# Expose port 80 for the frontend
EXPOSE 80

# Start the static server
CMD ["serve", "-s", "dist", "-l", "80"]
