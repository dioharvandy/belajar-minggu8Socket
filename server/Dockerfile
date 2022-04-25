FROM node:16
WORKDIR ./socket-app
COPY package.json ./
RUN npm i
RUN npm run build
COPY . ./
CMD ["npm", "start"]