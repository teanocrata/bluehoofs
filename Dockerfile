FROM node:lts-alpine as base

WORKDIR /code

ENV PATH /code/node_modules/.bin:$PATH

COPY package.json ./
COPY yarn.lock .

FROM base as dev
RUN yarn --silent
COPY . .
CMD ["yarn", "start"]

