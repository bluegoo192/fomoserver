FROM node:7

WORKDIR /fomoapp

COPY . /fomoapp

RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
