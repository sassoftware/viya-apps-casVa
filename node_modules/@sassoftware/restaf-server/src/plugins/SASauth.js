/*
 *  ------------------------------------------------------------------------------------
 *  * Copyright (c) SAS Institute Inc.
 *  *  Licensed under the Apache License, Version 2.0 (the "License");
 *  * you may not use this file except in compliance with the License.
 *  * You may obtain a copy of the License at
 *  *
 *  * http://www.apache.org/licenses/LICENSE-2.0
 *  *
 *  *  Unless required by applicable law or agreed to in writing, software
 *  * distributed under the License is distributed on an "AS IS" BASIS,
 *  * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  * See the License for the specific language governing permissions and
 *  limitations under the License.
 * ----------------------------------------------------------------------------------------
 *
 */


let bell       = require('@hapi/bell'),
// eslint-disable-next-line no-unused-vars
    uuid       = require('uuid'),
    cookie = require('@hapi/cookie');
    
let debug = require('debug');
let debugbell = debug('bell');
let debugCookie = debug('cookie');
let debugloc = debug('loc');
exports.plugin = {
    name    : 'SASauth',
    version : '1.0.0',
    register: iSASauth
};

async function iSASauth (hapiServer, options) {

    let authCookieOptions,
        bellAuthOptions,
        provider;
    authCookieOptions = {
        cookie: {
            password  : uuid.v4(),
            name      : 'authCookie',
            domain    : process.env.APPHOST,
            isSecure  : options.isSecure,
            isSameSite: options.isSameSite
        },
        
        validateFunc: async function (req, session) {
            // https://hapi.dev/module/cookie/api/?v=11.0.1
            ;
            debugCookie('------------------------------------------------');
            let sid = session.sid; /* set in getAuthApp */
            debugCookie(sid);
            let credentials = await req.server.app.cache.get(sid);
     
            debugCookie(credentials);
            let cred = {
                valid      : credentials != null ? true : false,
                credentials: credentials,
                sid        : sid
            };

            debugCookie('------------------------------------------------');
            return cred;
        }
    };


    const getLocation = (req) => {
        let route =  (process.env.REDIRECT == null) ? `/${process.env.APPNAME}` : '/' + process.env.REDIRECT;
        let info = req.server.info;
        debugloc(req.server.info);
        let location = info.uri + route;
        // Need to do this for docker deployment
        if (info.host === '0.0.0.0') {
            location = `${info.protocol}://localhost:${info.port}${route}`;
        }
        debugloc(location);
        return location;
    };
    if (process.env.AUTHFLOW == 'authorization_code' || process.env.AUTHFLOW === 'code') {
        let authURL = process.env.VIYA_SERVER ;
        provider = {
			name         : 'sas',
			protocol     : 'oauth2',
			useParamsAuth: false,
			auth         : authURL + '/SASLogon/oauth/authorize',
            token        : authURL + '/SASLogon/oauth/token',

            profileMethod: 'get',
            
            profile: async function (credentials, params, get) {
                ;
                debugbell('processing bell profile..........................');
                debugbell(credentials);
                debugbell(params);
                debugbell(get);
                debugbell('processing bell profile..........................');
            }
            
		};
        
        bellAuthOptions = {
            provider    : provider,
            password    : uuid.v4(),
            clientId    : process.env.CLIENTID.trim(),
            clientSecret: (process.env.CLIENTSECRET == null) ? ' ' : process.env.CLIENTSECRET,
            /*location    : getLocation,*/
            
            isSecure: false
        
        };
        await hapiServer.register(bell);
        await hapiServer.register(cookie);
        hapiServer.auth.strategy('session', 'cookie', authCookieOptions);
        hapiServer.auth.strategy('sas', 'bell', bellAuthOptions);
        
        hapiServer.auth.default('session');
    
    }

}