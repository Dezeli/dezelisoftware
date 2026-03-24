FROM node:20-slim AS build-stage

RUN npm install -g pnpm

WORKDIR /app

COPY pnpm-lock.yaml package.json /app/
RUN pnpm install --frozen-lockfile

COPY . /app/
RUN pnpm run build

FROM nginx:stable-alpine

COPY --from=build-stage /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]