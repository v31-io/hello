FROM node:23-slim

RUN apt-get update
RUN apt-get install -y wget

WORKDIR '/app'
COPY package.json .
RUN npm install
COPY . .
EXPOSE 4000
CMD ["node", "index.js"]