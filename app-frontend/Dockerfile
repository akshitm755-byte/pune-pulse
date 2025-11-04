# --- Stage 1: Build the React App ---
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all source code
COPY . .

# Build the static files
RUN npm run build

# --- Stage 2: Serve with Nginx ---
FROM nginx:1.21-alpine

# Copy the built static files from the 'builder' stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Nginx listens on port 80
EXPOSE 80

# When the container starts, just run nginx
CMD ["nginx", "-g", "daemon off;"]