
FROM node:20.11.1.-alpine AS base

RUN npm i -g pnpm

FROM base AS dependencies

WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install

FROM base AS build

WORKDIR /app
COPY . .
COPY --from=dependencies /app/node_modules ./node_modules

RUN pnpm prisma generate

RUN pnpm build

RUN pnpm prune --prod

FROM base AS deploy

WORKDIR /app

COPY --from=build /app/dist ./dist
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/prisma ./prisma

EXPOSE 3333

CMD ["pnpm", "start:migrate:prod"]
