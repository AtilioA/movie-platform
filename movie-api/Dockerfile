# Development stage
FROM node:22-alpine AS development

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm ts-node tsconfig-paths

# Copy package files
COPY package.json pnpm-lock.yaml* ./

# Install dependencies
RUN pnpm install

# Copy application code
COPY . .

# Expose port
EXPOSE 3000

# Start the application in development mode
CMD ["pnpm", "exec", "ts-node", "src/dev-bootstrap.ts"]
