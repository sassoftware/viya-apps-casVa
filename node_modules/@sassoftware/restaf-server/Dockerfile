FROM node:12.16.1-alpine
LABEL maintainer="deva.kumar@sas.com"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080

#
# You can override these(but in container leave APPHOST as shown below)
# 

ENV APPHOST=0.0.0.0
ENV APPNAME=viyaapp
ENV APPLOC=./public
ENV APPENTRY=index.html
ENV APPPORT=8080

ENV AUTHFLOW=code
ENV CLIENTID=rafdemos

ENV CLIENTSECRET=secret
ENV KEEPALIVE=YES
ENV APPENV=appenv.js
ENV SAMESITE=None,false

ENV APPENV=appenv.js
# ENV NODE_TLS_REJECT_UNAUTHORIZED=0
CMD ["npm", "run", "indocker"]
# samesite: https://github.com/hapijs/hapi/issues/3987