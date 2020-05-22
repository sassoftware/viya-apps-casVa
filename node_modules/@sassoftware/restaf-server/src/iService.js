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


import server from './server';
import { getApp, keepAlive, appCallback, logout, getUser} from './handlers';
let os = require('os');

function iService (uTable, useDefault, asset, allAppEnv) {

	process.env.APPHOST = process.env.APPHOST === '*' ? os.hostname() : process.env.APPHOST;
	let appName = '/' + process.env.APPNAME;
	let auth1 = {};
	let auth1a = {};
	let auth2 = false;
	let defaultMaxBytes = 10485760;

	let maxBytes;
	if (isNaN(process.env.PAYLOADMAXBYTES)) {
		maxBytes = defaultMaxBytes;
	} else {
		maxBytes = Number(process.env.PAYLOADMAXBYTES);
	}

	console.log(`
      appName  : ${appName}
      asset    : ${asset}
      uTable   : ${uTable}
      appenv   : ${JSON.stringify(allAppEnv, null, 4)}
    `);

	let getAppEnv = async (req, h) => {
		return allAppEnv;
	};

	if (process.env.AUTHFLOW === 'authorization_code' || process.env.AUTHFLOW === 'code') {
		auth1 = {
			mode    : 'try',
			strategy: 'sas',
		};
		auth1a = {
			mode    : 'try',
			strategy: 'session',
		};
	} else {
		auth1 = false;
		auth1a = false;
		auth2 = false;
	}

	// see if appenv was overridden

	let hasAppEnv = null;
	if (uTable !== null) {
		hasAppEnv = uTable.find((u) => u.path === '/appenv');
	}

	// end temp patch

	//
	// TBD: Move route definition into the plugin
	//
	let defaultTable = [
		{
			method: ['GET'],
			path  : `${appName}`,
			config: {
				auth   : auth1,
				handler: async (req, h) => {
					return getApp(req, h);
				},
			},
		},
		{
			method: ['GET'],
			path  : `${appName}/appenv`,
			config: {
				auth   : auth2,
				handler: getAppEnv,
			},
		},
		{
			method: ['GET'],
			path  : `${appName}/callback`,
			config: {
				auth   : auth2,
				handler: appCallback,
			},
		},
		{
			method: ['GET'],
			path  : `/callback`,/* need to retire after users switch to appname/callback*/
			config: {
				auth   : auth2,
				handler: appCallback,
			},
		},
		{
			method: ['GET'],
			path  : `/appenv`,
			config: {
				auth   : auth2,
				handler: getAppEnv,
			},
		},
		{
			method: ['GET'],
			path  : `${appName}/{param*}`,
			config: {
				auth   : auth2,
				handler: getApp2,
			},
		},
		{
			method: ['GET'],
			path  : `${appName}/logout`,
			config: {
				auth   : auth1a,
				handler: logout,
			},
		},
		{
			method: ['GET'],
			path  : `${appName}/getfiles/{param*}`,
			config: {
				auth   : auth1a,
				handler: getFiles,
			},
		},
		{
			method: ['GET', 'POST'],
			path  : `${appName}/keepAlive`,
			config: {
				auth   : auth1a,
				handler: keepAlive,
			},
		},
		{
			method: ['GET', 'POST'],
			path  : `/{param*}`,
			config: {
				auth   : false,
				handler: getApp2,
			},
		},
		{
			method: ['GET'],
			path  : `${appName}/user`,
			config: {
				auth   : auth1a,
				handler: getUser,
			},
		},
	];

	let userRouterTable;
	if (uTable !== null) {
		if (useDefault === true) {
			userRouterTable = [...defaultTable, ...uTable];
		} else {
			userRouterTable = [...uTable];
		}
	} else {
		userRouterTable = [...defaultTable];
	}

	console.log(JSON.stringify(userRouterTable, null, 4));
	server(userRouterTable, asset, allAppEnv);
}

//
// get app server files - too small
//

async function getIcon (req, h) {
	return h.file('favicon.ico');
}

async function getApp2 (req, h) {
	return h.file(`${req.params.param}`);
}

async function getFiles (req, h) {
	return 'not ready for primetime';
	/*
    let r = h.file(`${process.env.DATALOC}/${req.params.param}`).header('content-type', 'binary/octet-stream');
    return r;
    */
}

export default iService;
