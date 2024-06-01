# Use the official Node.js image.
FROM node:14

# Install Tesseract OCR and Vietnamese language data.
RUN apt-get update && \
    apt-get install -y tesseract-ocr tesseract-ocr-vie && \
    apt-get clean && \
    rm -rf /var/lib/apt/lists/*

# Install necessary libraries for sharp
RUN apt-get update && \
    apt-get install -y libvips-dev

# Create app directory
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install app dependencies
RUN npm install

# Copy the rest of the application code
COPY . .

# Expose the port the app runs on
EXPOSE 8080

# Command to run the application
CMD [ "node", "server.js" ]
