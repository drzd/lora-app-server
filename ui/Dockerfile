# Version: 0.0.1
FROM node:9
MAINTAINER Ilya Petukhov <ip@decast.com>

WORKDIR /code
COPY package*.json ./
RUN npm install

COPY . /code

EXPOSE 3000
CMD npm start