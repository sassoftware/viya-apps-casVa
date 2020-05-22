/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
'use strict';


import codeAuth from './codeAuth';

// handle all callback

async function appCallback (req, h) {
    let debug = require('debug')('callback');
    console.log(`..... AUTHFLOW: ${process.env.AUTHFLOW}`);
    debug('passing thru appCallback');
    // if authorization code process the auth info from saslogon via SASauth
    if (process.env.AUTHFLOW === 'authorization_code' || process.env.AUTHFLOW === 'code') {
        return codeAuth(req, h);
    } else {
        let indexHTML = process.env.APPENTRY == null ? 'index.html' : process.env.APPENTRY;
        console.log(`Redirecting to default ${indexHTML}`);
        return h.file(`${indexHTML}`);
    }
}
export default appCallback;