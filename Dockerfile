# Use the official Node.js runtime as a parent image
FROM node:16 as build

# Set the working directory to /app
WORKDIR /app

# Copy the package.json and package-lock.json files to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Build the Express application
RUN npx ts-node build.ts

CMD ["node", "-r", "module-alias/register", "./dist"]

