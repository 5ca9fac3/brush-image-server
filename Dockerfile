FROM node:18.12.1

WORKDIR /app

COPY . .

RUN npm install -g typescript \
    && npm install --no-optional \
    && npm run compile

COPY . .

EXPOSE 8000 8000

CMD [ "npm", "start" ]