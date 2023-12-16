FROM node:latest

WORKDIR /app

RUN npm install -g typescript

COPY ./package.json ./tsconfig.json ./yarn.lock ./nuxt.config.ts .

RUN yarn install

COPY ./src ./src

RUN yarn build

CMD node .output/server/index.mjs
