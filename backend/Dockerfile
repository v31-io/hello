FROM node:lts-slim
    
# Set the working directory in the container
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application source code to the container
COPY . .

# Expose the port your app is listening on
EXPOSE 4000

# Define the command to start your Node.js application
CMD [ "node", "index.js" ]