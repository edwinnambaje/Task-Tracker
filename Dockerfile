FROM node:18

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .

EXPOSE 3005

CMD ["npm", "run", "start:prod"]