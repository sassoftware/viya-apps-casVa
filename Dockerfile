FROM node:11.4.0
LABEL maintainer="deva.kumar@sas.com"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 8080

ENV APPNAME=optmodel

#
# Location of the application resources(html, shared resources etc...)
# each APPNAME corresponds to a sub-directory directory in this location with the same name as APPNAME.
# if current directory then set APPLOC to .
#
ENV APPLOC=./public

#
# Specify the html that is the entry point to your app.
# A good standard is to use index.html
#
ENV APPENTRY=logon.html
#
# APPHOST - Leave this as specified below
# The service will use the hostname where the app is running.
#
ENV APPHOST=0.0.0.0

#
# The port on which this app is expected to run
# 8080 is probably taken so use any valid available port no.
#
ENV APPPORT=5060

#
# You can turn off OAUTH2 base authentication
#
ENV OAUTH2=NO

#
# If you want the server to act like a proxy server to the Viya Server
# If this set to YES, rafserver will override OAUTH2 to be YES
#
ENV PROXYSERVER=NO

#
# is SAS server SSL enabled
#
ENV SAS_SSL_ENABLED=NO

#
# servers and clientid
#

ENV VIYA_SERVER=http://myviyaserver
# 
# set the redirect to http://localhost:APPPORT/optmodel/main.html
ENV AUTHFLOW=implicit
ENV CLIENTID=blogger
ENV REDIRECT=index.html

ENV TEMPLATECASLIB=Public
ENV TEMPLATETABLE=OUTPUT_SOL
ENV TEMPLATEREPORT=optModel1


#
# COST TABLE
#
ENV COSTNAME=INPUT_COST
ENV COSTCASLIB=Public

#
# caslib to use work and results
#

ENV WORKCASLIB=CASUSER
ENV WORKTABLE=OUTPUT_SOL
ENV WORKREPORT=latest

CMD [ "npm", "run", "indocker"]
