FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the application
COPY . .

# Pass NEXT_PUBLIC_ variables during build
ARG NEXT_PUBLIC_API_URL
ENV NEXT_PUBLIC_API_URL=${NEXT_PUBLIC_API_URL}

ARG NEXT_PUBLIC_SITE_URL
ENV NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL}

# Build the Next.js application
RUN npm run build

# --- Production Image ---
FROM node:20-alpine

WORKDIR /app

# Copy package files and install only production dependencies
COPY package*.json ./
RUN npm ci --omit=dev

# Copy built application
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# If using next.config.mjs or ts, copy it too if needed, but standard start usually doesn't strictly need it if standalone is not used.
# But it's safe to copy it.
COPY --from=builder /app/next.config.ts ./

EXPOSE 3000

# Set production environment
ENV NODE_ENV=production
ENV PORT=3000

CMD ["npm", "run", "start"]
