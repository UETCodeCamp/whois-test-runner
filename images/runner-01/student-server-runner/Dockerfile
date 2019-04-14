FROM node:10-alpine

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app
COPY package.json /usr/src/app/
RUN npm install
COPY . /usr/src/app

ENV PORT 3000
ENV MONGO_PATH mongodb
ENV MONGO_PORT 27017

EXPOSE 3000
CMD [ "npm", "start" ]
