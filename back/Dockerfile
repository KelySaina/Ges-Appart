# Use official Node.js image from the Docker Hub
FROM node:14

# Install netcat (nc)
RUN apt-get update && apt-get install -y netcat

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json (if exists) to the container
COPY package*.json ./

# Install the application dependencies
RUN npm install

# Copy the rest of the application code to the container
COPY . .

# Expose the port the app will run on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "dev"]
