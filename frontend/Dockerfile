# Development Dockerfile
FROM node:20-alpine

WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .

# Ensure the lovable-tagger can run
RUN apk add --no-cache python3 make g++

EXPOSE 8080
CMD ["npm", "run", "dev"]