
FROM node:22.19-slim AS build
ARG VITE_PROFILER_ENABLED=false
ARG VITE_LOG_LEVEL=info

ENV DEBIAN_FRONTEND=noninteractive

# Update package lists and upgrade libpng1.6 (libpng16-16 runtime)
# to fix a security vulnerability (CVE-2025-64720)
RUN set -eux; \
    apt-get update; \
    apt-get install -y --no-install-recommends libpng16-16; \
    rm -rf /var/lib/apt/lists/*

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
FROM nginxinc/nginx-unprivileged:stable AS deployment

COPY nginx.conf /etc/nginx/nginx.conf
ARG DOCROOT=/usr/share/nginx/html
COPY --from=build /app/dist ${DOCROOT}

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
