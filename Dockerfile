# syntax = docker/dockerfile:1

# Adjust NODE_VERSION as desired
ARG NODE_VERSION=18.17.1
#FROM node:${NODE_VERSION}-slim as base
FROM node:${NODE_VERSION}-bullseye as base

# Update npm to the latest version
RUN npm install -g npm@latest

LABEL fly_launch_runtime="Node.js"

# Node.js app lives here
WORKDIR /app

# Set production environment
ENV NODE_ENV="production"


# Throw-away build stage to reduce size of final image
FROM base as build

# Install packages needed to build node modules
RUN apt-get update -qq && \
    #apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3
    apt-get install --no-install-recommends -y build-essential node-gyp pkg-config python-is-python3 libstdc++6


# Install node modules
COPY --link package-lock.json package.json ./
RUN npm ci

# Copy application code
COPY --link . .


# Final stage for app image
FROM base

# Copy built application
COPY --from=build /app /app

# Start the server by default, this can be overwritten at runtime
EXPOSE 8080
CMD [ "npm", "run", "start" ]
