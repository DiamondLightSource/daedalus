
FROM node:22.19-slim AS build
ARG VITE_PROFILER_ENABLED=false
ARG VITE_LOG_LEVEL=info

WORKDIR /app
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

COPY package*.json ./
RUN npm ci

# Copy source code for build
COPY public/ ./public/
COPY src/ ./src/
COPY index.html ./
COPY *.json ./

RUN npm run build:nolint

# Create image for deployment
FROM nginxinc/nginx-unprivileged:1.29-alpine AS deployment

# Update package lists and upgrade libpng1.6 
# to fix a security vulnerability (CVE-2026-22695)
USER root
RUN apk update && apk add --no-cache "libpng>=1.6.54"

USER nginx
COPY nginx.conf /etc/nginx/nginx.conf
ARG DOCROOT=/usr/share/nginx/html
COPY --from=build /app/dist ${DOCROOT}

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
