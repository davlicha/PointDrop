# syntax=docker/dockerfile:1.6

# ========== deps ==========
FROM node:20-alpine AS deps
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl

COPY package*.json ./
COPY prisma ./prisma

RUN npm ci

# ========== builder ==========
FROM node:20-alpine AS builder
WORKDIR /app

RUN apk add --no-cache openssl

COPY --from=deps /app/node_modules ./node_modules
COPY . .

RUN npx prisma generate \
    && npm run build

# ========== runner ==========
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN apk add --no-cache openssl tini \
    && addgroup -S nodejs \
    && adduser -S nestjs -G nodejs

COPY --from=builder --chown=nestjs:nodejs /app/dist ./dist
COPY --from=builder --chown=nestjs:nodejs /app/node_modules ./node_modules
COPY --from=builder --chown=nestjs:nodejs /app/prisma ./prisma
COPY --from=builder --chown=nestjs:nodejs /app/package*.json ./

USER nestjs

EXPOSE 3000

ENTRYPOINT ["/sbin/tini", "--"]
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/src/main.js"]
