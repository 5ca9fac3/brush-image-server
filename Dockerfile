FROM node:18.12.1

WORKDIR /app

COPY . .

RUN npm install -g typescript \
    && npm install

COPY . .

RUN npm install -g socket.io

EXPOSE 8000 8000

CMD [ "npm", "run", "run:prod" ]