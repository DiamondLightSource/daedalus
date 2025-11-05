
FROM node:22.19-slim as build

WORKDIR /app

COPY . .
RUN rm .env

ARG VITE_PVWS_SOCKET=pvws.diamond.ac.uk:443
ENV VITE_PVWS_SSL=true
ENV VITE_PROFILER_ENABLED=false
ENV VITE_THROTTLE_PERIOD=100
ENV VITE_LOG_LEVEL=info

RUN npm install
RUN npm run build:nolint

FROM nginx:latest as deployment

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf

EXPOSE 80/tcp

CMD ["/usr/sbin/nginx", "-g", "daemon off;"]
