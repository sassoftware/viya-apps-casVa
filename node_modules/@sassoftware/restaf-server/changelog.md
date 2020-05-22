# Changes

## Version 8.0.0

- requires nodejs 12.16.x or greater

- **implicit flow authentication:**
  - Remove the REDIRECT env variable
  - set your redirectUri in the clientid to {yourserver}/{yourappname}/callback

- **authorization code authentication**
  - This is now supported and is the recommended way. Requires SAS Viya 3.5 maintainance release(Feb 2020) or higher.
  - See the README file for details
  - TLS is now supported - please see README file. Note the configurations required in SAS Viya to enable this.

## Version 7.0.0

- Added support for using Dockerfile + pre-set environment variables with the following precedence order

### Installation

In your application do an **npm install restaf-server**

### Install

npm install restaf-server

## Usage

```script
npx restaf-server  <--env=envfile> <--docker=dockerfile> <--appenv=appenvfile>
```

You must specify one or both of env and docker arguments. The values are overridden in this order:

1. env file (see note below)
2. docker files
3. preset environment variables - used if not specified by the previous two files.

---

  **The env option is supported for backward compatability. In new applications use the dockerfile and preset environment variables. This will make it easier to test and deploy the application either in Docker or as a bare OS application.**

---

The recommended approach is:

1. Use dockerfile  to specify values that are best not overriden by users. To indicate that you are expecting the value to be specified in the environment variable use the following syntax

```docker
ENV optionName=

For example
ENV VIYA_SERVER=

In the environment variable set the value of VIYA_SERVER

SET VIYA_SERVER=http://yourViyaServer

```

## Version 6.10.0

- Removed dependency on shelljs - not used any more.
- Allow inherting of env variables while processing th env file if the following. Inheriting is done if the variable is either not set in the env file or
         SET NAME
         SET NAME=

## Version 6.0.0

- Fixed issues with depedencies
  - Fixed issues with /appenv not being processed properly
  - Removed includes for hot-module since it does not work yet.

## Verson 5.0.0

- Changes to the cli version are **breaking changes**. Stay with pre 5.* version if you want the previous behavior.
- Upgraded the packages and in particular Babel and Webpack.
    . Using Babel to build the code in this release but the webpack config is left intact for reference.
- Added new entry point of app to accept named parameters just as the new cli version does
- Recommendations:
  - The growing trend is to install packages locally and use npx to execute them.
- Under-development:
  - Support for Hot-Module Replacement

## Version 4.4.0

  . Support specifing VIYA_SERVER with protocol

  This simplifies the set up of applications
  