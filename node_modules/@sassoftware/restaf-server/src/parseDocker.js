/*
 * Copyright © 2019, SAS Institute Inc., Cary, NC, USA.  All Rights Reserved.
 * SPDX-License-Identifier: Apache-2.0
 */
'use strict';
let parser = require('docker-file-parser');
let fs = require('fs');

function parseDocker (dockerFile) {
	;
	let d = fs.readFileSync(dockerFile, 'utf8');
	let data = parser.parse(d);
	data.forEach(d => {
		if (d.name === 'EXPOSE') {
			process.env.EXPOSEDPORT = d.args[0];
			console.log(`Exposed port: ${process.env.EXPOSEDPORT}`);
		} else if (d.name === 'ENV') {
			for (let key in d.args) {
				let v = d.args[key];
				if (v.length === 0) {
					console.log(
						`Value for ${key} inherited as ${process.env[key]}`
					);
				} else {
					process.env[key] = v;
				}
			}
		}
	});
}

export default parseDocker;
