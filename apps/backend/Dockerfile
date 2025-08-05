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

# Instalações adicionais para watch
RUN apk add --no-cache bash libc6-compat

WORKDIR /app

# Copia apenas os arquivos de dependência primeiro (para cache)
COPY package*.json ./

# Instala TODAS as dependências (incluindo dev)
RUN npm install

# Copia o restante do projeto
COPY . .

# Expõe a porta que o backend usa
EXPOSE 3001

# Comando para desenvolvimento
CMD ["npm", "run", "dev"]
