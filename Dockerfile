FROM node:18.12.1

WORKDIR /home/apps/prog-img

COPY . .

RUN npm install --no-optional

RUN npm install -g typescript @types/node

EXPOSE 8000 8000

RUN npm run compile

CMD [ "npm", "start" ]