FROM node:20-alpine

WORKDIR /app

COPY validator_src/package*.json ./
RUN npm install --production

COPY validator_src/ .

EXPOSE 3000

CMD ["npm", "start"]
