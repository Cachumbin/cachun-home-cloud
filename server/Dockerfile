FROM node:16
WORKDIR /home/cachumbin/cachun-home-cloud/server
COPY package*.json ./
RUN npm install
COPY . .
RUN mkdir -p /home/cachumbin/cachun-home-cloud/server/uploads
EXPOSE 3000
CMD ["node", "index.js"]
