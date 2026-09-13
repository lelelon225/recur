# Stage 1: Build
FROM node:20-alpine AS build-stage
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile
COPY . .
# Backend is reached through this same container's nginx /api/ proxy
# (see nginx.conf.template), so the API base is always same-origin.
ENV VITE_API_URL=/api
RUN yarn build

# Stage 2: Serve
FROM nginx:1.27-alpine
COPY --from=build-stage /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
COPY nginx.conf.template /etc/nginx/templates/default.conf.template
# Which compose service to proxy /api/ to - overridden per environment
# (backend-dev / backend-prod) via the container's BACKEND_HOST env var.
ENV BACKEND_HOST=backend-prod
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
