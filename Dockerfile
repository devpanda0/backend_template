FROM node:lts-alpine AS build

# make the 'app' folder the current working directory
WORKDIR /

# copy both 'package.json' and 'package-lock.json' (if available)
COPY package*.json ./

# install project dependencies
RUN yarn install

# copy project files and folders to the current working directory (i.e. 'app' folder)
COPY . .

# build app for production with minification
RUN yarn run build


FROM socialengine/nginx-spa:latest

COPY --from=build ./dist /app
COPY --from=build nginx-site.conf /etc/nginx/conf.d/default.conf

RUN chmod -R 777 /app
