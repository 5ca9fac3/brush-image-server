FROM node:lts-slim

WORKDIR /app

COPY . .

RUN npm install -g typescript \
    && npm install

COPY . .

RUN npm install -g socket.io

EXPOSE 8000 8000

CMD [ "npm", "run", "prod" ]