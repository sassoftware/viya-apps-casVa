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

'use strict';
// proxy server

let os = require('os');
let Hapi = require('@hapi/hapi'),
	h2o2 = require('@hapi/h2o2');


function proxyServer () {

	let host = (process.env.VHOST === '*') ? os.hostname() : process.env.VHOST;
	let sConfig = {
		port: 8080,
        host: host,
        
		routes: {
			cors: {
				origin     : ['*'],
				credentials: true,

				additionalHeaders: [
					'multipart/form-data',
					'content-disposition'
				],
				additionalExposedHeaders: ['location']
			}
		}
	};


	let hapiServer = Hapi.server(sConfig);

	const init = async () => {
        await hapiServer.register([
            h2o2
			]);
    
        let route = {
                method: '*',
			    path  : '/{param*}',
				
				 
				vhost: process.env.VHOST,

                handler: {
                    proxy: {
                        host: process.env.APPHOST,
                        port: process.env.APPPORT,

						protocol   : 'http',
						passThrough: true,
                    }
                }
		};
		console.log(route);
		hapiServer.route(route);

		await hapiServer.start();

		console.log(`Visit ${hapiServer.info.uri}/documentation for documentation on the API`);
		let uri = hapiServer.info.uri;
		
		// Need to do this for docker deployment
		if (hapiServer.info.host === '0.0.0.0') {
			uri = `${hapiServer.info.protocol}://localhost:${hapiServer.info.port}`;
		}
		console.log(`To access application visit ${uri}/${process.env.APPNAME}`);

	};

	process.on('unhandledRejection', err => {
		console.log(err);
		console.log('unhandled exception');
		process.exit(2);
	});

	init();
}
export default proxyServer;
