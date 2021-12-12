FROM node:16-alpine
RUN npm i -g npm-check-updates
COPY ./package.json .
COPY ./package-lock.json .
RUN npm i
COPY . .
RUN ncu
RUN npm run build

FROM nginx:1.21.3-alpine
RUN mkdir /usr/share/nginx/html/data
COPY ./docker/nginx.conf /etc/nginx/nginx.conf
COPY ./docker/default.conf /etc/nginx/conf.d/default.conf
COPY --from=0 ./dist/ /usr/share/nginx/html/
