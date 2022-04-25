FROM node:16
WORKDIR ./socket-app
COPY package.json ./
RUN npm i
COPY . ./
CMD ["npm", "start"]