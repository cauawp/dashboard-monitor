# # PRODUÇÃO
# FROM node:18-alpine AS builder

# WORKDIR /app
# COPY package*.json ./
# RUN npm install
# COPY . .
# RUN npm run build

# # Etapa de produção
# FROM node:18-alpine

# WORKDIR /app
# COPY --from=builder /app/dist ./dist
# COPY package*.json ./
# RUN npm install --omit=dev

# ENV NODE_ENV=production
# CMD ["node", "dist/server.js"]

FROM node:18-alpine

# Instala bash e inotify-tools para melhor watch e hot reload
RUN apk add --no-cache bash libc6-compat

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

CMD ["npm", "run", "dev"]
