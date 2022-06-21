# maintainer: Michelle Suh michsuh1@gmail.com

# stage 1
FROM node:18-alpine AS build-step

WORKDIR /app
COPY . .
RUN npm ci
RUN npm run build

#COPY package.json /app
#RUN npm install
#COPY . /app
#RUN npm run build --prod

# A different version
# COPY . .
# RUN npm ci && npm run build

# stage 2
FROM nginx:alpine
COPY --from=build-step /app/dist/silloker-web /usr/share/nginx/html

# We will make silloker web is exposed on 4200
EXPOSE 80