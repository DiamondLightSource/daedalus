
FROM node:22.19-slim as build

WORKDIR /app
RUN adduser --disabled-password --gecos "" appuser && chown -R appuser /app
USER appuser

COPY package*.json ./
RUN npm ci

COPY . .
RUN rm -rf .env

# These are currently set at build time.
# we're going to need to switch to runtime configuration
ARG VITE_PVWS_SOCKET=pvws.diamond.ac.uk:443
ARG VITE_PVWS_SSL=true
ARG VITE_PROFILER_ENABLED=false
ARG VITE_THROTTLE_PERIOD=100
ARG VITE_LOG_LEVEL=info

RUN npm run build:nolint

FROM nginxinc/nginx-unprivileged:stable as deployment

ARG DOCROOT=/usr/share/nginx/html
COPY --from=build /app/dist ${DOCROOT}

EXPOSE 8080

CMD ["nginx", "-g", "daemon off;"]
