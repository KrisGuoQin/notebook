FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm config set strict-ssl false && npm install && npm i -g prisma && prisma generate  && npm run build
CMD npm start
EXPOSE 3000
