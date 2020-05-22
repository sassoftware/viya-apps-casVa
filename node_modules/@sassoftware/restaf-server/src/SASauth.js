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
    

async function SASauth (hapiServer, options) {
    let debug = require('debug');
	let debugAuth = debug('auth');
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
            ;
            let credentials = await req.server.app.cache.get(session.sid);

            debugAuth(credentials);
            let cred =  {
                valid      : true,
                credentials: credentials
                };
    
            return cred;
        }
        
    };

  
    const getLocation = (req) => {
        let route = (process.env.REDIRECT == null) ? '/callback' : '/' + process.env.REDIRECT;
        let info = req.server.info;
        let location = info.uri + route;
        // Need to do this for docker deployment
        if (info.host === '0.0.0.0') {
            location = `${info.protocol}://localhost:${info.port}${route}`;
        }
        
        console.log(`redirect set to: ${location}`);
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
            profile      : async function (credentials, params, get) {
                debugAuth(credentials);
                debugAuth(params);
                debug(get);
            }
		};
        
        bellAuthOptions = {
            provider    : provider,
            password    : uuid.v4(),
            clientId    : process.env.CLIENTID.trim(),
            clientSecret: (process.env.CLIENTSECRET == null) ? ' ' : process.env.CLIENTSECRET,
           // location    : getLocation,
            
            isSecure: false
        
        };
        await hapiServer.register(bell);
        await hapiServer.register(cookie);
       
        debugAuth(authCookieOptions);

        hapiServer.auth.strategy('sas', 'bell', bellAuthOptions);
        hapiServer.auth.strategy('session', 'cookie', authCookieOptions);
        hapiServer.auth.default('session');
    
    }

}


module.exports =  SASauth;