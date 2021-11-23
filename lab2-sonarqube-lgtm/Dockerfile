FROM node:14.17.4-alpine
EXPOSE 3000 9229

WORKDIR /home/app

COPY src/* /home/app/

RUN npm i express \ 
    && npm i mysql2

CMD node app.js
