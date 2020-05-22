/*
* Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
* SPDX-License-Identifier: Apache-2.0
*/
'use strict';
let debug          = require('debug');
let debugProxy     = debug('proxy');
let proxyLogger    = debug('proxylogger');
let responseLogger = debug('response');
let boom           = require('@hapi/boom');
// let request = require('request');
//
// Warning: This section is here for historical reasons since authorization_code works
// properly since the first maintenance of Viya 3.5
//
async function handleProxy (req, h) {  
    let token;
    try {
        token = await getToken(req, h);
        let proxyResponse = await handleProxyRequest(req, h, token);

        let response = h.response(proxyResponse.body);
        for (let hkey in proxyResponse.headers) {
            response.header(hkey, proxyResponse.headers[hkey]);
        }
        return response;
    }
    catch (err) {
        console.log(err);
        return boom.unauthorized(err);
    }
}
async function getToken (req, h) {   
    
    if (req.auth.credentials !== null) {     
        return req.auth.credentials.token;
     } else {     
        let sid = await req.server.app.cache.get(sid);     
        return sid.credentials;
    }
}

async function handleProxyRequest (req, h, token) {
    throw 'Proxy Handling temporarily disabled';
}
/*
function handleProxyRequest (req, h, token) {
    return new Promise((resolve, reject) => {
        
       // let uri = `${process.env.SAS_PROTOCOL}${process.env.VIYA_SERVER}/${req.params.params}`;
        let uri = `${process.env.VIYA_SERVER}/${req.params.params}`;
        let headers = { ...req.headers };
        delete headers.host;
        delete headers['user-agent'];
        delete headers.origin;
        delete headers.referer;
        delete headers.connection;
        if (headers.cookie) {
            delete headers.cookie;
        }
        
        let config = {
            url    : uri,
            method : req.method,
            headers: headers,
            gzip   : true,
            auth   : {
                bearer: token
            }
        };


        if (req.payload != null) {
            // debugProxy(headers['content-type']);
            if (headers['content-type'] === 'application/octet-stream') {
                config.body = req.payload;
            } else {
                config.body = (typeof req.payload === 'object') ? JSON.stringify(req.payload) : req.payload;
            }
        }

        if (req.query !== null && Object.keys(req.query).length > 0) {
            config.qs = req.query;
        }

        debugProxy(JSON.stringify(config, null, 4));
        proxyLogger(config.url);
        
        request(config, (err, response, body) => {
            
            if (err) {
                reject(err);
            } else {
                
                responseLogger({ url: `------------------------------------------${config.url}` });
                responseLogger(req.query);
                responseLogger((typeof body === 'string' ? { body: body } : body));
                // eslint-disable-next-line no-prototype-builtins
                if (response.headers.hasOwnProperty('content-encoding')) {
                    delete response.headers['content-encoding'];
                }
                responseLogger(response.headers['content-coding']);
                
                resolve({ headers: response.headers, body: body });

            }
        });
        
    });
   
}
*/

export default handleProxy;