FROM node:18.12.1

WORKDIR /app

COPY package.json ./

RUN npm install -g typescript \
    && npm install \
    && npm install -g socket.io

COPY . .

EXPOSE 8000 8000

CMD [ "npm", "run", "run:prod" ]