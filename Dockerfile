# Use an official Node.js runtime as a parent image
# Using alpine for a smaller image size
FROM node:lts-alpine

# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install app dependencies
# Use a clean install to ensure a consistent dependency tree
RUN npm ci

# Bundle app source
COPY . .

# The app listens on port 3000, so we expose it
EXPOSE 3000

# Define the command to run the app
CMD [ "npm", "start" ]
