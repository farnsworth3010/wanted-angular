FROM node:20 as build
WORKDIR /usr/local/app
COPY ./ /usr/local/app/
RUN npm install
RUN npm install -g @angular/cli
RUN ng build 

FROM nginx:latest
COPY --from=build /usr/local/app/dist/wanted/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80