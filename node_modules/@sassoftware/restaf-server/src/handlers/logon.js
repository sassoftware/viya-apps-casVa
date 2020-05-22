/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/

let debug = require('debug')('logon');

async function logon (req, h) {
    debug('redirect', process.env.REDIRECT);
    debug('authflow', process.env.AUTHFLOW);

    if (process.env.AUTHFLOW === 'implicit') {
        let x = `${process.env.VIYA_SERVER}/SASLogon/oauth/authorize?response_type=token&client_id=${process.env.CLIENTID}`;
		let redirectUri = `http://${process.env.APPHOST}:${process.env.APPPORT}/callback?host=${process.env.VIYA_SERVER}`;
		let url = `${x}&redirect_uri=${redirectUri}`;
        return h.redirect(url);

    } else {
        let indexHTML = (process.env.APPENTRY == null) ? 'index.html' : process.env.APPENTRY;
        console.log(`Redirecting to default ${indexHTML}`);
        return h.file(indexHTML);
    }
}





export default logon;