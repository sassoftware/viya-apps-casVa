# OptModel1

## Overview

This repository contains a simple demo showing the integration of SAS REST API, CAS actions, and Visual Analytics reports. [restaf](https://github.com/sassoftware/restaf) is used to make the code simple and easy to maintain. The OptModel1 application uses the runOptmodel CAS action to solve the optimization problem.

The following graphic illustrated the workflow of the application.
[Flow of the application](optmodelflow.png?raw=true "Flow of the application") to see the workflow.

## Prerequisites

### Viya Configurations

Applications such as this one usually run in a domain other than SAS Viya. So there are a few housekeeping details to attend to before you enjoy the benefits of the applications.

Please see <https://github.com/sassoftware/restaf/wiki/usefulTips>

### client_id and client_secret

Please see <https://github.com/sassoftware/restaf/wiki/Managing-clientids>. Use the authorization_code flow.

## Installation

- Clone this repository and cd to that directory
- Do an npm install

## Configuration

- Obtain an implicit flow clientid with a redirect of "http://localhost:5000/viyaapp"   (see below for details)
  
- Edit the app.env file and update CLIENTID and CLIENTSECRET

## Execution

- Issue the command "npm start"

- To invoke the app in browser

      <http://localhost:5000/viyaapp>

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
