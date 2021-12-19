FROM node:16-alpine3.11

# set work dir
WORKDIR /app

# copy file into /app
COPY . .

# install dependencies
# RUN yarn

# build ts
RUN yarn build

#start project
CMD ["yarn", "serve"]