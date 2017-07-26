FROM node:8.2.1

WORKDIR app

# Run npm install first for nice caching
ADD package.json package.json
RUN npm install --production

ADD . .

CMD ["npm", "start"]