FROM node:18

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .
EXPOSE 3005
RUN npm run build
CMD [ "npm", "run", "start" ]
