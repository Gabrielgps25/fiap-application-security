FROM node:14.17.4-alpine
EXPOSE 3000

WORKDIR /home/app

COPY . /home/app

RUN npm i express \ 
    && npm i mysql2 \
    && npm i express-rate-limit \
    && npm i express-oauth2-jwt-bearer

CMD node app.js
