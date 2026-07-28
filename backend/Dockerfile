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

HEALTHCHECK --interval=30s --timeout=5s --start-period=20s --retries=3 \
  CMD ["node", "-e", "fetch('http://127.0.0.1:3001/api/v1/health').then(r=>{if(!r.ok)process.exit(1)}).catch(()=>process.exit(1))"]

CMD ["npm", "run", "start:prod"]
