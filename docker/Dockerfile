# syntax = docker/dockerfile:1

ARG IMAGE=oven/bun:1

FROM ${IMAGE} as env
WORKDIR /home/bun/app
ENV PORT=4000
ENV DATABASE_URL="postgres://postgres:postgres@postgres:5432/elysia_app_template"
ENV JWT_ACCESS_SECRET="N0t5oSecret"
ENV JWT_REFRESH_SECRET="N0t5oFre5h"
EXPOSE 4000
EXPOSE 9229

FROM env as node
RUN apt update -y
RUN apt install nodejs -y

# use the official Bun image
# see all versions at https://hub.docker.com/r/oven/bun/tags
FROM env as base
COPY --link patches patches
COPY --link package.json bun.lockb ./

# install dependencies into temp directory
# this will cache them and speed up future builds
FROM base AS installall
RUN mkdir -p /temp/dev
COPY --from=base --link /home/bun/app/patches /temp/dev/patches
COPY --from=base --link /home/bun/app/package.json /home/bun/app/bun.lockb /temp/dev/
RUN cd /temp/dev && bun install --frozen-lockfile

# copy node_modules from temp directory
# then copy all (non-ignored) project files into the image
FROM base AS prerelease
COPY --from=installall /temp/dev/node_modules node_modules
COPY --link . .

FROM node as development
COPY --from=prerelease --link . .
RUN rm -rf node_modules
COPY --from=prerelease --link /home/bun/app/node_modules node_modules

# build dist
FROM prerelease AS build
RUN bun run build

# install with --production (exclude devDependencies)
FROM base AS install
RUN mkdir -p /temp/prod
COPY --from=base --link /home/bun/app/patches /temp/prod/patches
COPY --from=base --link /home/bun/app/package.json /home/bun/app/bun.lockb /temp/prod/
RUN cd /temp/prod && bun install --frozen-lockfile --production

# copy production dependencies and source code into final image
FROM node AS release
COPY --from=install /temp/prod/node_modules node_modules
COPY --from=install /temp/prod/package.json /temp/prod/bun.lockb ./
COPY --from=build /home/bun/app/db db
COPY --from=build /home/bun/app/dist dist
COPY --from=build /home/bun/app/tsconfig.json /home/bun/app/.sequelizerc ./

# run the app
ENV NODE_ENV="production"
USER bun
ENTRYPOINT [ "bun", "start" ]
