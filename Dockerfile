# Use Node.js base image
FROM node:20

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json first to leverage Docker cache
COPY package*.json ./

# Install both dependencies and devDependencies (for nodemon support)
RUN npm install --include=dev

# Install nodemon globally for better handling during development
RUN npm install -g nodemon

# Copy the entire project into the container
COPY . .

# Expose the port that the app runs on
EXPOSE 3000

# Start the app using nodemon for development
CMD ["npm", "run", "start:dev"]
