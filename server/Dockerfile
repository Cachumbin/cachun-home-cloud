FROM node:16
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p /home/cachumbin/cachun-home-cloud/server/uploads
EXPOSE 3000
CMD ["node", "server/index.js"]
