# Stage de build — gera os assets estáticos
FROM node:22-alpine AS builder

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

COPY . .

# URL da API pode ser sobrescrita no build
ARG VUE_APP_API_URL=http://localhost:3333
ENV VUE_APP_API_URL=$VUE_APP_API_URL

RUN npm run build

# Stage de runtime — nginx servindo a SPA
FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
