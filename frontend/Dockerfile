# # Stage 1: Build the Vite app
# FROM node:20-alpine AS builder
# WORKDIR /app

# # Copy package files first (caching optimization)
# COPY package*.json ./

# # Install dependencies
# RUN npm install --legacy-peer-deps

# # Copy the rest of the files
# COPY . .

# # Build the app (generates files in /app/dist)
# RUN npm run dev

# # Stage 2: Serve with Nginx
# FROM nginx:alpine

# # Copy Nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# # Copy built files from builder
# COPY --from=builder /app/dist /usr/share/nginx/html

# # Expose port 80 (Nginx default)
# EXPOSE 80

# # Start Nginx
# CMD ["nginx", "-g", "daemon off;"]
FROM node:20-alpine

WORKDIR /app

# Copy package files and install deps
COPY package*.json ./
RUN npm install --legacy-peer-deps

# Copy source files
COPY . .

# Expose Vite's default port
EXPOSE 5173

# Run the dev server
CMD ["npm", "run", "dev"]
