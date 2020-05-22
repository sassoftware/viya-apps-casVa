# OptModel1
## Overview
This repository contains a simple demo showing the integration of SAS REST API, CAS actions, and Visual Analytics reports. [restaf](https://github.com/sassoftware/restaf) is used to make the code simple and easy to maintain. The OptModel1 application uses the runOptmodel CAS action to solve the optimization problem.

The following graphic illustrated the workflow of the application. Click 
[Flow of the application](optmodelflow.png?raw=true "Flow of the application") to see the workflow.

## Prerequisites
Applications such as this one usually run in a domain other than SAS Viya. So there are a few housekeeping details to attend to before you enjoy the benefits of the applications.

These are usually done by your SAS Adminstrator.

### CORS
CORS must be enabled. This can be done using SAS Environment Manager(EV)
In EV follow this sequence 

1. Select **configuration** from the menu on the left
2. Select **Definitions** from te View drop-down menu
3. Select **sas.commons.web.security.cors** from the list
4. Edit the configuration and set allowed Origin to be appropriate. For testing you can set this to *, but your company might have rules regarding what is allowed.
5. No restart of servers is needed.


### iframe

This must be enabled if you wish to embed SAS Visual Analytics reports. This can be done using SAS Environment Manager(EV)
In EV follow this sequence 

1. Select **configuration** from the menu on the left
2. Select **Definitions** from te View drop-down menu
3. Select **sas.commons.web.security** from the list
4. Edit the SAS Report Viewer, SAS Visual Analytics and SAS Logon configurations.
     
     - set x-frame-options-enabled to off.

5. **A restart of these three servers is required.**

### client_id and client_secret

A customer application must be registered to access the server. This registeration will result in creation of a client_id and optionally a client secret.

There are essentially three types of registerations - usually called "Oauth flows"

1. Password flow - useful for server side apps like nodejs apps
2. Implicit flow - useful for browser-based apps like this one ( No client_secret for this flow)
3. authorization-code flow -  Specifiy client_secret when planning to use this on a server-side app - like a proxy server that serves up the application.

You can see more details  [here](https://developer.sas.com/reference/auth/#register)

### redirect_uri

The redirect specification has to be of this form:


 http://{APPHOST}:{APPPORT}/optmodel/index.html

 Substitute the values of APPHOST and APPPORT from the app.env file.

### regclient.sh

For your convenience a shell script is included in this repository. ssh to the Viya server as an admin and run this script. 

We have also included a version of this to be used with secured Viya deployments: regclientHttps.sh.  

Usage:


```
sudo sh regclient.sh  [-f flow] [-c clientId] [-s client_secret] [-r redirect_uri]

```
-  flow and clientId are required. clientSecret and redirect_uri are optional based on the flow.

- flow - valid values are password|implicit|authorization_code

- clientId - some string that you can remember. 

- client_secret - some string that you can remember. Not valid for implicit flow.
    

- redirect_uri - use only for implicit and authorization_flow.

### Examples

sudo regclient -f implicit -c blogger -r http://localhost:5006/optmodel/index.html 

sudo regclient -f authorization_code -c blogger1 -s sunrise -r http://localhost:5006/optmodel

example usage to create a password secret: sudo ./regclientHttps.sh -f password -c {client} -s {secret}


# Installation

- Clone this repository and cd to that directory
- Do an npm install 


## Configuration 

  - Obtain an implicit flow clientid with a redirect of "http://localhost:5006/optmodel/index.html"   (see below for details)
  
  - Edit the app.env file and update the indicated variables

## Execution

  - Issue the command "npm start"

  - To invoke the app in browser

      http://localhost:5006/optmodel


## Execution in Docker

  - edit Dockerfile
     
     Set the appropriate values for VIYA_SERVER and CLIENTID
     
  - To build
       
       docker build -t optmodel .

  - To run

       docker run -p 5006:8080 -t optmodel

  - To invoke the application in browser

       http://localhost:5006/optmodel

## Contributing

We welcome your contributions! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for details on how to submit contributions to this project.

## License

This project is licensed under the [Apache 2.0 License](LICENSE).

## Support 

We use GitHub for tracking bugs and feature requests. Please submit a GitHub issue or pull request for support.

## Additional Resources

- [SAS user blog post](https://blogs.sas.com/content/sgf/sas-rest-apis-sample-application/) for example application deployment

- [restaf github repository](https://github.com/sassoftware/restaf)

- [restaf-server github repository](https://github.com/sassoftware/restaf-server)



