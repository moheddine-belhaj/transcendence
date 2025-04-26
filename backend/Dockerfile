# Use full Node.js image instead of Alpine
FROM node:20

WORKDIR /usr/src/app

COPY package*.json ./

# Install Python and build tools
RUN apt-get update && apt-get install -y python3 make g++

RUN npm install

COPY . .

RUN mkdir -p /usr/src/app/data

ENV NODE_ENV=production
ENV PORT=5003
ENV DB_PATH=/usr/src/app/data/database.sqlite

EXPOSE 5003

CMD ["npm", "run", "dev"]