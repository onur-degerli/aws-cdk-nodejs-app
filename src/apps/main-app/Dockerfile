FROM node:22-alpine AS build
WORKDIR /usr/src

RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

COPY pnpm-lock.yaml pnpm-workspace.yaml package.json tsconfig.base.json ./
COPY common/package.json common/
COPY db/orm/package.json db/orm/
COPY apps/main-app/package.json apps/main-app/
RUN pnpm install --filter @app/main-app... --frozen-lockfile

COPY . .
RUN pnpm --filter @app/main-app build

FROM node:22-alpine
WORKDIR /usr/src/app

RUN corepack enable && corepack prepare pnpm@10.18.1 --activate

COPY --from=build /usr/src/apps/main-app/package.json ./package.json
COPY --from=build /usr/src/node_modules ./node_modules
COPY --from=build /usr/src/apps/main-app/dist ./dist

EXPOSE 3000
CMD ["node", "dist/index.js"]
