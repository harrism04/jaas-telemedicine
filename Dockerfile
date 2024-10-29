# Use Node.js LTS (Long Term Support) version
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package*.json ./
RUN npm install

# Copy all files
COPY . .

# Build the Next.js application
RUN npm run build

# Add a healthcheck
HEALTHCHECK --interval=30s --timeout=30s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:3000/api/health || exit 1

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["npm", "start"] 