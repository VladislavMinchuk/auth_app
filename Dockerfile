FROM node:18-alpine AS base

WORKDIR /app

COPY [ "package*.json", "./" ]

FROM base AS dev
RUN npm install
COPY . .
CMD ["npm", "run", "start:dev"]
