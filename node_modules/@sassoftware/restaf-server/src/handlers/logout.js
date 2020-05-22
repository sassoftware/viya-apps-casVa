/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
'use strict';

import axios from 'axios';

let debug = require('debug')('logout');

async function logout (req, h) {
    let q = req.query;
    debug(req.state);

    let hh = req.server.info.uri.replace(/0.0.0.0/, 'localhost');
	let callbackUrl = `${hh}/${process.env.APPNAME}`;
	if (q.callbackUrl != null) {
		callbackUrl = `${callbackUrl}/${q.callbackUrl}`;
    };
    
	let url = `${process.env.VIYA_SERVER}/SASLogon/logout.do?callbackUrl=${callbackUrl}`;
    if (process.env.AUTHFLOW === 'code' || process.env.AUTHFLOW === 'authorization_code') {
		let credentials = req.auth.credentials;
		debug(credentials);
		if (credentials != null) {
			let sid = credentials.sid;
			debug(sid);
			await req.server.app.cache.del(sid);
			req.cookieAuth.clear('authCookie');
		} else {
			console.log('Warning: No cookie returned by the browser - probably related to sameSite settings');
		}
    } 
    return h.redirect(url).unstate('authCookie');
}
async function ViyaLogout () {
    let p = {
        method: 'GET',
        url   : `${process.env.VIYA_SERVER}/SASLogon/logout`
    };

    let r = await axios(p);
    debug(r);
}
export default logout;