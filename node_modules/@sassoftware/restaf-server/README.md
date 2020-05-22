# @sassoftware/restaf-server - web server in nodejs for SAS Viya Applications

---

Version 8

---
This server is designed for use with SAS Viya. It is customized using the env file and the Dockerfile.

The following authentication schemes are supported:

1. No authentication - the pages are served up as static pages.
2. Implicit flow
3. Authorization_code

TLS is also supported.

---

## SAS Viya Configuration

Please see <https://github.com/sassoftware/restaf/wiki/usefulTips> for key SAS Viya configurations for your app to work properly.

## Note for users of restaf-server@6.11.2

The handling of authentication is handled differently in this version.
Please see notes below.

## Installation

npm install @sassoftware/restaf-server

## Usage

```script
npx @sassoftware/restaf-server  --env=your-env-envfile --docker=your-DockerFile --appenv=your-appenv.js-file
```

The arguments env and docker are used to specify environment variables in a portable manner.

If you do not specify atleast one of these, you MUST set the values as environment variables.

The runtime environment variables are set in this order

1. Dockerfile - The ENV value are set as environment variables.

2. env file - The values in this file are used to override the defaults set through dockerfile and add other ones

3. If you want to set the values of some or all environment variables using some system script(ex: your Viya Server url) then do not specify them in either the dockerfile or env file.

   A note on EXPOSE and APPPORT - If you want to run in a container set APPPORT to be the same as EXPOSE and use docker runtime options to redirect to other ports. Usually 8080 (or 443 if running with tls) works fine.

4. appenv is used to specify application specific values that are available to the application at run time(see appenv below)

The recommended approach is:

1. Use Dockerfile  to specify values that are usually not overridden by users and is not a violation of **security policies**.
2. Use the env file for runtime environment variables
3. Use system SET commands to set the values - make sure you do not set the values in dockerfile or env file.

```docker
ENV optionName=

For example
ENV VIYA_SERVER=

In the environment variable set the value of VIYA_SERVER

SET VIYA_SERVER=http://yourViyaServer

```

## appenv option and the {yourappname}/appenv route  

There is a builtin route **/{appName}/appenv** that the application can use to obtain two objects.

1. LOGONPAYLOAD has the information related to the VIYA_SERVER. Please see below for details.

2. It also returns an object APPENV whose value is set to the javascript object returned from appenv.js

Let us consider an example:

A sample appenv.js file is shown below

```js
let myinfo = {
    caslib: 'casuser',
    table : 'foo'
}
return myinfo;
```

In your index.html you will have a script tag as follows:

```html
<script src="/{yourAppName}/appenv'><script>
```

In your javascript you now have access to two variables

1. LOGONPAYLOAD - this has information related to authentication

2. APPENV - a javascript object that has the values returned by the appenv.js file. In this example the APPENV variable will look as follows:

```js
APPENV = {
    caslib: 'casuser',
    table : 'foo'
}


## LOGONPAYLOAD

The general form of this object is:
{
      authType : <your authflow type>,
      redirect : <the redirect url>
      host     : <your viya server>
      clientID : <useful if using implicit flow and custom handling logon to Viya Server>,
      appName  : <APPNAME>,
      host     : <same as VIYA_SERVER>
      keepAlive: < see notes below>
    };
}

---

## No authentication

---
The env file is:

```env
APPENTRY=index.html
APPLOC=./public
```

The server will return the specified APPENTRY from the location specified in APPLOC. A good default is ./public. If you are using react quickstart then this is usually ./build

---

## Implicit flow

---

On successful authentication the server will redirect the user to the entry specified in the APPENTRY variable.

To use this scenario modify these files as follows:

### env file

```env
VIYA_SERVER=your-viya-server(http://...)
AUTHFLOW=implicit
CLIENTID=your implicit flow clientid with a redirect as described below)
APPNAME= < A name for your app. The app will start at APPHOST:APPPORT/APPNAME
APPPORT=some port number
APPENTRY=index.html
```

#### clientid redirect

Recommend the following:
Set the clientid redirect_uri to always be **{appName}/callback**

Example:
 If your APPNAME=viyaapp, APPHOST is localhost and APPPORT=8080
  
   <http://localhost:8080/viyaapp/callback>
   restaf-server will handle the callback and redirect to APPENTRY.

For backward compatability the following are currently supported. Please switch to the recommended redirect above.

<http://localhost:8080/viyaapp/index.html> where index.html is the value of REDIRECT setting in the enc file.

All this is unnecessary confusion for flexibility not really required - so switch to the simpler configuration discussed earlier.

---

## Authorization_code flow

---

Your env file should like something like this. The redirect for this flow is as follows:

```js
 If your APPNAME=viyaapp, APPHOST is localhost and APPPORT=8080, then set the redirect to <http://localhost:8080/viyaapp>

```

restaf-server will handle the callback and redirect to APPENTRY. The server will set the cookie to CookieAuth. The authorization token is not returned with the cookie.

```env
VIYA_SERVER=your-viya-server(http://...)
AUTHFLOW=code
CLIENTID=your authorization_code flow clientid with a redirect as described below)
CLIENTSECRET=your clientsecret
APPNAME=A name for your app. The app will start at APPHOST:APPPORT/APPNAME
APPENTRY=index.html
APPPORT=port of your choice
KEEPALIVE=Used to keep the session alive(see noes below)
```

---

### Docker file

---
You will need only one Dockerfile. Use the env file and environment variables to override the defaults in the dockerfile.

A good default Dockerfile is shown below

```docker
FROM node:12.4.0-alpine
LABEL maintainer="your-email"
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 8080

#
# You can override these(but when deploying in a docker container leave APPHOST as shown below)
#

ENV APPHOST=0.0.0.0
ENV APPPORT=8080
ENV APPNAME=viyaapp
ENV APPLOC=./public
ENV APPENTRY=index.html
ENV APPENV=appenv.js
CMD ["npm", "run", "indocker"]
```

### APPNAME

Assign a meaninful name for your app.

### APPHOST

Do not specify this - let the docker default it to localhost.

### APPLOC

This is the directory where restaf can find the static assets of your app. This is relative to the root of your application. Typically this is ./public

### APPENTRY

After a successful logon restaf will redirect to this entry specified via APPENTRY.

## Custom startup of server

---

This scenario is for users who want to add their own routes to the server.
But for most common cases there is no need to do this.

Create an app.js that looks as shown below. See <https://hapi.dev/> on details on how to define your routes.

```js
let rafserver = require ('./lib/index.js');
rafserver.icli (getCustomHandler ());

function getCustomHandler () {
    let handler =
    [
        {
            method: [ 'GET' ],
            path  : `/myroute`,
            config: {
                auth   : false,
                cors   : true,
                handler: myRouteHandler
            }
       }
    ];
    return handler;
    }

async function myRouteHandler(req, h) {
   ...
}
```

## keepAlive

This is only needed if you are using authorization_code flow.
In your web app you can call this end point to keep your current session alive.

If the KEEPALIVE environment variable is set, restaf-server will set the keepAlive key in the LOGONPAYLOAD object to the url to call for keeping your session alive. You can call it anytime in your app.

### A note for restaf users

restaf automatically calls this end point everytime a call is made to any Viya Service. If you wish to mimic the behavior of Viya Applications like SASVisualAnalytics you can call it everytime the user moves the mouse.

## TLS Support

You enable TLS using the following environment variables

### KEY and CERTIFICATE

TLS_KEY=path to the KEY
TLS_CERT= path to certificate

### PFX

Instead of key and certificate you can also use the pfx form and specify it as follows:

TLS_PFX=path to pfx file

### Passphrase

This can be specified as follows

TLS_PW=somevalue

It appears that for pfx this is a necessity(not really sure but my experience says so)

### CA Bundle

If you wish the server to use a different CA bundle than what is on the host specific the path to the bundle as follows:

TLS_CABUNDLE=path

### SAMESITE

Specify the SAMESITE values as follows:

SAMESITE=value,secureflag

where

```js
    value = None | Lax | Strict

    secureflag = secure|false
```

The default is None,false

## Some useful links

[Test url regular expressions](https://regex101.com/)

samesite: <https://github.com/hapijs/hapi/issues/3987>
