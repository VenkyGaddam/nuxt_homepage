# syntax = docker/dockerfile:1

ARG NODE_VERSION=23.3

FROM node:${NODE_VERSION}-slim as base

ARG PORT=5173

WORKDIR /

# Build
FROM base as build

COPY --link package.json package-lock.json ./
RUN npm install

COPY --link . .

RUN npm run build

# Run
FROM base

ENV PORT=$PORT
ENV NODE_ENV=production

COPY --from=build /.output /.output
# Optional, only needed if you rely on unbundled dependencies
# COPY --from=build /src/node_modules /src/node_modules

CMD [ "node", ".output/server/index.mjs" ]