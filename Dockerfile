FROM node:22.16.0-slim
WORKDIR /home/app

COPY package.json .
COPY package-lock.json .
RUN npm install --production
COPY . .

EXPOSE 3000
CMD [ "npm", "start" ]