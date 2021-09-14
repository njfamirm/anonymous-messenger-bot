FROM node:16-alpine3.11

# set work dir
WORKDIR /app

# copy file into /app
COPY . .

# install dependencies
RUN yarn

#start project
CMD ["yarn", "serve"]