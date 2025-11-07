
FROM node:22.19-slim as build
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
FROM nginxinc/nginx-unprivileged:stable as deployment

ARG DOCROOT=/usr/share/nginx/html
COPY --from=build /app/dist ${DOCROOT}

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
