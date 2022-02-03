FROM node:13.14-alpine

RUN mkdir -p usr/app

WORKDIR /usr/app

COPY package*.json yarn.lock ./

RUN yarn install

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "serve", "-s", "build", "-l", "3000" ]
