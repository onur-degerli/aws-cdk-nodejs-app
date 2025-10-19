FROM node:22-alpine
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY tsconfig.json ./
COPY server.ts ./

RUN npx tsc

EXPOSE 3000

CMD ["node", "dist/server.js"]