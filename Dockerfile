# syntax = docker/dockerfile:1

# Stage 1: Build the Nuxt app with Nitro server
ARG NODE_VERSION=23.3

FROM node:${NODE_VERSION}-slim as build

WORKDIR /app

# Copy package files and install dependencies
COPY --link package.json package-lock.json ./
RUN npm install

# Copy the rest of the application code and build the Nuxt app
COPY --link . .
RUN npm run build

# Stage 2: Run the Nuxt Nitro server
FROM node:${NODE_VERSION}-slim as serve

WORKDIR /app

# Copy the built application from the build stage
COPY --from=build /app/.output .

# Install production dependencies (optional, in case of server-side dependencies)
RUN npm install --production

# Expose the Nitro server port (default is 3000)
EXPOSE 3000

# Start the Nitro server
CMD ["node", ".output/server/index.mjs"]
