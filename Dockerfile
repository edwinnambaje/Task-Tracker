FROM node:18

WORKDIR /app

COPY package.json .
RUN npm i

COPY . .
EXPOSE 7002
ENV DATABASE_URL=postgres://postgres:postgres@localhost:5432/task
ENV PROD_DATABASE_URL=postgres://jlavbtwd:YSEVTvzneVnl4NvndbXYTvTp7CiuxuX_@mahmud.db.elephantsql.com/jlavbtwd
ENV SALTROUNDS=10
ENV PORT=7002
ENV SWAGGER_SERVER=http://localhost:7002
ENV JWT_SECRET=f3c945d88be1667d566591e1d99d5a61b9414f7bfabf08545c66d47016f99ed20b5bab9a4ed270b5c106caf93d09ee0d6bfc6fc65b8fd26d19fea8d4d735fd31
RUN npm run build
CMD [ "npm", "run", "start" ]
