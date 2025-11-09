FROM node:22-alpine AS build
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx tsc

FROM node:22-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --omit=dev

COPY --from=build /usr/src/app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]