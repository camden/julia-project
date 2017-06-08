# Create image based on the official Node 8 image from the dockerhub
FROM node:8

# Create a directory where our app will be placed
RUN mkdir -p /usr/julia-project

# Change directory so that our commands run inside this new directory
WORKDIR /usr/julia-project

# Copy dependency definitions
COPY package.json /usr/julia-project

# Install dependencies
RUN npm install

# Get all the code needed to run the app
COPY . /usr/julia-project

# Expose the port the app runs in
EXPOSE 8080

# Serve the app
CMD ["npm", "start"]
