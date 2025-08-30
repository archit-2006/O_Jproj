# FROM node:24-alpine
# WORKDIR /compiler_backend
# RUN apk update && apk add --no-cache \
#     python3 \
#     py3-pip \
#     g++ \
#     openjdk17 \
# && ln -sf python3 /usr/bin/python
# COPY package*.json ./
# RUN npm install
# COPY . .

# EXPOSE 4000
# CMD ["node","index.js"]
# Use lightweight Node.js base image
FROM node:24-alpine

# Set working directory inside container
WORKDIR /compiler_backend

# Copy only package.json + package-lock.json first
COPY package*.json ./

# Install Node dependencies
RUN npm install

# Copy the rest of your project files
COPY . .

# Install compilers/interpreters
RUN apk update && apk add --no-cache \
    python3 \
    py3-pip \
    g++ \
    openjdk17 \
 && ln -sf python3 /usr/bin/python

# Expose your backend port (change if you’re using 6000)
EXPOSE 4000

# Start the server
CMD ["node", "index.js"]
