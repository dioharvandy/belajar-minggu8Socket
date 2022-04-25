FROM node:16
WORKDIR ./socket-app
COPY package.json ./back-end
RUN npm i
RUN npm run build
COPY . ./back-end
CMD ["npm", "start"]