# Use the official Playwright image
FROM mcr.microsoft.com/playwright:latest

# Set the working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the application code
COPY . .

# Expose the port your app listens on
EXPOSE 3000

# Start the application
CMD ["node", "index.js"]
