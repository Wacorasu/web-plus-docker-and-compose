FROM node:16-alpine AS builder
WORKDIR /var/www/app
COPY package*.json ./
RUN npm ci --no-audit --no-fund
COPY . .
RUN npm run build

FROM node:16-alpine as production
WORKDIR /var/www/app

COPY --from=builder /var/www/app/package*.json ./

RUN npm ci --no-audit --no-fund --omit=dev 
RUN npm i --no-audit --no-fund -g pm2

COPY --from=builder /var/www/app/dist ./dist/
COPY ecosystem.config.js ./
COPY .env ./

CMD ["pm2-runtime", "start", "ecosystem.config.js", "--env", "production"] 