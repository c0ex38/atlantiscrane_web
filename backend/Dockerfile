FROM node:20-alpine AS builder

# Prisma adapter-pg might need openssl depending on the exact alpine version
RUN apk add --no-cache openssl

WORKDIR /workspace/backend

# Copy package files
COPY backend/package*.json ./

# Install all dependencies (including dev dependencies for build)
RUN npm ci

# Copy the rest of the application
COPY backend/ ./
COPY frontend/src/app/lib/i18n/empty-dictionary.ts /workspace/frontend/src/app/lib/i18n/

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# --- Production Image ---
FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /workspace/backend

# Copy package files and install only production dependencies
COPY backend/package*.json ./
RUN npm ci --omit=dev

# Copy built application and prisma client
COPY --from=builder /workspace/backend/dist ./dist
COPY --from=builder /workspace/backend/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /workspace/backend/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /workspace/backend/prisma ./prisma
COPY --from=builder /workspace/backend/prisma.config.* ./

EXPOSE 3001

CMD ["npm", "run", "start:prod"]
