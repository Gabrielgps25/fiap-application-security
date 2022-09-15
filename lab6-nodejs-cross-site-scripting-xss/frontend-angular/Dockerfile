FROM node:14.17.4

WORKDIR /home/app
ENV PATH /home/node_modules/bin:$PATH

COPY . /home/app

RUN npm config set prefix "/home/node_modules"
RUN npm install -g @angular/cli@7.3.9
RUN npm install

CMD ng serve --watch=true --host=0.0.0.0